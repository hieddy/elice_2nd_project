import { Router } from 'express';
import { facilityService } from '../services/facility.service';

const facilityController = Router();

// 전체 문화시설 조회 (페이징)
facilityController.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page ?? '1');
    const pageSize = parseInt(req.query.pageSize ?? '10');
    const offset = (page - 1) * pageSize;

    const facilities = await facilityService.findAll(pageSize, offset);

    res.status(200).json({
      data: facilities.result,
      maxPage: facilities.maxPage,
      totalCount: facilities.totalCount,
    });
  } catch (error) {
    next(error);
  }
});

// 문화시설 조회 (시설 이름 검색)
facilityController.get('/search', async (req, res, next) => {
  try {
    const query = req.query.query;

    const facilities = await facilityService.findBySearch(query);
    res.status(200).json({ data: facilities });
  } catch (error) {
    next(error);
  }
});

// 문화시설 조회 (시설 이름 검색 + 페이지네이션)
facilityController.get('/list/search', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page ?? '1');
    const pageSize = parseInt(req.query.pageSize ?? '10');
    const offset = (page - 1) * pageSize;
    const query = req.query.query;

    const facilities = await facilityService.findBySearchPage(
      query,
      pageSize,
      offset,
    );

    res.status(200).json({
      data: facilities.result,
      maxPage: facilities.maxPage,
      totalCount: facilities.totalCount,
    });
  } catch (error) {
    next(error);
  }
});

// 문화시설 조회 (자치구,  주제분류 필터링)
facilityController.get('/filter', async (req, res, next) => {
  try {
    const district = req.query.district ?? '전체';
    const subjcode = req.query.subjcode ?? '전체';

    const facilities = await facilityService.findByFilter(district, subjcode);
    res.status(200).json({ data: facilities });
  } catch (error) {
    next(error);
  }
});

// 특정 문화시설 조회
facilityController.get('/:facility_id', async (req, res, next) => {
  try {
    const { facility_id } = req.params;
    const facility = await facilityService.findOneById(facility_id);
    res.status(200).json({ data: facility });
  } catch (error) {
    next(error);
  }
});

export { facilityController };
