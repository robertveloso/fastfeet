import styled from 'styled-components';
import { shade } from 'polished';

import { colors } from '~/styles/colors';

export const Container = styled.div`
  cursor: pointer;
  padding: 0 16px;
  height: 36px;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  border: 0;
  background: ${colors.primary};
  display: flex;
  text-align: center;
  align-items: center;

  :hover {
    background: ${shade(0.1, colors.primary)} !important;
  }
  position: absolute;
  bottom: 0;
  width: 100%;
  place-content: center;
`;
