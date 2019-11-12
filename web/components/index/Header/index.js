import React from 'react';
import * as S from './styled';

const Header = ({ brand }) => (
  <S.Header>
    <S.Brand>
      <a href="/">
        <img src="https://avatars2.githubusercontent.com/u/57168983?s=70&v=4" alt="logo" />
        {brand}
      </a>
    </S.Brand>
    <S.Search>
      <button>검색</button>
      <S.SearchInput placeholder="메일 검색" type="text" />
      <button>filter</button>
    </S.Search>
  </S.Header>
);

export default Header;
