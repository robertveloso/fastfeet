import styled from 'styled-components';

export const Container = styled.div`
  h1 {
    font-size: 24px;
    font-weight: bold;
    color: #444;

    margin-bottom: 35px;
  }
  div {
    > section {
      display: inline-flex;
      flex-wrap: wrap;
      gap: 12px;
    }
  }
`;

export const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 25px;
`;
