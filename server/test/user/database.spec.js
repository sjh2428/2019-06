/* eslint-disable no-undef */
import should from 'should';
import DB from '../../src/database';

const userEmail = 'rooot@daitnu.com';

describe('유저의 email을 통해 정보를 얻는다', () => {
  before(async () => {
    DB.sequelize.sync({ force: true });
  });

  it('이메일을 @를 기준으로 앞의 string이 해당 이메일의 id가 된다', async () => {
    const result = await DB.User.findOneById(userEmail.split('@')[0]);
    result.user_id.should.be.equal(userEmail.split('@')[0]);
    result.email.should.be.equal(userEmail);
    const user = {
      user_id: 'userid',
      name: '이름이뭐니',
      password: 'pasword12',
      sub_email: 'daitnu@daitnu.com',
    };

    describe('User DB Test..', () => {
      before(async () => {
        await DB.sequelize.sync({ force: true });
      });
      describe('Validate Test...', () => {
        describe('userid validate는..', () => {
          it('# userid에 특수문자가 들어가면 아이디의 형식이 올바르지 않습니다.를 반환한다', async () => {
            const userId = 'user@id';
            const data = await DB.User.build({
              ...user,
              user_id: userId,
            })
              .validate()
              .should.be.rejected();
            const error = data.errors[0];
            error.message.should.be.equals('아이디의 형식이 올바르지 않습니다.');
            error.path.should.be.equals('user_id');
            error.value.should.be.equals(userId);
          });

          it('# userid의 길이가 5이하면 아이디의 길이는 5이상 20이하 이어야 합니다.를 반환한다.', async () => {
            const userId = 'user';
            const data = await DB.User.build({
              ...user,
              user_id: userId,
            })
              .validate()
              .should.be.rejected();
            const error = data.errors[0];
            error.message.should.be.equals('아이디의 길이는 5이상 20이하 이어야 합니다.');
            error.path.should.be.equals('user_id');
            error.value.should.be.equals(userId);
          });

          it('# userid의 길이가 20 초과면 아이디의 길이는 5이상 20이하 이어야 합니다.를 반환한다.', async () => {
            const userId = 'a'.repeat(21);
            const data = await DB.User.build({
              ...user,
              user_id: userId,
            })
              .validate()
              .should.be.rejected();
            const error = data.errors[0];
            error.message.should.be.equals('아이디의 길이는 5이상 20이하 이어야 합니다.');
            error.path.should.be.equals('user_id');
            error.value.should.be.equals(userId);
          });

          it('# 아이디의 형식이 /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*$/을 만족하며 길이가 [5,20]이면 성공한다.', async () => {
            const userId = 'a'.repeat(5);
            const result = await DB.User.build({
              ...user,
              user_id: userId,
            })
              .validate()
              .should.be.resolved();
            const data = result.get({ plain: true });
            data.user_id.should.be.equals(userId);
            data.password.should.be.equals(user.password);
            data.name.should.be.equals(user.name);
            data.sub_email.should.be.equals(user.sub_email);

            await DB.User.build({
              ...user,
              user_id: 'a'.repeat(20),
            })
              .validate()
              .should.be.resolved();
          });
        });

        describe('name validate는...', () => {
          it('# name의 길이가 10초과면 이름의 길이는 1이상 10이하 이어야 합니다.를 반환한다.', async () => {
            const name = '가'.repeat(11);
            const data = await DB.User.build({
              ...user,
              name,
            })
              .validate()
              .should.be.rejected();
            const error = data.errors[0];
            error.message.should.be.equals('이름의 길이는 1이상 10이하 이어야 합니다.');
            error.path.should.be.equals('name');
            error.value.should.be.equals(name);
          });
        });

        describe('password validate는...', () => {
          it('# password의 길이가 8미만이면 password의 길이는 8이상 20이하 이어야 합니다.를 반환한다.', async () => {
            const password = 'a'.repeat(7);
            const data = await DB.User.build({
              ...user,
              password,
            })
              .validate()
              .should.be.rejected();
            const error = data.errors[0];
            error.message.should.be.equals('password의 길이는 8이상 20이하 이어야 합니다.');
            error.path.should.be.equals('password');
            error.value.should.be.equals(password);
          });

          it('# password의 길이가 20초과이면 password의 길이는 8이상 20이하 이어야 합니다.를 반환한다.', async () => {
            const password = 'a'.repeat(21);
            const data = await DB.User.build({
              ...user,
              password,
            })
              .validate()
              .should.be.rejected();
            const error = data.errors[0];
            error.message.should.be.equals('password의 길이는 8이상 20이하 이어야 합니다.');
            error.path.should.be.equals('password');
            error.value.should.be.equals(password);
          });

          it('# password의 길이가 [8,20]이면 성공한다.', async () => {
            let password = 'a'.repeat(8);
            const result = await DB.User.build({
              ...user,
              password,
            })
              .validate()
              .should.be.resolved();
            const data = result.get({ plain: true });
            data.user_id.should.be.equals(user.user_id);
            data.password.should.be.equals(password);
            data.name.should.be.equals(user.name);
            data.sub_email.should.be.equals(user.sub_email);

            password = 'a'.repeat(20);
            await DB.User.build({
              ...user,
              password,
            })
              .validate()
              .should.be.resolved();
          });
        });

        describe('sub_email validate는....', () => {
          it('# 이메일 형식이 /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}$/ 아니면 실패한다. ', async () => {
            const subEmail = 'asdsad';
            const data = await DB.User.build({
              ...user,
              sub_email: subEmail,
            })
              .validate()
              .should.be.rejected();

            const error = data.errors[0];
            error.message.should.be.equals('sub email의 형식이 올바르지 않습니다.');
            error.path.should.be.equals('sub_email');
            error.value.should.be.equals(subEmail);

            await DB.User.build({
              ...user,
              sub_email: 'dqwdqw@kac',
            })
              .validate()
              .should.be.rejected();

            await DB.User.build({
              ...user,
              sub_email: '@daitnu.com',
            })
              .validate()
              .should.be.rejected();

            await DB.User.build({
              ...user,
              sub_email: 'a@.com',
            })
              .validate()
              .should.be.rejected();

            await DB.User.build({
              ...user,
              sub_email: 'a@daitnu.',
            })
              .validate()
              .should.be.rejected();

            await DB.User.build({
              ...user,
              sub_email: 'a@daitnu.a',
            })
              .validate()
              .should.be.rejected();
          });
        });
      });
    });
  });
});
