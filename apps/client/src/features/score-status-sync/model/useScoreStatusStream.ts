import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAccessToken, type Alert, type AlertType } from "@repo/lib";
import { certificationKeys } from "@/entities/certification";
import { projectKeys } from "@/entities/project";

const STREAM_URL = "/api/alerts/stream";
const RETRY_DELAY = 5000;

// EventSource는 Authorization 헤더를 못 붙이므로 fetch로 스트림을 읽는다.
// shortcut: 401이면 토큰 갱신 없이 멈춘다. 다음 API 호출의 갱신 뒤 화면을 다시 열면 재연결된다.
export function useScoreStatusStream() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const controller = new AbortController();

    // 서버(AlertSseNotifier)는 `event:alert`에 AlertEventPayload JSON을 담아 보낸다.
    // `connected`, `heartbeat` 이벤트는 data가 없어 무시한다.
    const handleEvent = (event: string) => {
      let name = "message";
      const data: string[] = [];
      for (const line of event.split("\n")) {
        if (line.startsWith("event:")) name = line.slice(6).trim();
        else if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
      }
      if (name !== "alert" || data.length === 0) return;
      let alertType: AlertType;
      try {
        alertType = (JSON.parse(data.join("\n")) as Pick<Alert, "alertType">).alertType;
      } catch {
        return;
      }
      if (alertType !== "APPROVED" && alertType !== "REJECTED") return;
      void queryClient.invalidateQueries({ queryKey: projectKeys.all });
      void queryClient.invalidateQueries({ queryKey: certificationKeys.all });
    };

    async function connect() {
      while (!controller.signal.aborted) {
        const token = getAccessToken();
        if (!token) return;
        try {
          const res = await fetch(STREAM_URL, {
            headers: { Authorization: `Bearer ${token}`, Accept: "text/event-stream" },
            signal: controller.signal,
          });
          if (res.status === 401) return;
          if (res.ok && res.body) {
            const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
            let buffer = "";
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              // 청크 경계에서 \r과 \n이 갈릴 수 있어 이어 붙인 뒤에 줄바꿈을 정규화한다.
              buffer = (buffer + value).replaceAll("\r\n", "\n");
              const events = buffer.split("\n\n");
              buffer = events.pop() ?? "";
              events.forEach(handleEvent);
            }
          }
        } catch {
          if (controller.signal.aborted) return;
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }

    void connect();
    return () => controller.abort();
  }, [queryClient]);
}
