"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Input from "@/components/common/input/Input";
import Button from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import colors from "@/styles/theme";
import SelectBox from "@/components/common/Selectbox";
import { countryCodes } from "@/constants/countryCodes";
import InfoModal from "@/components/modal/InfoModal";

export default function SignupPhonePage() {
  const router = useRouter();

  const [countryCode, setCountryCode] = useState("");

  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  // 에러 메시지 (이메일 중복)
  const [errors, setErrors] = useState({});

  const [showVerification, setShowVerification] = useState(false);

  const [code, setCode] = useState("");

  // 회원가입 완료 모달
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // 인증번호 받기 버튼 클릭
  const handleSendCode = async () => {
    try {
      // 서버 API 호출 (이메일 중복 체크 & 인증번호 발송)
      const isSuccess = true; // 임시 하드코딩
      if (isSuccess) {
        setShowVerification(true);
        //   setEmailError("");
      } else {
        //   setEmailError("이미 가입된 이메일입니다.");
      }
    } catch (err) {
      // setEmailError("서버 에러가 발생했습니다.");
    }
  };

  const handleResendCode = () => {
    console.log("인증번호 재발송");
  };

  const handleVerifyCode = () => {
    console.log("인증 시도:", code);

    setIsModalOpen(true);
  };

  return (
    <Container>
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
            infoMessage="인증코드가 발송되었습니다. 3분 이내에 입력해주세요."
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
        title={"회원가입 완료!"}
        subtitle={"신한금융희망재단에서 무료로\n공간을 이용해보세요!"}
        onClose={() => {
          setIsModalOpen(false);
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
