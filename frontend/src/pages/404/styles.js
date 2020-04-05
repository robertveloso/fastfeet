import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 200px;
    margin-bottom: 15px;
  }

  h1 {
    color: #111111;
  }

  h2 {
    font-weight: 300;
    font-family: cursive;
    color: #373737;

    a {
      cursor: pointer;
      color: inherit;
      text-decoration: underline;
      text-decoration-color: #b894ff;
      font-weight: bolder;
    }
  }
`;
