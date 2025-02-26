import should from 'should';
import validator from '../src/utils/validator';

describe('validator 모듈의', () => {
  describe('validate(id) 호출시', () => {
    it('아이디는 5~20자의 영문 소문자,숫자, 특수문자 (-) 및 (_) 만 있는 문자를 넘겨줄시 true를 반환한다.', () => {
      validator.validate('id', 'abcde').should.be.equal(true);
      validator.validate('id', '123_-').should.be.equal(true);
      validator.validate('id', 'abcdef').should.be.equal(true);
      validator.validate('id', '_____').should.be.equal(true);
      validator.validate('id', 'aaaa11').should.be.equal(true);
    });

    it('특수문자 (-) 및 (_)외의 특수문자를 넘겨줄 경우 false를 반환한다.', () => {
      validator.validate('id', 'abcde!@#').should.be.equal(false);
    });

    // 길이 20초과
    it('길이가 21이상인 문자열을 넘겨줄 경우 false를 반환한다.', () => {
      validator.validate('id', 'abcdeabcdeabcdeabcde1').should.be.equal(false);
    });

    // 길이 5미만
    it('길이가 5미만인 문자열을 넘겨줄 경우 false를 반환한다.', () => {
      validator.validate('id', 'aaaa').should.be.equal(false);
    });
  });

  describe('validate(email) 호출시', () => {
    it('도메인 명이 없는 이메일을 넘겨줄 경우 false를 반환한다.', () => {
      validator.validate('email', 'abcde').should.be.equal(false);
    });

    it('올바른 이메일 형식을 넘겨줄 경우 true를 반환한다.', () => {
      validator.validate('email', 'abcde@daitne.com').should.be.equal(true);
      validator.validate('email', 'abcde@daitne.co.kr').should.be.equal(true);
      validator.validate('email', 'ab.cde@daitne.co.kr').should.be.equal(true);
    });

    it('도메인 형식이 잘못된 이메일을 넘겨줄 경우 false를 반환한다.', () => {
      validator.validate('email', 'abcde@@daitne.com').should.be.equal(false);
      validator.validate('email', 'abcde@daitne..com').should.be.equal(false);
      validator.validate('email', 'a@a.m').should.be.equal(false);
    });
  });

  describe('validate(name) 호출시', () => {
    it('한글이 아닌 이름을 넘겨줄 경우 false를 반환한다.', () => {
      validator.validate('name', 'abcde').should.be.equal(false);
    });
    it('1~10글자 사이의 한글을 넘겨줄 경우 true를 반환한다.', () => {
      validator.validate('name', '이정환').should.be.equal(true);
      validator.validate('name', '이정환환환').should.be.equal(true);
      validator.validate('name', '이').should.be.equal(true);
    });
    it('길이가 11이상인 문자열을 넘겨줄 경우 false를 반환한다.', () => {
      validator.validate('name', '김아무개아무개아무개아무개').should.be.equal(false);
    });
  });

  describe('validate(password) 호출시', () => {
    it('길이가 8미만 혹은 20초과한 문자열을 넘겨줄 경우 false를 반환한다.', () => {
      validator.validate('password', '1234').should.be.equal(false);
      validator.validate('password', '123!J').should.be.equal(false);
      validator.validate('password', '123!JjABC123abc!111!!!').should.be.equal(false);
      validator.validate('password', 'aaaaaaaaaaaaaaa111aaaa').should.be.equal(false);
    });
    it('길이가 8이상 20이하인 문자열을 넘겨줄 경우 true를 반환한다.', () => {
      validator.validate('password', 'jh123JHL1').should.be.equal(true);
      validator.validate('password', 'jh123!####!!').should.be.equal(true);
      validator.validate('password', '12323ab!c').should.be.equal(true);
      validator.validate('password', '12323ABC!@#@!!').should.be.equal(true);
    });
  });

  describe('checkUser 호출시', () => {
    it('형식에 맞지 않는 필드를 넘겨줄 경우 false를 반환한다.', () => {
      validator
        .checkUser({
          name: 'jhl',
          id: 'jhl1234',
          mail: 'abc@daitne.com',
          password: '1234',
        })
        .should.be.equal(false);

      validator
        .checkUser({
          name: '이정환',
          id: 'jhl@daitne.com',
          subEmail: 'abc@daitne.com',
          password: '1234',
        })
        .should.be.equal(false);

      validator
        .checkUser({
          name: '이정환',
          id: 'jhl123@abc',
          subEmail: 'abc@daitne.com',
          password: 'aaaA111!',
        })
        .should.be.equal(false);

      validator
        .checkUser({
          id: 'jhl123@abc',
          password: 'aaaA111!',
        })
        .should.be.equal(false);

      validator
        .checkUser({
          id: 'jhl123',
          password: 'aaaA111!',
        })
        .should.be.equal(false);
    });

    it('형식에 맞는 필드를 넘겨줄 경우 true를 반환한다.', () => {
      validator
        .checkUser({
          name: '이정환',
          id: 'jhl123',
          email: 'abc@daitne.com',
          password: 'aaaA111!',
        })
        .should.be.equal(true);

      validator
        .checkUser({
          name: '이정환',
          id: 'jhl123',
          email: 'abc@daitne.co.kr',
          password: 'bbbB111!',
        })
        .should.be.equal(true);
    });
  });
});
