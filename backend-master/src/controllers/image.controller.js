import { Router } from 'express';
import { upload } from '../middlewares/handler/';
import { bucket, region } from '../config/aws.config';

const imageController = Router();

const aws_url = `https://${bucket}.s3.${region}.amazonaws.com/`;

imageController.post('/upload', upload.single('image'), (req, res, next) => {
  try {
    const imagePath = `${aws_url}${req.file.key}`;
    res.status(200).json(imagePath);
  } catch (error) {
    next(error);
  }
});

export { imageController };
