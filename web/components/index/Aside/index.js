import React from 'react';
import * as S from './styled';
import CategoryCard from './CategoryCard';

const Aside = () => {
  const defaultCategory = ['받은편지함', '중요편지함', '보낸메일함', '내게쓴메일함', '휴지통'];
  const defaultCard = defaultCategory.map(category => (
    <CategoryCard key={category} category={category} />
  ));
  const userCategory = ['대햇', '흑우'];
  const userCategoryCard = userCategory.map(category => (
    <CategoryCard key={category} category={category} />
  ));

  return (
    <>
      <S.WriteArea>
        <S.WrtieButton onClick={e => console.log('히히')}>편지쓰기</S.WrtieButton>
        <S.WrtieButton>내게쓰기</S.WrtieButton>
      </S.WriteArea>
      <S.DefaultReadArea>{defaultCard}</S.DefaultReadArea>
      <S.OptionReadArea>{userCategoryCard}</S.OptionReadArea>
    </>
  );
};

export default Aside;
