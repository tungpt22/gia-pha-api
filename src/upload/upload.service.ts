import { Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor() {
    // Ensure uploads directory exists
    this.ensureUploadsDirectory();
  }

  private ensureUploadsDirectory(): void {
    const uploadPath = join(process.cwd(), 'uploads');
    if (!existsSync(uploadPath)) {
      this.logger.log(`Creating uploads directory at ${uploadPath}`);
      mkdirSync(uploadPath, { recursive: true });
    }
  }

  getFilePath(filename: string): string | null {
    if (!filename) return null;
    return join(process.cwd(), filename);
  }
}
