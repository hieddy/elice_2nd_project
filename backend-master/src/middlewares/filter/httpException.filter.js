// 에러 미들웨어
import { logger } from '../logger/config/logger';

const httpExceptionFilter = (error, req, res, next) => {
  if (!error.status) {
    res.status(500).json({
      message: error.message,
    });
    return;
  }
  res.status(error.status).json({
    message: error.message,
  });
  logger.error(`${error.status} ${error.message}`);
};

export { httpExceptionFilter };
