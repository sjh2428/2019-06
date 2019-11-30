import ERROR_CODE from '../exception/error-code';
import ErrorResponse from '../exception/error-response';
import ErrorField from '../exception/error-field';

const BLANK = '';
const MAILBOX_NAME_LENGTH_LIMIT = 20;
const nameValidation = /^[0-9a-zA-Z가-힣 ]{1,20}$/;

const boxNameValidation = val => {
  return nameValidation.test(val);
};

const boxNameBlankValidation = val => {
  return val === BLANK || !val;
};

const boxNameLengthValidation = integer => {
  return integer > MAILBOX_NAME_LENGTH_LIMIT;
};

const boxNoValidation = val => {
  const toNumber = Number(val);
  return val === '' || Number.isNaN(toNumber) || toNumber < 1;
};

const makeMailBoxValidation = name => {
  if (boxNameBlankValidation(name)) {
    const errorField = new ErrorField('mailBoxName', name, '추가할 메일함 이름을 입력해주세요');
    throw new ErrorResponse(ERROR_CODE.INVALID_INPUT_VALUE, errorField);
  }

  if (boxNameLengthValidation(name.length)) {
    const errorField = new ErrorField(
      'mailBoxName',
      name,
      '메일함 이름은 최대 20글자로 작성해주세요',
    );
    throw new ErrorResponse(ERROR_CODE.MAILBOX_EXCEED_NAME, errorField);
  }

  if (!boxNameValidation(name)) {
    const errorField = new ErrorField(
      'mailBoxName',
      name,
      '메일함 이름은 완성된 한글, 영문, 숫자로만 이루어질 수 있습니다',
    );
    throw new ErrorResponse(ERROR_CODE.INVALID_INPUT_VALUE, errorField);
  }

  return true;
};

const updateMailBoxValidation = (newName, oldName, no) => {
  if (boxNameBlankValidation(newName)) {
    const errorField = new ErrorField(
      'newMailBoxName',
      newName,
      '새로운 메일함 이름을 입력해주세요',
    );
    throw new ErrorResponse(ERROR_CODE.INVALID_INPUT_VALUE, errorField);
  }

  if (boxNameBlankValidation(oldName)) {
    const errorField = new ErrorField('oldMailBoxName', oldName, '메일함이 선택되지 않았습니다');
    throw new ErrorResponse(ERROR_CODE.INVALID_INPUT_VALUE, errorField);
  }

  if (boxNoValidation(no)) {
    const errorField = new ErrorField('mailBoxNo', no, '메일함이 잘못 전달되었습니다');
    throw new ErrorResponse(ERROR_CODE.INVALID_INPUT_VALUE, errorField);
  }

  if (boxNameLengthValidation(newName.length)) {
    const errorField = new ErrorField(
      'mailBoxName',
      newName,
      '메일함은 최대 20글자로 작성해주세요',
    );
    throw new ErrorResponse(ERROR_CODE.MAILBOX_EXCEED_NAME, errorField);
  }

  if (!boxNameValidation(newName)) {
    const errorField = new ErrorField(
      'mailBoxName',
      newName,
      '메일함 이름은 완성된 한글, 영문, 숫자로만 이루어질 수 있습니다',
    );
    throw new ErrorResponse(ERROR_CODE.INVALID_INPUT_VALUE, errorField);
  }

  return true;
};

const deleteMailBoxValidation = (name, no) => {
  if (boxNameBlankValidation(name)) {
    const errorField = new ErrorField('mailBoxName', name, '메일함이 잘못 전달되었습니다');
    throw new ErrorResponse(ERROR_CODE.INVALID_INPUT_VALUE, errorField);
  }

  if (boxNoValidation(no)) {
    const errorField = new ErrorField('mailBoxNo', no, '메일함이 잘못 전달되었습니다');
    throw new ErrorResponse(ERROR_CODE.INVALID_INPUT_VALUE, errorField);
  }

  return true;
};

export default { makeMailBoxValidation, updateMailBoxValidation, deleteMailBoxValidation };
