import styled from 'styled-components';
import { Form } from '@unform/web';
import { shade } from 'polished';
import { colors } from '~/styles/colors';

export const ModalButton = styled.div`
  cursor: pointer;

  margin-left: -1px;
  border: #ccc 1px solid;

  padding: 0 6px;
  height: 45px;
  font-size: 14px;
  color: #ffffff;
  border: 0;
  border-radius: 0 4px 4px 0;
  background: ${colors.primary};
  display: flex;
  text-align: center;
  align-items: center;

  :hover {
    background: ${shade(0.1, colors.primary)} !important;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 900px;
`;

export const UnForm = styled(Form)`
  display: flex;
  flex-direction: column;
  padding: 25px 30px;
  background: #fff;

  width: 100%;
  border-radius: 4px;

  > section {
    display: flex;
    justify-content: space-evenly;
    align-items: flex-end;

    margin-bottom: 16px;

    > div:nth-child(2) {
      margin-right: 20px;
    }

    :nth-child(2) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-column-gap: 20px;
    }

    :nth-child(3) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-column-gap: 20px;
    }

    :nth-child(4) {
      place-content: flex-end;
    }
  }
`;
