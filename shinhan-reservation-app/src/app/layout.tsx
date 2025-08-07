"use client";

import Header from "@/components/Header/Header";
import { Global } from "@emotion/react";
import { globalStyles } from "@/styles/global";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Global styles={globalStyles} />
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
