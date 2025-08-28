import React from "react";
import styled from "@emotion/styled";
import CircleCheckbox from "../common/Checkbox";

interface FacilityTag {
  tagId: number;
  tagName: string;
}

const FacilitySelect: React.FC<{
  facilities: FacilityTag[]; // ✅ 상위에서 내려받음
  selectedFacilities: string[];
  setSelectedFacilities: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ facilities, selectedFacilities, setSelectedFacilities }) => {
  const toggleFacility = (tagName: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(tagName)
        ? prev.filter((f) => f !== tagName)
        : [...prev, tagName]
    );
  };

  return (
    <GridWrapper>
      {facilities.map((f) => (
        <CircleCheckbox
          key={f.tagId}
          label={f.tagName}
          checked={selectedFacilities.includes(f.tagName)}
          onChange={() => toggleFacility(f.tagName)}
        />
      ))}
    </GridWrapper>
  );
};

export default FacilitySelect;

// styled
const GridWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2열 */
  column-gap: 1.5rem; /* 가로 간격 */
  row-gap: 1rem; /* 세로 간격 */
`;
