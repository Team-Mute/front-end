"use client";

import Header from "@/components/header/Header";
import HeaderAdmin from "@/components/header/HeaderAdmin";
import { Global } from "@emotion/react";
import { globalStyles } from "@/styles/global";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
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
