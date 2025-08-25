"use client";

import styled from "@emotion/styled";
import { useState } from "react";
import { VscThreeBars } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import colors from "@/styles/theme";

// 아이콘
import DashboardIcon from "@/styles/icons/dashboard.svg";
import ReservationIcon from "@/styles/icons/reservation.svg";
import SpaceIcon from "@/styles/icons/space.svg";
import ReportIcon from "@/styles/icons/report.svg";
import LogoutIcon from "@/styles/icons/logout.svg";
import AddUserIcon from "@/styles/icons/adduser.svg";
import ThreeLine from "@/styles/icons/threeline.svg";

import { useRouter } from "next/navigation";
import { adminLogoutApi } from "@/lib/api/admin/adminAuth";
import { useAdminAuthStore } from "@/store/adminAuthStore";

type MenuItem = { label: string; path: string; icon: React.FC };

const menuItems: MenuItem[] = [
  { label: "대시보드", path: "/admin/dashboard", icon: DashboardIcon },
  { label: "예약관리", path: "/admin/reservation", icon: ReservationIcon },
  { label: "공간관리", path: "/admin/space", icon: SpaceIcon },
  { label: "통계 및 보고서", path: "/admin/report", icon: ReportIcon },
];

export default function HeaderAdmin() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { adminAccessToken, adminRoleId } = useAdminAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await adminLogoutApi(); // 로그아웃 API 호출
      setMenuOpen(false);
      router.push("/admin/login"); // 로그인 페이지로 이동
    } catch (err) {
      console.error("로그아웃 실패", err);
    }
  };

  return (
    <>
      <HeaderWrapper>
        <Link href="/admin/dashboard">
          <Logo src="/shinhanLogo.png" alt="로고" />
        </Link>
        {adminAccessToken && (
          <HamburgerButton onClick={() => setMenuOpen(true)}>
            <ThreeLine />
          </HamburgerButton>
        )}
      </HeaderWrapper>

      {/* 모바일 메뉴 오버레이 */}
      {menuOpen && (
        <Overlay>
          <CloseButton onClick={() => setMenuOpen(false)}>
            <IoClose size={28} />
          </CloseButton>
          <MenuList>
            {menuItems.map(({ label, path, icon: Icon }) => (
              <MenuLink
                key={path}
                href={path}
                onClick={() => setMenuOpen(false)}
              >
                <Icon />
                {label}
              </MenuLink>
            ))}
            {/* roleId가 0인 관리자만 회원가입 메뉴 노출 */}
            {adminRoleId === 0 && (
              <MenuLink href="/admin/signup">
                <AddUserIcon />
                계정 만들기
              </MenuLink>
            )}
            <MenuLink href={"/"} onClick={handleLogout}>
              <LogoutIcon />
              로그아웃
            </MenuLink>
          </MenuList>
        </Overlay>
      )}
    </>
  );
}

// --- styled ---
const HeaderWrapper = styled.header`
  width: 100%;
  height: var(--header-height);
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const Logo = styled.img`
  height: 20px;
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 1000;
  padding: 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const MenuList = styled.nav`
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 16px;
  color: ${colors.graycolor100};
  text-decoration: none;
  height: 3.5rem;
  //   background-color: beige;
  padding-left: 1rem;
`;
