import { execute } from '../../config/db.config';
import { logger } from '../../middlewares/logger/config/logger';
class ChallengeRepository {
  async create(dto) {
    const sql = `INSERT INTO Challenge (
            title, 
            description, 
            content,
            image, 
            recruit_person, 
            recruit_start, 
            recruit_end, 
            progress_start, 
            progress_end
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await execute(sql, [
      dto.title,
      dto.description,
      dto.content,
      dto.imagePath,
      parseInt(dto.recruit_person),
      dto.recruit_start,
      dto.recruit_end,
      dto.progress_start,
      dto.progress_end,
    ]);
  }

  async findAll() {
    const sql = `SELECT * FROM Challenge`;
    const allChallengeData = await execute(sql);
    return allChallengeData;
  }
  async findOneById(dto) {
    const sql = `SELECT * FROM Challenge WHERE challenge_id = ?`;
    const oneChallengeData = await execute(sql, [dto]);
    return oneChallengeData;
  }

  async updateOneById({ challenge_id, challengeDto }) {
    const sql = `UPDATE Challenge 
    SET 
    title = ?, 
    description =?, 
    content = ?,
    image = ?, 
    recruit_person = ?, 
    recruit_start = ?, 
    recruit_end = ?, 
    progress_start = ?, 
    progress_end = ?
    WHERE challenge_id = ?`;
    await execute(sql, [
      challengeDto.title,
      challengeDto.description,
      challengeDto.content,
      challengeDto.imagePath,
      challengeDto.recruit_person,
      challengeDto.recruit_start,
      challengeDto.recruit_end,
      challengeDto.progress_start,
      challengeDto.progress_end,
      // parseInt(challenge_id),
      challenge_id,
    ]);
  }

  async deleteOneById(challenge_id) {
    const sql = `UPDATE Challenge 
    SET isDeleted = 1
    WHERE challenge_id = ?`;
    await execute(sql, [challenge_id]);
    // 이때 나의 챌린지도 같이 지워지게 sql 쿼리 날려야함
  }

  async findProgressing(dateString) {
    const sql = `SELECT * FROM Challenge
    WHERE progress_start <= ? 
    AND progress_end >= ?
    AND isDeleted = 0`;
    const progressingChallenge = await execute(sql, [dateString, dateString]);
    return progressingChallenge;
  }
  async findRecruiting(dateString) {
    const sql = `SELECT * FROM Challenge
    WHERE recruit_start <= ? 
    AND recruit_end >= ?
    AND isDeleted = 0`;
    const recruitingChallenge = await execute(sql, [dateString, dateString]);
    return recruitingChallenge;
  }
  async findEnded(dateString) {
    const sql = `SELECT * FROM Challenge
    WHERE progress_end < ? 
    AND isDeleted = 0`;
    const endedChallenge = await execute(sql, [dateString]);
    return endedChallenge;
  }
  async findExistingParticipation(challenge_id, userId) {
    const sql = `SELECT * FROM Challenge_user
    WHERE challenge_id = ?
    AND user_id = ?`;
    return execute(sql, [challenge_id, userId]);
  }
  async join(challenge_id, userId) {
    const sql = `INSERT INTO Challenge_user
    VALUES(?, ?)`;
    return execute(sql, [challenge_id, userId]);
  }
  async withdraw(challenge_id, userId) {
    const sql = `DELETE FROM Challenge_user
    WHERE challenge_id = ?
    AND user_id = ?`;
    return execute(sql, [challenge_id, userId]);
  }
  async findMyChallenge(userId) {
    const sql = `SELECT * FROM Challenge
    INNER JOIN Challenge_user
    ON Challenge.challenge_id = Challenge_user.challenge_id
    WHERE user_id =?`;
    return execute(sql, [userId]);
  }
}

const challengeRepository = new ChallengeRepository();

export { challengeRepository };
