import { Router } from 'express';
import { loginValidator, signupvalidator } from '../middlewares/validator';
import { localLogin } from '../middlewares/handler';
import { jwtGuard } from '../middlewares/guard';
import { userService } from '../services';

const userController = Router();

// 현재 로그인 되어있는 유저 조회
userController.get('/', jwtGuard, async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const users = await userService.findOneById(userId);
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
});

// 회원가입
userController.post('/signup', signupvalidator, async (req, res, next) => {
  try {
    // 회원가입 성공한 유저 정보
    const createdUser = await userService.create(req.body);
    res.status(200).json({ data: createdUser });
  } catch (error) {
    next(error);
  }
});

userController.post('/login', loginValidator, localLogin);

//문화 시설 등록
userController.post(
  '/facility/:facilityid',
  jwtGuard,
  async (req, res, next) => {
    try {
      const { facilityid } = req.params;
      const userId = req.currentUserId;
      await userService.facilitySignup(userId, facilityid);
      res.sendStatus(201);
    } catch (error) {
      next(error);
    }
  },
);

userController.get('/facility', jwtGuard, async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    console.log(userId);
    const facilities = await userService.findFacility(userId);
    res.status(200).json({ data: facilities });
  } catch (error) {
    next(error);
  }
});

userController.delete(
  '/facility/:facilityid',
  jwtGuard,
  async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const { facilityid } = req.params;
      await userService.deleteFacility(userId, facilityid);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
);

export { userController };
