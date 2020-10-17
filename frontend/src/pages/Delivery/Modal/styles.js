import styled from 'styled-components';
import ReactToPrint from 'react-to-print';
import { shade } from 'polished';
import { colors } from '~/styles/colors';

export const Print = styled(ReactToPrint)``;

export const Button = styled.button`
  padding: 0 16px;
  height: 36px;
  font-weight: bold;
  color: #fff;
  border: 0;
  border-radius: 4px;
  background: ${colors.primary} !important;
  display: flex;
  text-align: center;
  align-items: center;
  margin: 10px auto;

  :hover {
    background: ${shade(0.2, colors.primary)} !important;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  p {
    display: none;
    flex-direction: column;
    align-items: center;
    align-self: center;
  }

  ul {
    margin: 2px 0 2px 15px;
  }

  small {
    font-size: 12px;
    color: #666;
    line-height: 20px;
  }

  > div {
    display: flex;
    flex-direction: column;

    :nth-child(1) {
      padding-bottom: 12px;
    }

    strong {
      color: #444;
      font-size: 14px;
      margin-bottom: 4px;
    }

    /* small {
      font-size: 16px;
      color: #666;
      line-height: 25px;
    } */

    > div {
      > span {
        font-size: 16px;
        font-weight: bold;
        color: #666;
      }

      :nth-last-child(1) {
        margin-bottom: 10px;
      }
    }
  }

  > div + div {
    padding-top: 9px;
    border-top: 1px solid #eee;
  }
`;
