/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BadRequestException, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  imageFileFilter,
  candidateFileFilter,
  LIMIT_SIZE,
} from '../utils/file-upload.utils';
import { UploadService } from './upload.service';

interface UploadResponse {
  originalname: string | null;
  filename: string | null;
}

@ApiTags('Upload')
@Controller({ path: 'upload', version: '1' })
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) {}

  // noinspection TypeScriptValidateTypes
  @Post('')
  @ApiOperation({ summary: 'Upload file' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: candidateFileFilter,
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponse> {
    if (!file) throw new BadRequestException('File missed');
    if (file.size > LIMIT_SIZE) {
      throw new BadRequestException(
        'Sorry, this file size exceeds, maximum file size is 2 MB',
      );
    }

    // Explicitly cast to ensure type safety
    await this.logger.log(`File uploaded: ${file.originalname}`);

    const response: UploadResponse = {
      originalname: file?.originalname || null,
      filename: file?.filename ? `uploads/${file.filename}` : null,
    };
    return response;
  }

  // noinspection TypeScriptValidateTypes
  @Post('/profile')
  @ApiOperation({ summary: 'Upload profile image' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadProfileImage(
    @UploadedFile() image: Express.Multer.File,
  ): Promise<UploadResponse> {
    if (!image) throw new BadRequestException(`Image file missed`);
    if (image.size > LIMIT_SIZE)
      throw new BadRequestException(
        `Sorry, image file size exceeds, maximum file size is 2 MB`,
      );

    await this.logger.log(`Profile image uploaded: ${image.originalname}`);

    const response: UploadResponse = {
      originalname: image?.originalname || null,
      filename: image?.filename ? `uploads/${image.filename}` : null,
    };
    return response;
  }
}
