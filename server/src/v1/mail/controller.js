import STATUS from 'http-status';
import service from './service';
import U from '../../libraries/mail-util';
import { validate } from '../../libraries/validator';
import ERROR_CODE from '../../libraries/error-code';
import ErrorResponse from '../../libraries/error-response';
import ErrorField from '../../libraries/error-field';

const list = async (req, res, next) => {
  const { no, email } = req.user;

  let mails;
  try {
    mails = await service.getRawMails(no, email);
  } catch (error) {
    return next(error);
  }

  return res.json({ mails });
};

const write = async (req, res, next) => {
  const attachments = req.files;
  const { to, subject, text } = req.body;
  const from = req.user.email;
  if (!to.every(val => validate('email', val))) {
    const errorField = new ErrorField('email', to, '이메일이 올바르지 않습니다');
    return next(new ErrorResponse(ERROR_CODE.INVALID_INPUT_VALUE, errorField));
  }
  const mailContents = U.getSingleMailData({ from, to, subject, text, attachments });

  let mail;
  try {
    mail = await service.sendMail(mailContents);
  } catch (error) {
    return next(error);
  }

  return res.status(STATUS.CREATED).json({ mail });
};

export default {
  list,
  write,
};