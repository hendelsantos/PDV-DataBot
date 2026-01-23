import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname);
    const filename = `${randomUUID()}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    fs.writeFileSync(filepath, file.buffer);
    
    this.logger.log(`File saved: ${filename}`);
    
    // Return the URL path
    return `/uploads/${filename}`;
  }

  async saveBase64(base64Data: string, filename: string): Promise<string> {
    // Remove data URL prefix if present
    const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    
    const ext = path.extname(filename) || '.png';
    const newFilename = `${randomUUID()}${ext}`;
    const filepath = path.join(this.uploadDir, newFilename);

    fs.writeFileSync(filepath, buffer);
    
    this.logger.log(`Base64 file saved: ${newFilename}`);
    
    return `/uploads/${newFilename}`;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const filename = path.basename(fileUrl);
      const filepath = path.join(this.uploadDir, filename);
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        this.logger.log(`File deleted: ${filename}`);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error('Error deleting file:', error);
      return false;
    }
  }

  getFilePath(fileUrl: string): string | null {
    const filename = path.basename(fileUrl);
    const filepath = path.join(this.uploadDir, filename);
    
    if (fs.existsSync(filepath)) {
      return filepath;
    }
    return null;
  }
}
