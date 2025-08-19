import styled from "@emotion/styled";
import colors from "@/styles/theme";
import ScrollContainer from "react-indiana-drag-scroll";

export const paddingRightRem = 3.75;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.div`
  width: 29.375rem;
  max-width: 700px;
  height: 34.9rem;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 1.5rem 3.66rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

export const Content = styled.div`
  flex: 1;
  height: 34.9rem;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding-left: 3.56rem;
`;

export const Footer = styled.div`
  height: 5.875rem;
  padding: 1rem;
  border-top: 1px solid ${colors.graycolor20};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.00963rem;
  margin-bottom: 0.84rem;
  margin-right: ${paddingRightRem}rem;
`;

export const DeleteAllImg = styled.button`
  border-radius: 0.25rem;
  border: 1px solid ${colors.graycolor10};
  padding: 0.38rem 0.5rem;
  color: ${colors.graycolor30};
  font-size: 0.625rem;
  font-weight: 600;
  cursor: pointer;
`;

export const AutomaticHoliday = styled.button`
  border-radius: 0.25rem;
  border: 1px solid ${colors.graycolor10};
  padding: 0.38rem 0.5rem;
  color: ${colors.graycolor100};
  font-size: 0.625rem;
  font-weight: 600;
  cursor: pointer;
`;

export const AddHolidayBtn = styled.button`
  color: ${colors.maincolor};
  gap: 0.5rem;
  cursor: pointer;
  display: flex;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 171.429% */
  letter-spacing: -0.00963rem;
`;

export const StyledScrollContainer = styled(ScrollContainer)`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

export const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

export const ImageUpload = styled.div`
  position: relative;
  min-width: 7.9375rem;
  height: 7.3125rem;
  padding: 1.875rem;
  border-radius: 0.625rem;
  background-color: ${colors.graycolor5};
  color: ${colors.graycolor50};
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MainBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: ${colors.sementicFillStrong}66;
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.625rem;
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: -0.00688rem;
`;

export const ImageDropZone = styled.div<{ isDragging: boolean }>`
  border: 1px dashed ${colors.graycolor10};
  border-radius: 0.63rem;
  text-align: center;
  padding: 0.75rem 5.6875rem;
  margin-bottom: 1rem;
  margin-right: ${paddingRightRem}rem;
  color: ${colors.graycolor50};
  background-color: ${(p) => (p.isDragging ? colors.graycolor10 : "#fff")};

  p {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: -0.00825rem;
  }
  small {
    font-size: 0.625rem;
    font-weight: 500;
    letter-spacing: -0.00688rem;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  margin-right: ${paddingRightRem}rem;
`;

export const Label = styled.label`
  color: ${colors.graycolor100};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5rem;
  letter-spacing: -0.00963rem;

  span {
    color: ${colors.graycolor50};
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 2.8rem;
`;

export const GapBox = styled.div<{ h: string }>`
  height: ${(p) => p.h};
`;

export const Operation = styled.div`
  display: flex;
  align-items: center;
  height: 2.875rem;
  width: 100%;
  margin-bottom: 0.5rem;

  h4 {
    padding: 0 0.59rem;
  }
  h5 {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 2.875rem;
    letter-spacing: -0.00963rem;
    margin-right: 1rem;
  }
  span {
    padding: 0 0.59rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 2.875rem;
    letter-spacing: -0.00825rem;
  }
`;

export const TimeBox = styled.div`
  width: 15.5rem; // SelectBox2와 동일한 너비
  display: flex;
  align-items: center;
  // justify-content: center;
`;

export const SwitchWrapper = styled.div`
  margin-left: 0.5rem;
`;
