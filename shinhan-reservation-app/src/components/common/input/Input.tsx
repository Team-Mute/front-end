import React, { InputHTMLAttributes } from "react";
import styled from "@emotion/styled";
import colors from "@/styles/theme";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

const Input = ({ errorMessage, ...props }: Props) => {
  return (
    <Wrapper>
      <StyledInput {...props} isError={!!errorMessage} />
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Wrapper>
  );
};

export default Input;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorText = styled.span`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
`;

const StyledInput = styled.input<{ isError: boolean }>`
  width: 353px;
  height: 46px;
  padding-left: 12px;
  background-color: #ffffff;
  border: 1px solid ${({ isError }) => (isError ? "#ff4d4f" : "#e8e9e9")};
  border-radius: 8px;
  font-size: 14px;
  color: ${colors.graycolor100}

  &::placeholder {
    color: #8c8f93;
  }

  &:focus {
    outline: none;
    border-color: #c1c1c1;
  }
`;
