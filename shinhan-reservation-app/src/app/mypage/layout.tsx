"use client";

import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { label: "공간 예약 내역", href: "/mypage/reservations" },
    { label: "회원 정보 관리", href: "/mypage/user" },
  ];

  return (
    <Wrapper>
      <Sidebar>
        <Menu>
          {menuItems.map((item) => (
            <MenuItem key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </MenuItem>
          ))}
        </Menu>
      </Sidebar>
      <Content>{children}</Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 220px;
  background-color: #f5f5f5;
  padding: 2rem 1rem;
`;

const Menu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin-bottom: 1rem;
  a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    &:hover {
      color: #0070f3;
    }
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: #fff;
`;
