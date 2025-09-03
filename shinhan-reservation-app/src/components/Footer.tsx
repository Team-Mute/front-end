import styled from "@emotion/styled";
import Logo from "@/styles/icons/shinhanLogo.svg";
import colors from "@/styles/theme";

const Footer = () => {
  return (
    <div>
      <ContentsWrapper>
        <StyledLogo />
        <InfoWrapper>
          <AddressWrapper>
            <span>서울특별시 중구 명동10길 52 신한익스페이스</span>
            <span>서울특별시 중구 세종대로 9길 20(태평로 2가)</span>
          </AddressWrapper>

          <ContactWrapper>
            <span>E-mail: shdf@shinhan.com</span>
            <span>사업자등록번호:202-82-05586</span>
          </ContactWrapper>
        </InfoWrapper>
      </ContentsWrapper>
      <Copyright>
        <span>© 2020 Shinhan Financial Group Hope Foundation.</span>
      </Copyright>
    </div>
  );
};

export default Footer;

const ContentsWrapper = styled.div`
  display: flex;

  gap: 0.6rem;

  padding: 1.5rem 10rem;
  //   padding-left: 10rem;
  //   padding-top: 1.5rem;

  //   height: 9.93rem;
  width: 100%;

  @media (max-width: 873px) {
    padding: 1.5rem 5%;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }

  margin-top: 3rem;
`;

const StyledLogo = styled(Logo)`
  color: black;
  width: 11rem;
  height: 1.5rem;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddressWrapper = styled.div`
  display: flex;
  flex-direction: column;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  line-height: 145%; /* 1.26875rem */
  letter-spacing: -0.00438rem;
`;

const ContactWrapper = styled.div`
  margin-top: 1.5rem;

  display: flex;
  gap: 0.75rem;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 145%; /* 1.26875rem */
  letter-spacing: -0.00438rem;

  color: ${colors.graycolor50};

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Copyright = styled.div`
  display: flex;
  justify-content: center;
  height: 3.75rem;
  padding: 1.38rem 3.75rem;

  font-size: 0.6875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 145%; /* 0.99688rem */
  letter-spacing: -0.00344rem;

  color: ${colors.graycolor50};
`;
