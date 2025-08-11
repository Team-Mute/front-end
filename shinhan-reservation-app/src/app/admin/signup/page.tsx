"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Input from "@/components/common/input/Input";
import Checkbox from "@/components/common/Checkbox";
import colors from "@/styles/theme";
import Button from "@/components/common/button/Button";
import ScrollModal from "@/components/modal/ScrollModal";
import { useRouter } from "next/navigation";

import { TERMS_OF_SERVICE_HTML, PRIVACY_POLICY_HTML } from "@/constants/terms";

export default function SignupPage() {
  const router = useRouter();

  // 약관 동의 상태
  const [isAllAgreed, setIsAllAgreed] = useState(false);
  const [termsOfService, setTermsOfService] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);

  // 모달 상태 (약관창)
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // 모달 내용
  const [termsContent, setTermsContent] = useState("");

  // 입력 값
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [emailInfoMsg, setEmailInfoMsg] = useState(
    "정확한 이메일 주소를 입력해주세요."
  );

  // 이메일 검증
  const validateEmail = (value: string) => {
    const isValid = /\S+@\S+\.\S+/.test(value);
    setEmailErrorMsg(!isValid ? "이메일 형식이 올바르지 않아요" : "");
    if (isValid) {
      setEmailInfoMsg("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  // 에러 메시지 (비밀번호 규칙, 일치 여부)
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  // 모두 동의 시 하위 항목 모두 체크
  const handleAllAgreeChange = () => {
    const newValue = !isAllAgreed;
    setIsAllAgreed(newValue);
    setTermsOfService(newValue);
    setPrivacyPolicy(newValue);
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    // 모든 필수 입력값이 채워졌는지 확인
    // 에러 메시지가 없는지 확인

    return Boolean(
      name &&
        email &&
        password &&
        confirmPassword &&
        errors.password === "" &&
        errors.confirmPassword === "" &&
        termsOfService &&
        privacyPolicy
    );
  };

  // 하위 항목이 바뀌면 모두 동의 상태 업데이트
  useEffect(() => {
    const allChecked = termsOfService && privacyPolicy;

    setIsAllAgreed(allChecked);
  }, [termsOfService, privacyPolicy]);

  // 비밀번호 검증
  const validatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;

    if (value.length < 8 || !passwordRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        password: "8자 이상, 숫자와 특수문자를 입력해주세요",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  // 비밀번호 확인 검증
  useEffect(() => {
    if (confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          password === confirmPassword ? "" : "비밀번호가 일치하지 않습니다",
      }));
    }
  }, [password, confirmPassword]);

  return (
    <Container>
      <TitleText>회원가입</TitleText>
      <SignupForm>
        <Wrapper>
          <Input
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Wrapper>
        <Wrapper>
          <Input
            placeholder="이메일"
            infoMessage={!emailErrorMsg ? emailInfoMsg : undefined}
            value={email}
            onChange={handleEmailChange}
            errorMessage={emailErrorMsg}
          />
        </Wrapper>
        <Wrapper>
          <Input
            type="password"
            value={password}
            placeholder="비밀번호"
            onChange={validatePassword}
            errorMessage={errors.password}
            autoComplete="off"
          />
        </Wrapper>
        <Wrapper>
          <Input
            type="password"
            value={confirmPassword}
            placeholder="비밀번호 확인"
            onChange={(e) => setConfirmPassword(e.target.value)}
            errorMessage={errors.confirmPassword}
            autoComplete="off"
          />
        </Wrapper>

        <CheckboxWrapper>
          <Checkbox
            checked={isAllAgreed}
            onChange={handleAllAgreeChange}
            label="아래 약관에 모두 동의합니다"
          />
        </CheckboxWrapper>

        <Divider />

        <CheckboxWrapper>
          <Checkbox
            checked={termsOfService}
            onChange={() => setTermsOfService((prev) => !prev)}
            label="서비스 이용약관 (필수)"
            isUnderlined={true}
            labelClickable={true}
            onLabelClick={() => {
              setTermsContent(TERMS_OF_SERVICE_HTML);
              setIsTermsOpen(true);
            }}
          />
        </CheckboxWrapper>
        <CheckboxWrapper>
          <Checkbox
            checked={privacyPolicy}
            onChange={() => setPrivacyPolicy((prev) => !prev)}
            label="개인정보 수집이용 (필수)"
            isUnderlined={true}
            labelClickable={true}
            onLabelClick={() => {
              setTermsContent(PRIVACY_POLICY_HTML);
              setIsTermsOpen(true);
            }}
          />
        </CheckboxWrapper>

        <ButtonWrapper>
          <Button
            type="button"
            isActive={isFormValid()}
            onClick={() => {
              router.push("/admin/signup/role");
            }}
          >
            다음
          </Button>
        </ButtonWrapper>
      </SignupForm>
      <ScrollModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)}>
        {termsContent}
      </ScrollModal>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  //   padding: 40px 20px;
  padding-top: 24px;
`;

const TitleText = styled.h2`
  font-size: 24px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 24px;
  font-weight: 500;
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`;

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 12px;
  flex-direction: column;
`;

const CheckboxWrapper = styled.div`
  width: 100%;
  max-width: 353px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 8px;
`;

const Divider = styled.hr`
  width: 353px;
  height: 1px;
  background-color: ${colors.graycolor10}; // 테마에 정의된 얇은 회색 선
  border: none;
  margin-top: 3px;
  margin-bottom: 12px;
`;

const ButtonWrapper = styled.div`
  margin-top: 32px;
  margin-bottom: 24px;
`;
