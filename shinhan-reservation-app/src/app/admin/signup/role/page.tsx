"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Button from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import InfoModal from "@/components/modal/InfoModal";
import SelectBox2 from "@/components/common/selectbox/Selectbox2";
import { adminSignUpApi } from "@/lib/api/adminAuth";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import Loading from "@/components/common/Loading";

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
    { label: "1차 승인자", value: "2" },
    { label: "2차 승인자", value: "1" },
    { label: "마스터", value: "0" },
  ];

  // 회원가입 완료 모달
  const [infoTitle, setInfoTitle] = useState("");
  const [infoContents, setInfoContents] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 로딩
  const [isLoading, setIsLoading] = useState(false);

  // 회원가입 성공 여부
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  const adminSignUpData = useAdminAuthStore((state) => state.adminSignUpData);
  const clearAdminSignUpData = useAdminAuthStore(
    (state) => state.clearAdminSignUpData
  );

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      const updatedAdminSignupData = {
        ...adminSignUpData,
        roleId: Number(role),
        regionName: region,
      };

      const response = await adminSignUpApi(updatedAdminSignupData);
      if (response.status === 201) {
        setInfoTitle("회원가입 완료");
        setInfoContents("환영합니다!\n이제 공간과 예약 관리를 시작해보세요.");
        setIsSignupSuccess(true); // 성공 플래그
        setIsModalOpen(true);
        clearAdminSignUpData();
      }
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.message) {
        setInfoTitle("안내");
        setInfoContents(error.response.data.message);
        setIsModalOpen(true);
      } else {
        setInfoTitle("안내");
        setInfoContents("회원가입 중 오류가 발생했습니다.");
        setIsSignupSuccess(false); // 실패 플래그

        setIsModalOpen(true);
      }
      console.log("회원 생성 완료!", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
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
            onClick={handleComplete}
          >
            회원가입 완료
          </Button>
        </ButtonWrapper>
      </RoleForm>

      <InfoModal
        isOpen={isModalOpen}
        title={infoTitle}
        subtitle={infoContents}
        onClose={() => {
          setIsModalOpen(false);

          if (isSignupSuccess) {
            router.push("/admin/signup");
          }
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
