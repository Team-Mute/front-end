"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import styled from "@emotion/styled";
import colors from "@/styles/theme";

// 아이콘
import DashboardIcon from "@/styles/icons/dashboard.svg";
import ReservationIcon from "@/styles/icons/reservation.svg";
import SpaceIcon from "@/styles/icons/space.svg";
import ReportIcon from "@/styles/icons/report.svg";
import LogoutIcon from "@/styles/icons/logout.svg";

type MenuKey = "dashboard" | "reservation" | "space" | "report";

const menuItems: { key: MenuKey; label: string; path: string }[] = [
  { key: "dashboard", label: "대시보드", path: "/admin/dashboard" },
  { key: "reservation", label: "예약관리", path: "/admin/reservation" },
  { key: "space", label: "공간관리", path: "/admin/space" },
  { key: "report", label: "통계 및 보고서", path: "/admin/report" },
];

const iconMap = {
  dashboard: DashboardIcon,
  reservation: ReservationIcon,
  space: SpaceIcon,
  report: ReportIcon,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // login/signup 페이지일 때는 메뉴바 없이 children만 반환
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/signup")
  ) {
    return <>{children}</>;
  }

  return (
    <Container>
      <Menu>
        <MenuList>
          {menuItems.map(({ key, label, path }) => {
            const IconComponent = iconMap[key];
            const selected = pathname === path;
            return (
              <MenuButton
                key={key}
                selected={selected}
                onClick={() => router.push(path)}
              >
                <IconComponent />
                {label}
              </MenuButton>
            );
          })}
        </MenuList>
        <Logout>
          <MenuButton>
            <LogoutIcon />
            로그아웃
          </MenuButton>
        </Logout>
      </Menu>
      <Content>{children}</Content>
    </Container>
  );
}

// --- styled ---
const Container = styled.div`
  display: flex;
  height: calc(100vh - var(--header-height)); /* 뷰포트 전체 높이 고정 */
  overflow: hidden; /* body 대신 여기서 스크롤 제어 */
`;

const Menu = styled.nav`
  box-sizing: border-box;
  width: 16.25rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${colors.graycolor10};
  padding: 1.5rem 1.25rem;

  @media (max-width: 768px) {
    display: none; // 모바일에서는 숨김
  }
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuButton = styled.button<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  width: 220px;
  height: 56px;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 16px;
  font-weight: 500;
  color: ${colors.graycolor100};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    color: ${colors.maincolor};
    background-color: ${colors.maincolor5};
    svg {
      stroke: ${colors.maincolor};
    }
  }

  svg {
    margin-right: 16px;
  }
`;

const Logout = styled.div`
  margin-bottom: 1.25rem;
`;

const Content = styled.section`
  flex: 1;
  padding-top: 2rem;
  padding-left: 2.38rem;
  padding-right: 1.7rem;
  background-color: white;
  border-top: 1px solid ${colors.graycolor10};
  overflow-y: auto; /* 컨텐츠가 넘칠 경우 이 영역만 스크롤 */
`;
