import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  async createDatabaseBackup(): Promise<{ success: boolean; filename?: string; error?: string }> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `library-saas-backup-${timestamp}.sql`;
      const filepath = path.join('/backups', filename);

      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('DATABASE_URL not set');
      }

      // Use pg_dump for PostgreSQL
      await execAsync(`pg_dump ${databaseUrl} > ${filepath}`);

      // Compress the backup
      await execAsync(`gzip ${filepath}`);

      return {
        success: true,
        filename: `${filename}.gz`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async listBackups(): Promise<string[]> {
    try {
      const backupDir = '/backups';
      if (!fs.existsSync(backupDir)) {
        return [];
      }
      return fs.readdirSync(backupDir).filter((f) => f.startsWith('library-saas-backup'));
    } catch (error) {
      console.error('Error listing backups:', error);
      return [];
    }
  }

  async restoreFromBackup(filename: string): Promise<{ success: boolean; error?: string }> {
    try {
      const filepath = path.join('/backups', filename);

      if (!fs.existsSync(filepath)) {
        throw new Error('Backup file not found');
      }

      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('DATABASE_URL not set');
      }

      // Decompress if needed
      if (filename.endsWith('.gz')) {
        await execAsync(`gunzip -c ${filepath} | psql ${databaseUrl}`);
      } else {
        await execAsync(`psql ${databaseUrl} < ${filepath}`);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
