import db from '.';

const createDomainDummyData = async () => {
  const results = await db.Domain.bulkCreate([
    {
      name: 'daitnu.com',
    },
  ]);

  return results;
};

const createMailTemplateDummyData = async () => {
  const mailTemplate = [
    {
      from: 'root@daitnu.com',
      to: 'daitnu@daitnu.com,daitne@daitnu.com',
      subject: '제목입니다.ㅎㅎ',
      body: '바디입니다.ㅎㅎㅎ',
    },
  ];

  await db.MailTemplate.bulkCreate(mailTemplate);
};

const createUserDummyData = async () => {
  const users = [
    {
      domain_no: 1,
      name: '다잇누',
      password: 'dqwdq',
      user_id: 'root',
      sub_email: 'root@asd.bcd',
    },
    {
      domain_no: 1,
      name: '다없누',
      password: 'dqwdq',
      user_id: 'root2',
      sub_email: 'root2@asd.bcd',
    },
    {
      domain_no: 1,
      name: '다했누',
      password: 'dqwdq',
      user_id: 'root3',
      sub_email: 'root3@asd.bcd',
    },
  ];

  await db.User.bulkCreate(users);
};

const createMailDummyData = async () => {
  const mails = [
    { owner: 1, mail_template_id: 1 },
    { owner: 2, mail_template_id: 1 },
    { owner: 3, mail_template_id: 1 },
  ];

  await db.Mail.bulkCreate(mails);
};

const createDummyData = async () => {
  await createDomainDummyData();
  await createUserDummyData();
  await createMailTemplateDummyData();
  await createMailDummyData();
};

export default createDummyData;