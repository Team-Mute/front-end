"use client";

import styled from "@emotion/styled";
import { useState } from "react";
import Link from "next/link";
import { VscThreeBars } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";
import colors from "@/styles/theme";

const menuItemsUser = [
  { label: "마이페이지", path: "/mypage" },
  { label: "로그아웃", path: "/logout" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <HeaderWrapper>
        <Left>
          <Link href="/">
            <Logo src="/shinhanLogo.png" alt="로고" />
          </Link>
        </Left>
        {/* 데스크탑 메뉴 */}
        <Right>
          {menuItemsUser.map(({ label, path }) => (
            <NavButton key={path} as={Link} href={path}>
              {label}
            </NavButton>
          ))}
        </Right>
        {/* 모바일 햄버거 */}
        <HamburgerButton onClick={() => setMenuOpen(true)}>
          <VscThreeBars size={24} />
        </HamburgerButton>
      </HeaderWrapper>

      {/* 모바일 메뉴 오버레이 */}
      {menuOpen && (
        <Overlay>
          <CloseButton onClick={() => setMenuOpen(false)}>
            <IoClose size={28} />
          </CloseButton>
          <MenuList>
            {menuItemsUser.map(({ label, path }) => (
              <MenuLink
                key={path}
                href={path}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </MenuLink>
            ))}
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
  position: relative;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 20px;
`;

const Right = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    display: none; // 모바일에서는 숨김
  }
`;

const NavButton = styled.a`
  background: none;
  border: none;
  color: black;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block; // 모바일에서만 햄버거
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
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  align-self: flex-end;
`;

const MenuList = styled.nav`
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MenuLink = styled(Link)`
  font-size: 18px;
  font-weight: 500;
  color: black;
  text-decoration: none;
`;
