"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Input from "@/components/common/input/Input";
import Button from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import colors from "@/styles/theme";

export default function SignupEmailPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  // 에러 메시지 (이메일 중복)
  const [errors, setErrors] = useState({});

  const [showVerification, setShowVerification] = useState(false);

  const [code, setCode] = useState("");

  // 이메일 검증
  const validateEmail = (value: string) => {
    const isValid = /\S+@\S+\.\S+/.test(value);
    setIsEmailValid(isValid);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
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
    router.push("/signup/phone");
  };

  return (
    <Container>
      <TitleText>이메일 인증만 하면 마지막!</TitleText>
      <EmailValidateForm>
        <EmailWrapper>
          <Input
            placeholder="이메일"
            infoMessage="인증번호를 받기 위해 정확한 이메일 주소를 입력해주세요."
            value={email}
            onChange={handleEmailChange}
          />
        </EmailWrapper>

        <ButtonWrapper>
          <Button
            type="button"
            isActive={isEmailValid && !showVerification}
            onClick={handleSendCode}
          >
            인증번호 받기
          </Button>
        </ButtonWrapper>
      </EmailValidateForm>
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
  margin-bottom: 40px;
  font-weight: 500;
`;

const EmailValidateForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`;

const EmailWrapper = styled.div`
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
