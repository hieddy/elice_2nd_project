// noinspection JSUnresolvedVariable

import { execute } from '../../config/db.config';

export class UserRepository {
  responseUser = `user_id, name, email, phone`;
  createUser = `user_id, name, email, password, phone`;
  loginCheckUser = `user_id, email, password`;

  async findById(userId) {
    const sql = `SELECT ${this.responseUser} FROM User WHERE user_id = ?`;
    return execute(sql, [userId]);
  }

  async create(userDto) {
    const sql = `INSERT INTO User (${this.createUser}) VALUES (?, ?, ?, ?, ?)`;
    await execute(sql, [
      userDto.id,
      userDto.name,
      userDto.email,
      userDto.password,
      userDto.phone,
    ]);
  }

  async findByEmail(email) {
    const sql = `SELECT ${this.responseUser} FROM User WHERE email = ?`;
    return execute(sql, [email]);
  }

  async loginByEmail(email) {
    const sql = `SELECT ${this.loginCheckUser} FROM User WHERE email =?`;
    return execute(sql, [email]);
  }

  async createFacility(userid, facilityid) {
    const sql = `INSERT INTO User_Facility(user_id, facility_id) VALUES (?, ?)`;
    await execute(sql, [userid, facilityid]);
  }

  async findFacility(userid) {
    const sql = `select F.facility_id, F.fac_name, F.district, F.main_img
    from User_Facility uf
    left outer join Facility F on uf.facility_id = F.facility_id
    WHERE uf.user_id = "${userid}"`;
    return execute(sql);
  }

  async deleteFacility(userid, facilityid) {
    const sql = `DELETE FROM User_Facility WHERE user_id = ? AND facility_id = ?`;
    await execute(sql, [userid, facilityid]);
  }
}

const userRepository = new UserRepository();

export { userRepository };
