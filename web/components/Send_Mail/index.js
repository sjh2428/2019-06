import React from 'react';
import S from './styled';
import InputReceiver from './Input_Receiver';
import InputSubject from './Input_Subject';
import InputBody from './Input_Body';

const SendMail = () => (
  <S.DivWrite>
    <InputReceiver />
    <InputSubject />
    <InputBody />
  </S.DivWrite>
);

export default SendMail;
