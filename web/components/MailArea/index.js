/* eslint-disable camelcase */
import React, { useContext, useCallback } from 'react';
import MailTemplate from '../MailTemplate';
import S from './styled';
import Paging from './Paging';
import { AppDisapthContext, AppStateContext } from '../../contexts';
import Loading from '../Loading';
import { handleMailsChange } from '../../contexts/reducer';
import useFetch from '../../utils/use-fetch';
import getQueryByOptions from '../../utils/query';

const MailArea = () => {
  const { state } = useContext(AppStateContext);
  const { dispatch } = useContext(AppDisapthContext);
  const query = getQueryByOptions(state);
  const URL = `/mail?${query}`;

  const callback = useCallback(data => dispatch(handleMailsChange({ ...data })), [dispatch]);
  const isLoading = useFetch(callback, URL);

  if (isLoading) {
    return <Loading />;
  }

  const { mails, paging } = state;
  console.log(mails);
  const mailList =
    mails.length > 0
      ? mails.map(mail => <MailTemplate key={mail.no} mail={mail} />)
      : '메일이 없습니다.';

  return (
    <S.MailArea>
      <S.Tools>tools</S.Tools>
      <S.MailListArea>{mailList}</S.MailListArea>
      <S.MailPagingArea>
        <Paging paging={paging} />
      </S.MailPagingArea>
    </S.MailArea>
  );
};

export default MailArea;
