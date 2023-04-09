import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import {
  accessKeyId,
  bucket,
  region,
  secretAccessKey,
} from '../../config/aws.config';

const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

const storage = multerS3({
  s3,
  bucket,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: 'public-read-write',
  key: function (req, file, cb) {
    let extension = path.extname(file.originalname);
    cb(null, Date.now().toString() + extension);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export { upload };
