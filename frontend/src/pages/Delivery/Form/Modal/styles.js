import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  /*img {
    height: 325px;
    margin-top: 25px;
  }*/

  button {
    border: none;
    background-color: transparent;
    align-self: flex-start;
    font-size: larger;
  }

  > section {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #000;
    padding: 10px 0 10px 0;
    :last-of-type {
      border: none;
    }
    
    div {
      text-align-last: left;
      margin-left: 25px;
      input {
        width: 50px;
        margin-left: 10px;
        margin-right: 10px;
      }
    }

    strong {
      color: #444;
      font-size: 14px;
      margin-bottom: 4px;
    }

    small {
      font-size: 16px;
      color: #666;
      line-height: 25px;
    }

    :nth-last-child(1) {
      margin-bottom: 10px;
    }
  }

  > div {
    display: grid;
    grid-template-columns: 1fr 1fr;

    div {
      text-align-last: center;
      input {
        width: 50px;
        margin-left: 10px;
        margin-right: 10px;
      }
    }

    strong {
      color: #444;
      font-size: 14px;
      margin-bottom: 4px;
    }

    small {
      font-size: 16px;
      color: #666;
      line-height: 25px;
    }

    :nth-last-child(1) {
      margin-bottom: 10px;
    }
  }
`;
