import styled from 'styled-components';

import { colors } from '~/styles/colors';

export const Next = styled.button`
  padding: 0 16px;
  height: 36px;

  font-size: 14px;
  font-weight: bold;

  color: #fff;
  border: 0;
  border-radius: 4px;

  background: ${props => props.background || colors.primary};

  display: flex;
  text-align: center;
  align-items: center;

  svg {
    margin-left: 7px;
  }

  &:disabled {
    cursor: not-allowed;
    background: #666;
  }
`;

export const Previous = styled.button`
  padding: 0 16px;
  height: 36px;

  font-size: 14px;
  font-weight: bold;

  color: #fff;
  border: 0;
  border-radius: 4px;

  background: ${props => props.background || colors.primary};

  display: flex;
  text-align: center;
  align-items: center;

  svg {
    margin-right: 7px;
  }

  &:disabled {
    cursor: not-allowed;
    background: #666;
  }
`;
