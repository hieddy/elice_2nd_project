import { userRepository } from '../db/repositories/User';
import { CustomError } from '../middlewares/filter';
import commonErrors from '../middlewares/filter/error/commonError';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async findOneById(userId) {
    const users = await this.userRepository.findById(userId);
    const result = users[0];
    return result;
  }

  async create(userDto) {
    await this.emailCheck(userDto.email);

    userDto.id = randomUUID();
    userDto.password = await bcrypt.hash(userDto.password, 10);

    await this.userRepository.create(userDto);
    return await this.findOneByEmail(userDto.email);
  }

  async findOneByEmail(email) {
    const fondUser = await this.userRepository.findByEmail(email);

    const result = fondUser[0];

    if (!result) {
      throw new CustomError(404, commonErrors.resourceNotFoundError);
    }

    return result;
  }

  async emailCheck(email) {
    const fondUser = await this.userRepository.findByEmail(email);
    const result = fondUser[0];

    if (result) {
      throw new CustomError(404, commonErrors.resourceDuplicationError);
    }
  }

  async userLogin(email, password) {
    const user = await this.userRepository.loginByEmail(email);
    const result = user[0];
    if (!result) {
      throw new CustomError(404, commonErrors.resourceNotFoundError);
    }
    const correctPasswordHash = result.password;
    const isCorrectPassword = await bcrypt.compare(
      password,
      correctPasswordHash,
    );
    if (!isCorrectPassword) {
      throw new CustomError(400, commonErrors.inputError);
    }
    return result;
  }

  // 문화시설 즐겨찾기 등록
  async facilitySignup(userId, facilityId) {
    await this.userRepository.createFacility(userId, facilityId);
  }

  // 문화시설 찾기
  async findFacility(userId) {
    const facility = await this.userRepository.findFacility(userId);
    return facility;
  }

  async deleteFacility(userId, facilityId) {
    await this.userRepository.deleteFacility(userId, facilityId);
  }
}

const userService = new UserService(userRepository);

export { userService };
