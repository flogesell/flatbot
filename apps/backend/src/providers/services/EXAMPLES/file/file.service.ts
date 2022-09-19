// import { Injectable } from '@nestjs/common';
// import { GlobalConfigService } from '../config/config.service';
// import { LoggerService } from '../logger/logger.service';
// import * as fs from 'fs';
// import { utimes } from 'utimes';
// import * as path from 'path';
// import { sleep } from 'src/libraries/sleep.lib';
// import { FileData } from 'src/types';
// import { imageSize } from 'image-size';
// import { ISizeCalculationResult } from 'image-size/dist/types/interface';

// @Injectable()
// export class FileService {
//   public readonly mediaRootFolder = 'media';
//   public readonly rootSubDirectory = '2000';

//   constructor(
//     private readonly configService: GlobalConfigService,
//     private readonly logger: LoggerService,
//   ) {}

//   getFileStats(filePath: string, isRootPath?: boolean) {
//     try {
//       if (!isRootPath) {
//         filePath = path.join(process.cwd(), this.mediaRootFolder, filePath);
//       }
//       if (fs.existsSync(filePath)) {
//         return fs.statSync(filePath);
//       }
//     } catch (e) {
//       this.logger.error(e.message || e);
//     }
//   }

//   async adjustModifiedTime(
//     filePath: string,
//     time: Date,
//     isRootPath?: boolean,
//   ): Promise<boolean> {
//     return new Promise((resolve) => {
//       try {
//         if (!isRootPath) {
//           filePath = path.join(process.cwd(), this.mediaRootFolder, filePath);
//         }
//         if (fs.existsSync(filePath)) {
//           utimes(filePath, time.valueOf())
//             .then(() => {
//               resolve(true);
//             })
//             .catch((error: Error) => {
//               this.logger.error(error.message);
//               resolve(false);
//             });
//         } else {
//           resolve(false);
//         }
//       } catch (e) {
//         this.logger.error(e.message || e);
//         resolve(false);
//       }
//     });
//   }

//   async writeFile(
//     filePath: string,
//     stream: NodeJS.ReadableStream,
//   ): Promise<boolean> {
//     return new Promise((resolve) => {
//       try {
//         if (fs.existsSync(filePath)) {
//           if (this.configService.getFTBDebug()) {
//             this.logger.debug('file did exist, rewriting...');
//           }
//           fs.unlinkSync(filePath);
//           sleep(10);
//         }
//         const writeStream = fs.createWriteStream(filePath);
//         const cleanup = () => {
//           writeStream.removeAllListeners();
//           writeStream.close();
//           stream.removeAllListeners();
//         };
//         stream.on('data', (data: Buffer) => {
//           writeStream.write(data, (error: Error) => {
//             if (!(error == undefined)) {
//               this.logger.error(error.message);
//               cleanup();
//               resolve(false);
//             }
//           });
//         });
//         stream.on('close', () => {
//           cleanup();
//           resolve(true);
//         });
//         stream.on('end', () => {
//           cleanup();
//           resolve(true);
//         });
//         stream.on('error', (error: Error) => {
//           this.logger.error('could not write file...', error.message);
//           cleanup();
//           resolve(false);
//         });
//       } catch (e) {
//         this.logger.error('could not write file...', e.message || e);
//         resolve(false);
//       }
//     });
//   }

//   async readFile(filePath: string): Promise<ArrayBuffer> {
//     return new Promise((resolve) => {
//       try {
//         if (fs.existsSync(filePath)) {
//           const fileBuffer = fs.readFileSync(filePath);
//           resolve(fileBuffer);
//         } else {
//           this.logger.warn('file does not exist:', filePath);
//           resolve(undefined);
//         }
//       } catch (e) {
//         this.logger.error(e.message || e);
//         resolve(undefined);
//       }
//     });
//   }

//   async encodeBase64(file: ArrayBuffer): Promise<string> {
//     return new Promise(async (resolve) => {
//       if (!(file == undefined)) {
//         resolve(Buffer.from(file).toString('base64'));
//       } else {
//         resolve(undefined);
//       }
//     });
//   }

//   /**
//    * Create the directories from a passed path recursively
//    *
//    * @param {string} directoryPath
//    * @return {*}  {void}
//    * @memberof FileService
//    */
//   mkdir(directoryPath: string): void {
//     if (directoryPath == undefined) {
//       return;
//     }
//     const dirExists: boolean = fs.existsSync(directoryPath);

//     if (!dirExists) {
//       this.logger.debug('directory does not exist, creating directory...');
//       fs.mkdirSync(directoryPath, { recursive: true });
//     }
//     return;
//   }

//   /**
//    * check if a file in the passed filepath exists.
//    *
//    * @param {string} filePath
//    * @return {*}  {boolean}
//    * @memberof FileService
//    */
//   public fileExists(filePath: string): boolean {
//     return fs.existsSync(filePath);
//   }

//   /**
//    * Remove file from local storage matching passed filepath
//    *
//    * @param {string} filePath
//    * @return {*}  {boolean}
//    * @memberof FileService
//    */
//   rmFile(filePath: string): boolean {
//     /** deleting file if existing */
//     try {
//       if (fs.existsSync(filePath)) {
//         if (!(fs.unlinkSync == undefined)) {
//           fs.unlinkSync(filePath);
//         } else if (!fs.rmSync) {
//           fs.rmSync(filePath);
//         }
//       }
//       return true;
//     } catch (e) {
//       this.logger.error(e);
//       return false;
//     }
//   }

