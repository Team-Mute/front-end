"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Button from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import InfoModal from "@/components/modal/InfoModal";
import SelectBox2 from "@/components/common/Selectbox2";

export default function SignupRolePage() {
  const router = useRouter();

  const [region, setRegion] = useState("");
  const [role, setRole] = useState("");

  // 관리 지역
  const regions = [
    { label: "서울", value: "서울" },
    { label: "인천", value: "인천" },
    { label: "대구", value: "대구" },
    { label: "대전", value: "대전" },
  ];

  // 권한
  const roles = [
    { label: "1차 승인자", value: "1차 승인자" },
    { label: "2차 승인자", value: "2차 승인자" },
  ];

  // 회원가입 완료 모달
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container>
      <TitleText>관리할 지역과 권한을 설정하세요</TitleText>
      <RoleForm>
        <SelectBox2
          options={regions}
          value={region}
          onChange={setRegion}
          placeholder="관리지역 선택"
        />
        <Gap />
        <SelectBox2
          options={roles}
          value={role}
          onChange={setRole}
          placeholder="권한 설정"
        />

        <ButtonWrapper>
          <Button
            type="button"
            isActive={!!region && !!role}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            회원가입 완료
          </Button>
        </ButtonWrapper>
      </RoleForm>

      <InfoModal
        isOpen={isModalOpen}
        title={"회원가입 완료!"}
        subtitle={"환영합니다!\n이제 공간과 예약 관리를 시작해보세요."}
        onClose={() => {
          setIsModalOpen(false);
          router.push("/admin");
        }}
      ></InfoModal>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
`;

const TitleText = styled.h2`
  font-size: 24px;
  line-height: 1.5;
  text-align: center;
  margin-top: 120px;
  margin-bottom: 24px;
  font-weight: 500;
`;

const RoleForm = styled.form`
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const Gap = styled.div`
  display: flex;
  height: 12px;
`;

const ButtonWrapper = styled.div`
  margin-top: 32px;
`;
