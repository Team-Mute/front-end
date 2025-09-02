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
  // [수정] isInvitation 변수 사용
  const isInvitation = pathname.startsWith("/invitation");
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
      
      // [수정] isInvitation을 공개 경로 조건에 추가
      const isPublicPath =
        publicPaths.includes(pathname) || 
        /^\/spaces\/\d+$/.test(pathname) ||
        isInvitation; // 초대장 경로는 항상 public

      if (!userToken && !isPublicPath) {
        router.replace("/login");
      } else {
        setAuthorized(true);
      }
    }
  }, [pathname, isAdmin, isInvitation, userToken, adminToken, router]);

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

        {/* [수정] isInvitation이 아닐 때만 헤더 렌더링 */}
        {!isInvitation && (isAdmin ? <HeaderAdmin /> : <Header />)}
        
        <main>
          {authorized ||
          isPublicAdminPath ||
          // 초대장 페이지는 인증 여부와 관계없이 항상 children을 렌더링
          isInvitation || 
          (!isAdmin ? userToken : adminToken)
            ? children
            : null}
        </main>

        {/* [수정] isAdmin과 isInvitation이 모두 아닐 때만 푸터 렌더링 */}
        {!isAdmin && !isInvitation && <Footer />}
      </body>
    </html>
  );
}