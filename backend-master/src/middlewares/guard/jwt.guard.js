import jwt from 'jsonwebtoken';
import commonErrors from '../filter/error/commonError';
import { logger } from '../logger/config/logger';

const jwtGuard = async (req, res, next) => {
  try {
    const userToken = req.headers.authorization.split(' ')[1];

    if (!userToken || userToken === 'null' || userToken === 'undefined') {
      throw new Error("Can't find token");
    }

    const jwtsecret = process.env.JWTSECRET;
    const jwtDecoded = await jwt.verify(userToken, jwtsecret);
    req.currentUserId = jwtDecoded.userId;

    next();
  } catch (error) {
    logger.error(`jwtGuard Error: ${error}`);
    res.status(401).json({ message: commonErrors.authenticationError });
  }
};

export { jwtGuard };
