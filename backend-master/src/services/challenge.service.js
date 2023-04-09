import { challengeRepository } from '../db/repositories/Challenge';
import { CustomError } from '../middlewares/filter/error/customError';
import commonErrors from '../middlewares/filter/error/commonError';
import { logger } from '../middlewares/logger/config/logger';
class ChallengeService {
  constructor(challengeRepository) {
    this.challengeRepository = challengeRepository;
  }

  async create(dto) {
    await this.challengeRepository.create(dto);
  }

  async findAll() {
    const allChallengeData = await challengeRepository.findAll();
    if (Object.keys(allChallengeData).length == 0) {
      throw new CustomError(404, commonErrors.resourceNotFoundError);
    }
    return allChallengeData;
  }
  async findOneById(dto) {
    const oneChallengeData = await challengeRepository.findOneById(dto);
    if (Object.keys(oneChallengeData).length == 0) {
      throw new CustomError(404, commonErrors.resourceNotFoundError);
    }
    return oneChallengeData;
  }

  async updateOneById({ challenge_id, challengeDto }) {
    await challengeRepository.updateOneById({ challenge_id, challengeDto });
  }

  async deleteOneById(challenge_id) {
    await challengeRepository.deleteOneById(challenge_id);
  }

  async findByChallengeStatus({ status, dateString }) {
    if (status === undefined) {
      throw new CustomError(404, commonErrors.requestValidationError);
    } else if (status === 'progressing') {
      const progressingChallenge = await challengeRepository.findProgressing(
        dateString,
      );
      return progressingChallenge;
    } else if (status === 'recruiting') {
      const recruitingChallenge = await challengeRepository.findRecruiting(
        dateString,
      );
      return recruitingChallenge;
    } else if (status === 'ended') {
      const endedChallenge = await challengeRepository.findEnded(dateString);
      return endedChallenge;
    }
  }

  async join(challenge_id, userId) {
    const alreadyJoined = await challengeRepository.findExistingParticipation(
      challenge_id,
      userId,
    );
    if (alreadyJoined[0]) {
      throw new CustomError(400, commonErrors.requestValidationError);
    } else {
      await challengeRepository.join(challenge_id, userId);
    }
  }
  async withdraw(challenge_id, userId) {
    const alreadyJoined = await challengeRepository.findExistingParticipation(
      challenge_id,
      userId,
    );
    if (!alreadyJoined[0]) {
      throw new CustomError(400, commonErrors.requestValidationError);
    } else {
      await challengeRepository.withdraw(challenge_id, userId);
    }
  }
  async findMyChallenge(userId) {
    const myChallenge = await challengeRepository.findMyChallenge(userId);
    return myChallenge;
  }
}

const challengeService = new ChallengeService(challengeRepository);

export { challengeService };
