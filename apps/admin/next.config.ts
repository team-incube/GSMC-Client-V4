import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/certification", "@repo/faq"],
  // API 서버가 HTTPS를 지원하지 않아 브라우저가 직접 호출하면 혼합 콘텐츠로 차단된다.
  // 같은 출처로 요청을 받아 서버에서 API로 넘긴다.
  async rewrites() {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) throw new Error("API_URL 환경변수가 설정되지 않았습니다.");
    return [
      { source: "/api/:path*", destination: `${apiUrl}/api/:path*` },
      { source: "/graphql", destination: `${apiUrl}/graphql` },
    ];
  },
};

export default nextConfig;
