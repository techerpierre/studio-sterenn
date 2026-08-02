import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import env from '@/config/env';
import {
  DownloadFileResult,
  GetStreamResult,
  UploadFileData,
  UploadFileResult,
} from './storage.types';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService implements OnModuleInit {
  static readonly BucketName = 'sterenn';

  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(
    key: string,
    data: UploadFileData,
  ): Promise<UploadFileResult> {
    const command = new PutObjectCommand({
      Bucket: StorageService.BucketName,
      Key: key,
      Body: data.data,
      ContentType: data.contentType,
    });
    await this.s3Client.send(command);

    const getCommand = new GetObjectCommand({
      Bucket: StorageService.BucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(this.s3Client, getCommand, {
      expiresIn: 300,
    });

    return {
      ressourceUrl: signedUrl,
    };
  }

  async downloadFile(key: string): Promise<DownloadFileResult> {
    const command = new GetObjectCommand({
      Bucket: StorageService.BucketName,
      Key: key,
    });
    const response = await this.s3Client.send(command);
    if (!response.Body) {
      throw new NotFoundException('File not found');
    }
    return {
      data: Buffer.from(await response.Body.transformToByteArray()),
      contentType: response.ContentType ?? '',
    };
  }

  async getStream(key: string): Promise<GetStreamResult> {
    const command = new GetObjectCommand({
      Bucket: StorageService.BucketName,
      Key: key,
    });
    const response = await this.s3Client.send(command);
    if (!response.Body) {
      throw new NotFoundException('File not found');
    }
    return {
      stream: response.Body.transformToWebStream(),
      contentType: response.ContentType ?? '',
    };
  }

  async onModuleInit(): Promise<void> {
    await this.createBucketIfNotExists(StorageService.BucketName);
  }

  private async createBucketIfNotExists(bucketName: string): Promise<void> {
    try {
      const command = new HeadBucketCommand({
        Bucket: bucketName,
      });
      await this.s3Client.send(command);
    } catch (error: any) {
      if (error.$metadata.httpStatusCode === 404 || error.code === 'NotFound') {
        const command = new CreateBucketCommand({
          Bucket: bucketName,
        });
        await this.s3Client.send(command);
      } else {
        throw error;
      }
    }
  }
}
