/* eslint-disable camelcase */
/* eslint-disable no-undef */
import DB from '../../src/database';

describe('attachment DB test..', () => {
  let mail_template_id = 1;
  before(async () => {
    await DB.sequelize.sync({ force: true });
    const body = {
      from: 'daitnu@daitnu.com',
      to: 'daitne@daitnu.com',
      title: 'db test',
      subject: 'subject',
      tmp: '그냥 만들어봄 ㅎ.ㅎ',
      body: '바디입니다.',
    };
    const result = await DB.MailTemplate.create({ ...body });
    const data = result.get({ plain: true });
    mail_template_id = data.no;
  });

  it('bulk create test...', async () => {
    const dummy = [
      {
        mail_template_id,
        type: 'image',
        name: 'tile_name1',
        content: 'file content',
      },
      {
        mail_template_id,
        type: 'image',
        name: 'tile_name2',
        content: 'file content',
      },
      {
        mail_template_id,
        type: 'image',
        name: 'tile_name3',
        content: 'file content',
      },
      {
        mail_template_id,
        type: 'image',
        name: 'tile_name4',
        content: 'file content',
      },
    ];

    const attachments = await DB.Attachment.bulkCreate(dummy);
    for (const attachment of attachments) {
      console.log(attachment.get({ plain: true }));
    }
  });
});
