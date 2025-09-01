"use client";

import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import Link from "next/link";
import { VscThreeBars } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";
import { useAuthStore } from "@/store/authStore";
import { logoutApi } from "@/lib/api/userAuth";
import { useRouter } from "next/navigation";

const menuItemsUser = [
  { label: "마이페이지", path: "/mypage" },
  { label: "로그아웃", path: "/logout" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { accessToken } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi(); // 로그아웃 API 호출
      router.push("/login"); // 로그인 페이지로 이동
    } catch (err) {
      console.error("로그아웃 실패", err);
    }
  };

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
          {mounted && accessToken ? (
            <NavButton
              onClick={() => {
                router.push("/mypage/reservations");
              }}
            >
              마이페이지
            </NavButton>
          ) : (
            <NavButton aria-disabled={true}></NavButton>
          )}
          {mounted && accessToken ? (
            <NavButton onClick={handleLogout}>로그아웃</NavButton>
          ) : (
            <NavButton
              onClick={() => {
                router.push("/login");
              }}
            >
              로그인
            </NavButton>
          )}
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
            {mounted && accessToken ? (
              <MenuLink
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/mypage");
                }}
              >
                마이페이지
              </MenuLink>
            ) : (
              <></>
            )}
            {mounted && accessToken ? (
              <MenuLink
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                로그아웃
              </MenuLink>
            ) : (
              <MenuLink
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/login");
                }}
              >
                로그인
              </MenuLink>
            )}

            {/* {menuItemsUser.map(({ label, path }) => (
              <MenuLink
                key={path}
                href={path}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </MenuLink>
            ))} */}
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
  padding: 1.25rem 3.75rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.25rem 2rem;
  }
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

const NavButton = styled.button`
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

const MenuLink = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: black;
  text-decoration: none;
  cursor: pointer;
`;
