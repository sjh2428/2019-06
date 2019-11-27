import React, { useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import S from './styled';
import { AppDisapthContext, AppStateContext } from '../../../contexts';
import { handleSortSelect } from '../../../contexts/reducer';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 120,
    color: 'white',
  },
}));

const Tools = () => {
  const classes = useStyles();
  const { state } = useContext(AppStateContext);
  const { dispatch } = useContext(AppDisapthContext);

  const handleChange = ({ target: { value } }) => dispatch(handleSortSelect(value));

  return (
    <>
      <S.CheckBox>체크박스</S.CheckBox>
      <S.Etc>잡다한 여러게</S.Etc>
      <S.Filter>
        <FormControl className={classes.formControl}>
          <Select
            value={state.sort}
            onChange={handleChange}
            displayEmpty
            className={classes.selectEmpty}>
            <MenuItem value={'datedesc'}>시간 역순정렬</MenuItem>
            <MenuItem value={'dateasc'}>시간 순정렬</MenuItem>
          </Select>
        </FormControl>
      </S.Filter>
    </>
  );
};

export default Tools;
