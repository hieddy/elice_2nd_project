import { facilityRepository } from '../db/repositories/Facility';
import { CustomError } from '../middlewares/filter';
import commonErrors from '../middlewares/filter/error/commonError';

class FacilityService {
  constructor(facilityRepository) {
    this.facility = facilityRepository;
  }

  // 문화시설 조회 (페이징)
  async findAll(pageSize, offset) {
    const facilities = await this.facility.getAll(pageSize, offset);

    return facilities;
  }

  // 문화시설 조회 (시설 이름 검색)
  async findBySearch(query) {
    const facilities = await this.facility.findBySearch(query);

    return facilities;
  }

  // 문화시설 조회 (시설 이름 검색 + 페이지네이션)
  async findBySearchPage(query, pageSize, offset) {
    const facilities = await this.facility.findBySearchPage(
      query,
      pageSize,
      offset,
    );

    return facilities;
  }

  // 문화시설 조회 (자치구,  주제분류 필터링)
  async findByFilter(district, subjcode) {
    const facilities = await this.facility.findByFilter(district, subjcode);
    return facilities;
  }

  // 특정 문화시설 조회
  async findOneById(facility_id) {
    const facility = await this.facility.findById(facility_id);

    if (!facility) {
      throw new CustomError(404, commonErrors.resourceNotFoundError);
    }
    return facility[0];
  }
}

const facilityService = new FacilityService(facilityRepository);

export { facilityService };
