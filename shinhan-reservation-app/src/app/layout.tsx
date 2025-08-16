"use client";

import Header from "@/components/header/Header";
import HeaderAdmin from "@/components/header/HeaderAdmin";
import { Global } from "@emotion/react";
import { globalStyles } from "@/styles/global";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const router = useRouter();

  useEffect(() => {
    // 토큰 가져오기 (localStorage, cookie 등)
    const userToken = true;
    const adminToken = true;

    if (isAdmin) {
      // 관리자 페이지 접근 시
      if (!adminToken) {
        router.replace("/admin/login");
      }
    } else {
      // 사용자 페이지 접근 시
      if (!userToken && pathname !== "/login" && pathname !== "/signup") {
        router.replace("/login");
      }
    }
  }, [pathname, isAdmin, router]);

  return (
    <html lang="ko">
      <body>
        <Global styles={globalStyles} />
        {isAdmin ? <HeaderAdmin /> : <Header />}
        <main>{children}</main>
      </body>
    </html>
  );
}
