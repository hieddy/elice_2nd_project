import { Router } from 'express';
import { challengeService } from '../services';
import { upload } from '../middlewares/handler';
import { bucket, region } from '../config/aws.config';
import { jwtGuard } from '../middlewares/guard/jwt.guard';

const challengeController = Router();

const aws_url = `https://${bucket}.s3.${region}.amazonaws.com/`;
const today = new Date();
const year = today.getFullYear();
const month = ('0' + (today.getMonth() + 1)).slice(-2);
const day = ('0' + today.getDate()).slice(-2);
const dateString = year + '-' + month + '-' + day;

// 챌린지 참여하기 v
challengeController.post('/participation', jwtGuard, async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const { challenge_id } = req.body;
    await challengeService.join(challenge_id, userId);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

//챌린지 참여 취소하기 v
challengeController.delete(
  '/participation',
  jwtGuard,
  async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const { challenge_id } = req.body;
      await challengeService.withdraw(challenge_id, userId);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
);

//나의 챌린지 조회하기 v
challengeController.get('/participation', jwtGuard, async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const myChallenge = await challengeService.findMyChallenge(userId);
    res.status(200).json({ data: myChallenge });
  } catch (error) {
    next(error);
  }
});

// 상태에 따른 챌린지 조회하기 v
challengeController.get('/status', async (req, res, next) => {
  try {
    const { status } = req.query;

    const progressingChallenge = await challengeService.findByChallengeStatus({
      status,
      dateString,
    });
    res.status(200).json({ data: progressingChallenge });
  } catch (error) {
    next(error);
  }
});

//챌린지 생성하기 v
challengeController.post(
  '/',
  jwtGuard,
  upload.single('image'),
  async (req, res, next) => {
    try {
      const challengeDto = req.body;
      const imagePath = `${aws_url}${req.file.key}`;
      challengeDto['imagePath'] = imagePath;
      await challengeService.create(challengeDto);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

//전체 챌린지 조회하기(challenge_id) v
challengeController.get('/all', async (req, res, next) => {
  try {
    const challengeData = await challengeService.findAll();
    res.status(200).send({ data: challengeData });
  } catch (error) {
    next(error);
  }
});
//특정 챌린지 조회하기(challenge_id) v
challengeController.get('/:challenge_id', async (req, res, next) => {
  try {
    const { challenge_id } = req.params;
    const challengeData = await challengeService.findOneById(challenge_id);
    res.status(200).send({ data: challengeData });
  } catch (error) {
    next(error);
  }
});

//특정 챌린지 수정하기(challenge_id)
// 작성자가 수정할 수 있도록 기능 추가하기
challengeController.put(
  '/:challenge_id',
  jwtGuard,
  upload.single('image'),
  async (req, res, next) => {
    try {
      const { challenge_id } = req.params;
      const challengeDto = req.body;
      const imagePath = `${aws_url}${req.file.key}`;
      challengeDto['imagePath'] = imagePath;
      // challengeDto['challenge_id'] = challenge_id;

      await challengeService.updateOneById({ challenge_id, challengeDto });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

//특정 챌린지 삭제하기(challenge_id)
// 작성자가 수정할 수 있도록 기능 추가하기

challengeController.delete(
  '/:challenge_id',
  jwtGuard,
  async (req, res, next) => {
    try {
      const { challenge_id } = req.params;
      await challengeService.deleteOneById(challenge_id);
      res.status(200).send('deleted ');
    } catch (error) {
      next(error);
    }
  },
);

export { challengeController };
