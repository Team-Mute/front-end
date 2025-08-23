"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import Input from "@/components/common/input/Input";
import colors from "@/styles/theme";
import Button from "@/components/common/button/Button";
import Link from "next/link";
import Loading from "@/components/common/Loading";
import { adminLoginApi } from "@/lib/api/adminAuth";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useRouter } from "next/navigation";
import InfoModal from "@/components/modal/InfoModal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 모달 안내사항
  const [infoTitle, setInfoTitle] = useState("");
  const [infoContents, setInfoContents] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateEmail = (value: string) => {
    const isValid = /\S+@\S+\.\S+/.test(value);
    setIsEmailValid(isValid); // ✅ 여기 추가

    setEmailError(!value ? "" : isValid ? "" : "이메일 형식이 맞지 않습니다.");
  };

  //   const validatePassword = (value: string) => {
  //     setPasswordError(!value ? "비밀번호를 입력해주세요." : "");
  //   };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    // validatePassword(value);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await adminLoginApi(email, password);

      if (response.status === 200) {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      if (err.status === 401) {
        setInfoTitle("안내");
        setInfoContents("로그인에 실패했습니다.");
        setIsModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <GreetingText>
        안녕하세요,
        <br />
        신한금융희망재단입니다.
      </GreetingText>

      <LoginForm onSubmit={(e) => e.preventDefault()}>
        <InputWrapper>
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <ErrorText>{emailError}</ErrorText>}
        </InputWrapper>

        <InputWrapper>
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <ErrorText>{passwordError}</ErrorText>}
        </InputWrapper>

        <FindPasswordButton type="button">비밀번호 찾기</FindPasswordButton>
        <Button
          type="submit"
          isActive={isEmailValid && !!password}
          onClick={handleLogin}
        >
          로그인
        </Button>
      </LoginForm>

      {/* <BottomText>
        아직 회원이 아니신가요?
        <SignUpButton type="button" as={Link} href="/admin/signup">
          회원가입
        </SignUpButton>
      </BottomText> */}
      <InfoModal
        isOpen={isModalOpen}
        title={infoTitle}
        subtitle={infoContents}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
`;

const GreetingText = styled.h2`
  font-size: 24px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 500;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;

  & > input:nth-of-type(2) {
    margin-top: 12px; /* 이메일 → 비밀번호 */
  }

  & > button[type="button"]:first-of-type {
    margin-top: 12px; /* 비밀번호 → 비밀번호 찾기 */
  }

  & > button[type="submit"] {
    margin-top: 32px; /* 비밀번호 찾기 → 로그인 */
  }
`;

const FindPasswordButton = styled.button`
  background: none;
  border: none;
  color: #555;
  font-size: 14px;
  cursor: pointer;
  align-self: flex-end;
`;

const LoginButton = styled.button`
  width: 353px;
  height: 46px;
  border-radius: 8px;
  border: none;
  background-color: #000;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
`;

const BottomText = styled.div`
  margin-top: 12px; /* 로그인 → 하단 문구 */
  font-size: 14px;
  color: ${colors.graycolor50};
`;

const SignUpButton = styled.a`
  background: none;
  border: none;
  color: ${colors.graycolor100}
  font-size: 14px;
  cursor: pointer;
  margin-left: 4px;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-decoration-color: ${colors.graycolor100};
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 4px;
`;
