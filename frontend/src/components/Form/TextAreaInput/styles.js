import styled from 'styled-components';

import { colors } from '~/styles/colors';

export const UnInput = styled.textarea`
  padding: 12px 15px;
  max-width: -webkit-fill-available;
  min-width: -webkit-fill-available;
  min-height: 120px;

  font-size: 16px;
  color: #444;
  border-radius: 4px;

  &::placeholder {
    color: #999;
  }

  height: 45px;
  border: 1px solid #ddd;
`;

export const Error = styled.span`
  color: ${colors.danger};
  margin-top: 8px;

  & + label {
    margin-top: 8px;
  }
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;

  strong {
    color: #444;
    font-weight: bold;

    text-align: left;
    margin-bottom: 9px;
  }

  & + label {
    margin-top: 18px;
  }
`;
