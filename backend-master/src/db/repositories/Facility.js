import { execute } from '../../config/db.config';

export class FacilityRepository {
  responseData = `facility_id, subjcode, fac_name, district, addr, x_coord, y_coord, phne, homepage`;

  // 전체 문화시설 조회
  async getAll(pageSize, offset) {
    const sql = `SELECT ${this.responseData} FROM Facility LIMIT ${pageSize} OFFSET ${offset}`;
    const max = `SELECT COUNT(*) FROM Facility`;

    const [result, maxResult] = await Promise.all([execute(sql), execute(max)]);
    const totalCount = maxResult[0]['COUNT(*)'];
    const maxPage = Math.ceil(totalCount / pageSize);

    return { result, maxPage, totalCount };
  }

  // 문화시설 조회 (시설 이름 검색)
  async findBySearch(query) {
    const sql = `SELECT ${this.responseData} FROM Facility WHERE fac_name LIKE "%${query}%"`;

    return execute(sql);
  }

  // 문화시설 조회 (시설 이름 검색 + 페이지네이션)
  async findBySearchPage(query, pageSize, offset) {
    const sql = `SELECT ${this.responseData} FROM Facility WHERE fac_name LIKE "%${query}%" LIMIT ${pageSize} OFFSET ${offset}`;
    const max = `SELECT COUNT(*) FROM Facility WHERE fac_name LIKE "%${query}%"`;

    const [result, maxResult] = await Promise.all([execute(sql), execute(max)]);
    const totalCount = maxResult[0]['COUNT(*)'];
    const maxPage = Math.ceil(totalCount / pageSize);

    return { result, maxPage, totalCount };
  }

  // 문화시설 조회 (자치구,  주제분류 필터링)
  async findByFilter(district, subjcode) {
    let sql;

    if (district === '전체' && subjcode === '전체') {
      sql = `SELECT ${this.responseData} FROM Facility`;
    } else if (district === '전체' || district === '') {
      sql = `SELECT ${this.responseData} FROM Facility WHERE district="전체" OR subjcode="${subjcode}"`;
    } else if (subjcode === '전체' || subjcode === '') {
      sql = `SELECT ${this.responseData} FROM Facility WHERE district="${district}" OR subjcode="전체"`;
    } else {
      sql = `SELECT ${this.responseData} FROM Facility WHERE district="${district}" AND subjcode="${subjcode}"`;
    }

    return execute(sql);
  }

  // 특정 문화시설 조회
  async findById(facility_id) {
    const sql = `SELECT * FROM Facility WHERE facility_id = ? `;
    return execute(sql, [facility_id]);
  }
}

const facilityRepository = new FacilityRepository();

export { facilityRepository };
