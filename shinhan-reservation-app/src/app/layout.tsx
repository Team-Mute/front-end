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
import Script from "next/script";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const router = useRouter();

  const userToken = useAuthStore((state) => state.accessToken);
  const adminToken = useAdminAuthStore((state) => state.adminAccessToken);

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      if (!adminToken) {
        router.replace("/admin/login");
      } else {
        setAuthorized(true);
      }
    } else {
      const publicPaths = [
        "/login",
        "/signup",
        "/signup/phone",
        "/",
        "/detail",
      ];

      const isPublicPath =
        publicPaths.includes(pathname) || /^\/spaces\/\d+$/.test(pathname);

      if (!userToken && !isPublicPath) {
        router.replace("/login");
      } else {
        setAuthorized(true);
      }
    }
  }, [pathname, isAdmin, userToken, adminToken, router]);

  const publicAdminPaths = ["/admin/login"];
  const isPublicAdminPath = publicAdminPaths.includes(pathname);

  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Script
          strategy="beforeInteractive"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_API_KEY}&autoload=false&libraries=services`}
        />
        <Global styles={globalStyles} />
        {isAdmin ? <HeaderAdmin /> : <Header />}
        <main>
          {authorized ||
          isPublicAdminPath ||
          (!isAdmin ? userToken : adminToken)
            ? children
            : null}
        </main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
