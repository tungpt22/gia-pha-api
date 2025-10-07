import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const LIMIT_SIZE = 2 * 1024 * 1024; // 2MB

// Type declarations for the callback function
type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const editFileName = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: FileNameCallback,
): void => {
  // Generate a unique filename using uuid and keep the original extension
  const fileExtName = extname(file.originalname);
  const randomName = uuidv4();
  callback(null, `${randomName}${fileExtName}`);
};

export const imageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {
  // Allow only image files
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const candidateFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {
  // Allow common document and image files
  if (
    !file.originalname.match(
      /\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx)$/i,
    )
  ) {
    return callback(
      new BadRequestException(
        'Only images and document files (pdf, doc, xls, ppt) are allowed!',
      ),
      false,
    );
  }
  callback(null, true);
};
