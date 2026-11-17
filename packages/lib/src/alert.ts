import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { toKstDate } from "./date";
import { graphqlRequest } from "./graphql";
import { getAccessToken } from "./session/tokenStorage";

export type AlertType = "ADD_SCORE" | "APPROVED" | "REJECTED";

export type Alert = {
  alertId: string;
  scoreId: string | null;
  alertType: AlertType;
  content: string;
  isRead: boolean;
  createdAt: string;
};

type AlertPage = {
  alerts: Alert[];
  hasNextPage: boolean;
  endCursor: string | null;
};

type MyAlertConnectionResponse = {
  myAlertConnection: {
    edges: { node: Alert }[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

const PAGE_SIZE = 20;

const MY_ALERT_CONNECTION = `
  query($first: Int, $after: String) {
    myAlertConnection(first: $first, after: $after) {
      edges { node { alertId scoreId alertType content isRead createdAt } }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

const PATCH_ALERT_IS_READ = `
  mutation($input: PatchAlertIsReadInput!) {
    patchAlertIsRead(input: $input)
  }
`;

const DELETE_ALERT = `
  mutation($alertId: ID!) {
    deleteAlert(alertId: $alertId)
  }
`;

export const alertKeys = {
  all: ["alerts"] as const,
};

export const ALERT_TYPE_LABEL: Record<AlertType, string> = {
  ADD_SCORE: "점수 추가",
  APPROVED: "승인",
  REJECTED: "반려",
};

const ALERT_TYPE_TONE: Record<AlertType, "default" | "brand" | "danger"> = {
  ADD_SCORE: "default",
  APPROVED: "brand",
  REJECTED: "danger",
};

export async function fetchMyAlertPage(after: string | null): Promise<AlertPage> {
  const { myAlertConnection } = await graphqlRequest<MyAlertConnectionResponse>(MY_ALERT_CONNECTION, {
    first: PAGE_SIZE,
    after,
  });
  return {
    alerts: myAlertConnection.edges.map((edge) => edge.node),
    hasNextPage: myAlertConnection.pageInfo.hasNextPage,
    endCursor: myAlertConnection.pageInfo.endCursor,
  };
}

// 서버는 lastAlertId 이하의 안 읽은 알림을 모두 읽음 처리한다.
export async function readAlertsUpTo(lastAlertId: string) {
  await graphqlRequest(PATCH_ALERT_IS_READ, { input: { lastAlertId } });
}

export async function deleteAlert(alertId: string) {
  await graphqlRequest(DELETE_ALERT, { alertId });
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// 일주일 안의 알림은 상대 시간으로, 그보다 오래되면 날짜로 보여 준다.
export function formatAlertTime(createdAt: string, now = Date.now()) {
  const elapsed = now - new Date(createdAt).getTime();
  if (Number.isNaN(elapsed)) return toKstDate(createdAt);
  if (elapsed < MINUTE) return "방금 전";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}분 전`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}시간 전`;
  if (elapsed < 7 * DAY) return `${Math.floor(elapsed / DAY)}일 전`;
  return toKstDate(createdAt).replaceAll("-", ".");
}

type AlertPages = InfiniteData<AlertPage, string | null>;

function updateAlerts(data: AlertPages | undefined, update: (alerts: Alert[]) => Alert[]) {
  if (!data) return data;
  return { ...data, pages: data.pages.map((page) => ({ ...page, alerts: update(page.alerts) })) };
}

type UseAlertNotificationsOptions = {
  // 알림을 눌렀을 때 이동할 주소. 없으면 누를 수 없는 알림으로 보여 준다.
  getHref?: (alert: Alert) => string | undefined;
};

// 헤더 알림 메뉴(@repo/ui NotificationMenu)에 그대로 넘길 수 있는 형태로 돌려준다.
export function useAlertNotifications({ getHref }: UseAlertNotificationsOptions = {}) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: alertKeys.all,
    queryFn: ({ pageParam }) => fetchMyAlertPage(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.endCursor : undefined),
    // 헤더는 로그인 전에도 렌더되므로 토큰이 있을 때만 조회한다. 서버에서는 조회하지 않는다.
    enabled: typeof window !== "undefined" && getAccessToken() !== null,
  });

  const alerts = query.data?.pages.flatMap((page) => page.alerts) ?? [];

  const readMutation = useMutation({
    mutationFn: readAlertsUpTo,
    onSuccess: (_, lastAlertId) => {
      queryClient.setQueryData<AlertPages>(alertKeys.all, (data) =>
        updateAlerts(data, (list) =>
          list.map((alert) => (Number(alert.alertId) <= Number(lastAlertId) ? { ...alert, isRead: true } : alert)),
        ),
      );
    },
    // 읽음 처리가 끝난 뒤에 다시 조회해야 진행 중인 조회가 읽음 상태를 덮어쓰지 않는다.
    onSettled: () => queryClient.invalidateQueries({ queryKey: alertKeys.all }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAlert,
    onMutate: async (alertId) => {
      await queryClient.cancelQueries({ queryKey: alertKeys.all });
      const previous = queryClient.getQueryData<AlertPages>(alertKeys.all);
      queryClient.setQueryData<AlertPages>(alertKeys.all, (data) =>
        updateAlerts(data, (list) => list.filter((alert) => alert.alertId !== alertId)),
      );
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) queryClient.setQueryData(alertKeys.all, context.previous);
    },
  });

  // 안 읽은 알림이 있으면 읽음 처리 후 다시 조회하고, 없으면 바로 다시 조회한다.
  const handleOpen = () => {
    const unread = alerts.filter((alert) => !alert.isRead);
    if (unread.length === 0) {
      if (!query.isFetching) void query.refetch();
      return;
    }
    const lastAlertId = unread.reduce(
      (max, alert) => (Number(alert.alertId) > Number(max) ? alert.alertId : max),
      unread[0].alertId,
    );
    readMutation.mutate(lastAlertId);
  };

  const status: "pending" | "error" | "success" = query.isError ? "error" : query.data ? "success" : "pending";

  return {
    items: alerts.map((alert) => ({
      id: alert.alertId,
      label: ALERT_TYPE_LABEL[alert.alertType] ?? "알림",
      tone: ALERT_TYPE_TONE[alert.alertType] ?? "default",
      content: alert.content,
      isRead: alert.isRead,
      time: formatAlertTime(alert.createdAt),
      href: getHref?.(alert),
    })),
    hasUnread: alerts.some((alert) => !alert.isRead),
    status,
    hasMore: query.hasNextPage,
    isLoadingMore: query.isFetchingNextPage,
    onOpen: handleOpen,
    onLoadMore: () => {
      if (!query.isFetchingNextPage) void query.fetchNextPage();
    },
    onDelete: (id: string) => deleteMutation.mutate(id),
    onRetry: () => void query.refetch(),
  };
}
