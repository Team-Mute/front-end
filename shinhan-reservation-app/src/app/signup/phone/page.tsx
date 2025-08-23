"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Input from "@/components/common/input/Input";
import Button from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import colors from "@/styles/theme";
import SelectBox from "@/components/common/selectbox/Selectbox";
import { countryCodes } from "@/constants/countryCodes";
import InfoModal from "@/components/modal/InfoModal";
import {
  loginApi,
  sendCodeApi,
  signUpApi,
  verifyCodeApi,
} from "@/lib/api/userAuth";
import { useAuthStore } from "@/store/authStore";
import Loading from "@/components/common/Loading";

export default function SignupPhonePage() {
  const router = useRouter();

  const [countryCode, setCountryCode] = useState("");

  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const [infoMsg, setInfoMsg] = useState(
    "인증코드가 발송되었습니다. 3분 이내에 입력해주세요."
  );
  // 에러 메시지 (인증번호 불일치)
  const [errorMsg, setErrorMsg] = useState("");

  const [showVerification, setShowVerification] = useState(false);

  const [code, setCode] = useState("");

  // 안내 모달
  const [infoTitle, setInfoTitle] = useState("");
  const [infoContents, setInfoContents] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 로딩 (인증번호 보내기, 인증하기)
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  // 회원가입 성공 여부
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  // 이메일 검증
  const validatePhone = (value: string) => {
    const isValid = /^\d{10,11}$/.test(value);
    setIsPhoneValid(isValid);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    validatePhone(value);
  };

  // 전화번호 포맷팅 함수 (숫자 -> 010-1234-1234)
  const formatPhoneNumber = (phoneNumber: string) => {
    if (phoneNumber.length === 10) {
      // 10자리: 010123456 -> 010-123-4567
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
        3,
        6
      )}-${phoneNumber.slice(6)}`;
    } else if (phoneNumber.length === 11) {
      // 11자리: 01012341234 -> 010-1234-1234
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
        3,
        7
      )}-${phoneNumber.slice(7)}`;
    }
    return phoneNumber;
  };

  const signUpData = useAuthStore((state) => state.signUpData);
  const clearSignUpData = useAuthStore((state) => state.clearSignUpData);

  // 인증번호 받기 버튼 클릭
  const handleSendCode = async () => {
    setIsSendingCode(true);
    try {
      // 인증 코드 API 호출
      const response = await sendCodeApi(phone, countryCode);
      console.log("인증번호 보내기 API", response);

      if (response.status === 200) {
        setShowVerification(true);
      }
    } catch (error) {
      console.error("인증번호 발송 실패:", error);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResendCode = async () => {
    setCode("");
    try {
      // 인증 코드 API 호출
      const response = await sendCodeApi(phone, countryCode);

      if (response.status === 200) {
        setShowVerification(true);
      }
    } catch (error) {
      console.error("인증번호 재발송 실패:", error);
    }
  };

  const handleVerifyCode = async () => {
    setIsVerifyingCode(true);

    try {
      // 인증 코드 확인 API 호출
      const response = await verifyCodeApi(phone, code);
      console.log("인증코드 확인 API", response);
      console.log(response.status);

      if (response.status === 200) {
        console.log("인증코드 확인 성공");

        const updatedSignupData = {
          ...signUpData,
          userPhone: formatPhoneNumber(phone),
        };

        try {
          const response = await signUpApi(updatedSignupData);
          console.log("회원가입 API", response);

          if (response.status === 201) {
            setInfoTitle("회원가입 완료!");
            setInfoContents(
              "신한금융희망재단에서 무료로\n공간을 이용해보세요!"
            );
            setIsSignupSuccess(true); // 성공 플래그

            setIsModalOpen(true);
            console.log("회원가입 성공!");
          }
        } catch (error: any) {
          console.error("회원가입 실패:", error);
          if (error.response?.status === 400 && error.response?.data?.message) {
            setInfoTitle("안내");
            setInfoContents(error.response.data.message);
            setIsModalOpen(true);
          } else {
            // 기타 에러 처리 (원한다면 추가)
            setInfoTitle("안내");
            setInfoContents("회원가입 중 오류가 발생했습니다.");
            setIsSignupSuccess(false); // 실패 플래그

            setIsModalOpen(true);
          }
        }
      }
    } catch (error) {
      console.error("인증코드 확인 실패:", error);
      setErrorMsg("인증번호가 일치하지 않습니다. 다시 시도해주세요.");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  return (
    <Container>
      {/* Loading 컴포넌트 호출 */}
      <Loading isLoading={isSendingCode || isVerifyingCode} />

      <TitleText>가입 마지막 단계입니다</TitleText>
      <PhoneValidateForm>
        <CountryTitle>국가 번호</CountryTitle>
        <SelectBox
          options={countryCodes}
          value={countryCode}
          onChange={setCountryCode}
          placeholder="국가 선택"
        />
        <PhoneTitle>휴대폰 번호</PhoneTitle>
        <PhoneWrapper>
          <Input
            placeholder="- 없이 작성해주세요"
            value={phone}
            onChange={handlePhoneChange}
          />
        </PhoneWrapper>

        <ButtonWrapper>
          <Button
            type="button"
            isActive={isPhoneValid && !showVerification}
            onClick={handleSendCode}
          >
            문자로 인증번호 보내기
          </Button>
        </ButtonWrapper>
      </PhoneValidateForm>
      {showVerification && (
        <VerificationContainer>
          <CodeTitle>인증번호</CodeTitle>
          <Input
            placeholder="인증번호"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            infoMessage={infoMsg}
            errorMessage={errorMsg}
          />
          <ReSendWrapper>
            <SmallText>인증번호를 받지 못하셨나요?</SmallText>
            <ReSendButton type="button" onClick={handleResendCode}>
              인증번호 다시 보내기
            </ReSendButton>
          </ReSendWrapper>

          <Button type="button" isActive onClick={handleVerifyCode}>
            인증하기
          </Button>
        </VerificationContainer>
      )}
      <InfoModal
        isOpen={isModalOpen}
        title={infoTitle}
        subtitle={infoContents}
        onClose={async () => {
          setIsModalOpen(false);

          if (isSignupSuccess) {
            try {
              // 로그인 API 호출
              const response = await loginApi(
                signUpData?.userEmail!,
                signUpData?.userPwd!
              );
              if (response.status === 200) {
                // 메인 화면 이동
                router.push("/");

                // signUpData 삭제
                clearSignUpData();
              }
            } catch (error) {
              console.error("자동 로그인 실패", error);
            }
          }
          // 실패면 그냥 모달 닫기만
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

const CountryTitle = styled.p`
  margin-bottom: 8px;
`;

const PhoneTitle = styled.p`
  margin-top: 12px;
  margin-bottom: 8px;
`;

const PhoneValidateForm = styled.form`
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const PhoneWrapper = styled.div`
  margin-bottom: 4px;
`;

const ButtonWrapper = styled.div`
  margin-top: 32px;
`;

const VerificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;
const CodeTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;
const SmallText = styled.p`
  font-size: 12px;
  color: gray;
`;

const ReSendWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 12px;
`;

const ReSendButton = styled.button`
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-decoration-color: ${colors.graycolor100};
  font-size: 12px;
  cursor: pointer;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
