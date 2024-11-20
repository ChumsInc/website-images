import {ProductImage} from "chums-types";


export type FileStatus = 'pending' | 'uploading' | 'done' | 'error' | 'aborted' | 'timeout';

export interface FileUploadedResult {
    filepath: string,
    mimetype: string,
    mtime: string,
    newFilename: string,
    originalFilename: string,
    size: number,
}

export interface FileProgress {
    filename: string,
    progress: number,
    status: FileStatus,
    thumb?: string,
    image?: ProductImage,
    timestamp?: number,
    result?: FileUploadedResult;
}

export interface FilesReducerState {
    list: FileProgress[],
}