//   /**
//    * Retrieve a list of files in a directory.
//    * Hidden files will be ignored
//    *
//    * @param {string} directoryPath
//    * @return {*}  {fs.Dirent[]}
//    * @memberof FileService
//    */
//   getContentList(directoryPath: string): fs.Dirent[] {
//     const directoryEntries: fs.Dirent[] = fs.readdirSync(directoryPath, {
//       withFileTypes: true,
//     });
//     /** remove hidden files and directories */
//     const sanitizedDirList: fs.Dirent[] = directoryEntries.filter(
//       (file: fs.Dirent) => !file.name.match(/^[.]+[^\s]*/gi),
//     );
//     return sanitizedDirList;
//   }

//   /**
//    * Retrieve a list of local image files recursively from a path.
//    * In case of no passed path, the root meda folder will be taken
//    *
//    * @param {string} [directoryPath]
//    * @return {*}
//    * @memberof FileService
//    */
//   getImageFiles(
//     directoryPath?: string,
//     imageFiles: FileData[] = [],
//   ): FileData[] {
//     const rootPath: string = path.join(process.cwd(), this.mediaRootFolder);
//     const basePath: string = directoryPath ? directoryPath : rootPath;

//     const directoryEntries: fs.Dirent[] = this.getContentList(basePath);

//     for (const entry of directoryEntries) {
//       if (entry.isFile()) {
//         /** this is a file, so check if its an image */
//         if (entry.name.match(/[^\s]+\.(bmp|png|jpe?g|gif|webp)$/gi)) {
//           /** this is an image file, so add it to the array */
//           imageFiles.push({
//             basePath: basePath,
//             fileName: entry.name,
//             filePath: path.join(basePath, entry.name),
//             fileInfo: entry,
//             fileStats: fs.statSync(path.join(basePath, entry.name)),
//           });
//         }
//       } else if (entry.isDirectory()) {
//         /** this is a directory, find images in subpath */
//         const subdirectoryPath: string = path.join(basePath, entry.name);
//         this.getImageFiles(subdirectoryPath, imageFiles);
//       }
//     }
//     return imageFiles;
//   }

//   /**
//    * Retrieve metadata of a file found in passed filePath
//    *
//    * @param {string} filePath
//    * @return {*}  {fs.Stats}
//    * @memberof FileService
//    */
//   getMetadata(filePath: string): fs.Stats {
//     let result = undefined;
//     if (fs.existsSync(filePath)) {
//       result = fs.statSync(filePath);
//     }
//     return result;
//   }

//   /**
//    * Find and returns all related image files of a passed file path
//    *
//    * @param {string} filePath
//    * @return {*}  {string[]}
//    * @memberof FileService
//    */
//   public getRelatedImageFiles(filePath: string): string[] {
//     const imageSizes: number[] = this.configService.getImageSizes();
//     const relatedImages: string[] = [];

//     const filePathSplit: string[] = filePath.split('/');
//     const fileName: string = filePathSplit[filePathSplit.length - 1];

//     let originFileName: string = '';
//     let webpFileName: string = '';

//     if (fileName.toLocaleLowerCase().includes('.webp') === true) {
//       webpFileName = fileName;
//       originFileName = fileName.replace('.webp', '');
//     } else {
//       webpFileName = fileName + '.webp';
//       originFileName = fileName;
//     }

//     for (const imageSize of imageSizes) {
//       const relatedImagePath: string = path.join(
//         this.getImageSubDirectoryPath(imageSize),
//         originFileName,
//       );
//       const relatedWebpPath: string = path.join(
//         this.getImageSubDirectoryPath(imageSize),
//         webpFileName,
//       );

//       if (this.fileExists(relatedImagePath) === true) {
//         relatedImages.push(relatedImagePath);
//       }

//       if (this.fileExists(relatedWebpPath) === true) {
//         relatedImages.push(relatedWebpPath);
//       }
//     }
//     return relatedImages;
//   }

//   /**
//    * Returns the dimensions of the image file in passed filePath.
//    *
//    * @param {string} filePath
//    * @return {*}  {ISizeCalculationResult}
//    * @memberof FileService
//    */
//   public getImageDimensions(filePath: string): ISizeCalculationResult {
//     return imageSize(filePath);
//   }

//   /**
//    * Returns the root media directory
//    *
//    * @return {*}  {string}
//    * @memberof FileService
//    */
//   public getRootImageDirectory(): string {
//     const rootImageDirectory: string = path.join(
//       process.cwd(),
//       this.mediaRootFolder,
//       this.rootSubDirectory,
//     );
//     const dirExists: boolean = this.fileExists(rootImageDirectory);
//     if (dirExists === false) {
//       this.mkdir(rootImageDirectory);
//     }
//     return path.join(rootImageDirectory);
//   }

//   /**
//    * Returns correct path to sub directory with passed parameter
//    *
//    * @param {number} imageSize
//    * @return {*}  {string}
//    * @memberof FileService
//    */
//   public getImageSubDirectoryPath(imageSize: number): string {
//     return path.join(process.cwd(), this.mediaRootFolder, imageSize.toString());
//   }
// }
