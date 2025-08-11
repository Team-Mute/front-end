"use client";

import styled from "@emotion/styled";

const HeaderWrapper = styled.header`
  width: 100%;
  height: 60px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 60px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 20px; // 적절한 크기로 조절
`;

const Right = styled.div`
  display: flex;
  gap: 16px;
  background-color: white;
`;

const NavButton = styled.a`
  background: none;
  border: none;
  color: black;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

import Link from "next/link";

const HeaderAdmin = () => {
  return (
    <HeaderWrapper>
      <Left>
        <Link href="/admin">
          <Logo src="/shinhanLogo.png" alt="로고" />
        </Link>
      </Left>
      <Right></Right>
    </HeaderWrapper>
  );
};

export default HeaderAdmin;
