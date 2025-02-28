import React from 'react';
import styled from 'styled-components';

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 2px;
  
  /* Create a larger touch target */
  &::after,
  &::before {
    content: '';
    position: absolute;
    background-color: currentColor;
    border-radius: 1px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Horizontal line */
  &::before {
    width: 16px;
    height: 2px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  /* Vertical line */
  &::after {
    width: 2px;
    height: 16px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) ${props => props.isExpanded ? 'scaleY(0)' : 'scaleY(1)'};
  }
`;

const PlusMinusIcon = ({ isExpanded }) => {
  return <IconWrapper isExpanded={isExpanded} />;
};

export default PlusMinusIcon; 