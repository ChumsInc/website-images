import {FileStatus} from "./types";

export const processingStatusList:FileStatus[] = ['pending', 'uploading'];
export const doneStatusList:FileStatus[] = ['done'];
export const errorStatusList:FileStatus[] = ['error', 'aborted', 'timeout'];

export const maxFiles = 3;
