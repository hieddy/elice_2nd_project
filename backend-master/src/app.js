import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import commonErrors from './middlewares/filter/error/commonError';
import { CustomError, httpExceptionFilter } from './middlewares/filter';
import morganMiddleware from './middlewares/logger/morganMiddleware';
import { logger } from './middlewares/logger/config/logger';
import {
  challengeController,
  facilityController,
  imageController,
  userController,
} from './controllers';
import 'dotenv/config';

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // 허락하고자 하는 요청 주소
};

const morganOption = ':method :status :url :response-time ms ip: :remote-addr';

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(
    morgan(morganOption, {
      stream: logger.stream,
    }),
  );
  logger.debug('개발 환경에서 서버를 시작합니다.');
} else if (process.env.NODE_ENV === 'production') {
  app.use(morganMiddleware);
  logger.info('배포 환경에서 서버를 시작합니다.');
} else {
  logger.error('NODE_ENV가 존재하지 않습니다.');
}

require('./passport')();
app.use(passport.initialize());

app.use('/api/user', userController);
app.use('/api/facility', facilityController);
app.use('/api/image', imageController);
app.use('/api/challenge', challengeController);

// 404 에러 핸들러
app.use((req, res, next) => {
  throw new CustomError(404, commonErrors.resourceNotFoundError);
});

app.use(httpExceptionFilter);

const { PORT, JWTSECRET } = process.env;

if (!PORT || !JWTSECRET) {
  logger.error('설정되지 않은 환경변수가 있습니다. env 파일을 확인해주세요.');
} else {
  app.listen(PORT, () => {
    logger.info(`${PORT}번 포트로 정상적으로 서버를 시작하였습니다. `);
  });
}
