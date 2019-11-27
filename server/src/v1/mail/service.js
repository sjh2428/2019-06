/* eslint-disable no-return-await */
/* eslint-disable import/prefer-default-export */
import nodemailer from 'nodemailer';
import DB from '../../database/index';
import U from '../../libraries/mail-util';
import getPaging from '../../libraries/paging';
import { makeMimeMessage } from '../../libraries/mimemessage';
import { saveSentMail } from '../../libraries/save-to-infra';

const SENT_MAILBOX_NAME = '보낸메일함';

const DEFAULT_MAIL_QUERY_OPTIONS = {
  category: 0,
  page: 1,
  perPageNum: 100,
  sort: 'datedesc',
};

const DATE_DESC = 'datedesc';
const DATE_ASC = 'dateasc';

const getQueryByOptions = ({ userNo, category, perPageNum, page, sort }) => {
  const query = {
    userNo,
    options: {
      raw: false,
    },
    paging: {
      limit: perPageNum,
      offset: (page - 1) * perPageNum,
    },
    mailFilter: {},
  };

  if (category > 0) {
    query.mailFilter.category_no = category;
  }

  if (sort === DATE_DESC) {
    query.order = [['no', 'DESC']];
  } else if (sort === DATE_ASC) {
    query.order = [['no', 'ASC']];
  }

  return query;
};

const getMailsByOptions = async (userNo, options = {}) => {
  const queryOptions = { ...DEFAULT_MAIL_QUERY_OPTIONS, ...options };
  const { sort } = queryOptions;
  let { category, page, perPageNum } = queryOptions;
  category = Number(category);
  page = Number(page);
  perPageNum = Number(perPageNum);

  const query = getQueryByOptions({ userNo, category, perPageNum, page, sort });
  const { count: totalCount, rows: mails } = await DB.Mail.findAndCountAllFilteredMail(query);

  const pagingOptions = {
    page,
    perPageNum,
  };
  const pagingResult = getPaging(totalCount, pagingOptions);

  return {
    paging: pagingResult,
    mails,
  };
};

const saveAttachments = async (attachments, mailTemplateNo, transaction) => {
  if (attachments.length === 0) {
    return;
  }

  const processedAttachments = attachments.map(attachment => {
    const { contentType, filename, content } = attachment;
    return { type: contentType, name: filename, content, mail_template_id: mailTemplateNo };
  });

  await DB.Attachment.bulkCreate(processedAttachments, { transaction });
};

const saveMail = async (mailContents, transaction, userNo, reservationTime = null) => {
  const mailTemplateResult = await DB.MailTemplate.create(
    { ...mailContents, to: mailContents.to.join(',') },
    { transaction },
  );
  const mailTemplate = mailTemplateResult.get({ plain: true });
  await saveAttachments(mailContents.attachments, mailTemplate.no, transaction);
  const userCategory = await DB.Category.findOneByUserNoAndName(userNo, SENT_MAILBOX_NAME);
  await DB.Mail.create(
    {
      owner: userNo,
      mail_template_id: mailTemplate.no,
      category_no: userCategory.no,
      reservation_time: reservationTime,
    },
    { transaction },
  );
};

const sendMail = async (mailContents, user) => {
  const transporter = nodemailer.createTransport(U.getTransport(user));
  await DB.sequelize.transaction(
    async transaction => await saveMail(mailContents, transaction, user.no),
  );
  const { messageId } = await transporter.sendMail(mailContents);
  const msg = makeMimeMessage({ messageId, mailContents });
  saveSentMail({ user, msg });
  return mailContents;
};

const saveReservationMail = async (mailContents, user, reservationTime) => {
  await DB.sequelize.transaction(
    async transaction => await saveMail(mailContents, transaction, user.no, reservationTime),
  );

  return mailContents;
};

export default { getMailsByOptions, sendMail, getQueryByOptions, saveReservationMail };
