"use client";

import Header from "@/components/header/Header";
import HeaderAdmin from "@/components/header/HeaderAdmin";
import { Global } from "@emotion/react";
import { globalStyles } from "@/styles/global";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const router = useRouter();

  const userToken = useAuthStore((state) => state.accessToken);
  const adminToken = useAdminAuthStore((state) => state.adminAccessToken);

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 토큰 가져오기 (localStorage, cookie 등)

    if (isAdmin) {
      // 관리자 페이지 접근 시
      if (!adminToken) {
        router.replace("/admin/login");
      } else {
        setAuthorized(true);
      }
    } else {
      // 사용자 페이지 접근 시
      const publicPaths = [
        "/login",
        "/signup",
        "/signup/phone",
        "/",
        "/detail",
      ];
      if (!userToken && !publicPaths.includes(pathname)) {
        router.replace("/login");
      } else {
        setAuthorized(true);
      }
    }
  }, [pathname, isAdmin, userToken, adminToken, router]);

  // 토큰 체크가 끝날 때까지 아무것도 렌더링하지 않음
  const publicAdminPaths = ["/admin/login"];

  const isPublicAdminPath = publicAdminPaths.includes(pathname);

  if (
    !authorized &&
    !(isPublicAdminPath || (!isAdmin ? userToken : adminToken))
  ) {
    return (
      <html lang="ko">
        <body>
          <Global styles={globalStyles} />
          {isAdmin ? <HeaderAdmin /> : <Header />}
          <main></main>
        </body>
      </html>
    );
  }

  return (
    <html lang="ko">
      <body>
        <Global styles={globalStyles} />
        {isAdmin ? <HeaderAdmin /> : <Header />}
        <main>{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
