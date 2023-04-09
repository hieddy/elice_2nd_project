import { CustomError } from '../filter';
import commonErrors from '../filter/error/commonError';

const regEmail =
  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i; // 이메일 형식 체크
const regPassword = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/; // 영문 숫자 포함 8 ~ 16자리
const regName = /^[가-힣a-zA-Z]{2,16}$/; // 영문, 한글만 2 ~ 16글자
const regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/; // 휴대폰 번호 형식 체크  ex)(010-0000-0000)

const signupvalidator = (req, res, next) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name || !phone) {
    throw new CustomError(400, commonErrors.inputError);
  }

  if (!regEmail.test(email)) {
    throw new CustomError(400, commonErrors.requestValidationError);
  }

  if (!regPassword.test(password)) {
    throw new CustomError(400, commonErrors.requestValidationError);
  }

  if (!regName.test(name)) {
    throw new CustomError(400, commonErrors.requestValidationError);
  }

  if (!regPhone.test(phone)) {
    throw new CustomError(400, commonErrors.requestValidationError);
  }
  next();
};

const loginValidator = (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomError(400, commonErrors.inputError);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export { loginValidator, signupvalidator };
