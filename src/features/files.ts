import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {RootState} from "../app/configureStore";
import {ProductImage} from 'chums-types';
import fileList from "../components/FileList";

export type FileStatus = 'pending' | 'uploading' | 'done' | 'error' | 'aborted' | 'timeout';

export const processingStatusList:FileStatus[] = ['pending', 'uploading'];
export const doneStatusList:FileStatus[] = ['done'];
export const errorStatusList:FileStatus[] = ['error', 'aborted', 'timeout'];

export const maxFiles = 3;

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

export const selectFiles = (state: RootState) => state.files.list;
export const selectInProcessCount = (state: RootState) => state.files.list.filter(f => processingStatusList.includes(f.status)).length;
export const selectUploadingCount = (state:RootState) => state.files.list.filter(f => f.status === 'uploading').length;
export const selectPendingCount = (state:RootState) => state.files.list.filter(f => f.status === 'pending').length;

export const selectFileByName = createSelector(
    (state:RootState) => state.files.list,
    (state:RootState, fileName:string) => fileName,
    (list:FileProgress[], fileName:string) => {
        const [file] = list.filter(f => f.filename === fileName);
        return file ?? null;
    }
)

const defaultState: FilesReducerState = {
    list: []
}

export const clearFiles = createAction('app/files/clearFiles');
export const appendFile = createAction<string>('app/files/appendFile');
export const initFile = createAction<string>('app/files/file/loadstart')
const completeFile = createAction('app/files/file/done', (filename: string, thumb: string, image: ProductImage) => {
    return {
        payload: {
            filename,
            thumb,
            image,
        }
    }
})
const abortFile = createAction('app/files/file/abort', (filename: string, status: FileStatus) => {
    return {
        payload: {
            filename,
            status
        }
    }

})
const setFileProgress = createAction('app/files/file/progress', (filename: string, progress: number) => {
    return {
        payload: {
            filename,
            progress
        }
    }
});

export const sendFiles = createAsyncThunk<void, FileList>(
    'app/files/sendFiles',
    (fileList, {dispatch, getState}) => {
        let intervalId = 0;
        let index = 0;
        try {
            for (let i = 0; i < fileList.length; i += 1) {
                dispatch(appendFile(fileList[i].name));
            }
            intervalId = window.setInterval(() => {
                const state = getState() as RootState;
                if (selectPendingCount(state) > 0 && selectUploadingCount(state) < maxFiles) {
                    dispatch(sendFile(fileList[index]));
                    index += 1;
                }
                if (selectPendingCount(state) === 0) {
                    window.clearInterval(intervalId);
                }
            }, 500);
        } catch(err:unknown) {
            window.clearInterval(intervalId);
            if (err instanceof Error) {
                console.debug("sendFiles()", err.message);
                return Promise.reject(err);
            }
            console.debug("()", err);
            return Promise.reject(new Error('Error in ()'));
        }
    }
)

export const sendFile = createAsyncThunk<void, File>(
    'app/files/sendFile',
    async (file, thunkAPI) => {
        const dispatch = thunkAPI.dispatch;
        dispatch(appendFile(file.name));
        try {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.upload.addEventListener('progress', ev => {
                // console.log('sendFile() progress', ev);
                dispatch(setFileProgress(file.name, (ev.loaded / ev.total) * 100));
            });

            xhr.upload.addEventListener('loadstart', (ev) => {
                // console.log('sendFile() loadstart', ev);
                dispatch(initFile(file.name));
            });

            xhr.upload.addEventListener('abort', (ev) => {
                console.log('sendFile() abort', ev);
                dispatch(abortFile(file.name, 'aborted'));
            });

            xhr.upload.addEventListener('error', (ev) => {
                console.log('sendFile() error', ev);
                dispatch(abortFile(file.name, 'error'));
            });

            xhr.upload.addEventListener('timeout', (ev) => {
                console.log('sendFile() timeout', ev);
                dispatch(abortFile(file.name, 'timeout'));
            });

            xhr.upload.addEventListener('load', (ev) => {
                // console.log('sendFile() load', ev);
            });

            xhr.onreadystatechange = (ev) => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    try {
                        const {thumb, images, saveResult} = xhr.response;
                        dispatch(completeFile(file.name, thumb, saveResult));

                    } catch(err:unknown) {
                        if (err instanceof Error) {
                            console.debug("onreadystatechange()", err.message);
                            return Promise.reject(err);
                        }
                        console.debug("onreadystatechange()", err);
                        return Promise.reject(new Error('Error in onreadystatechange()'));
                    }
                }
            };

            const formData = new FormData();
            formData.append(file.name, file, file.name);
            xhr.open('POST', '/api/images/products/upload', true);
            xhr.send(formData);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.warn("app/sendFile", err.message);
                return thunkAPI.rejectWithValue({errMessage: err.message})
            }
            console.warn("()", err);
            return Promise.reject(new Error('Error in ()'));
        }
    }
)

const reducer = createReducer(defaultState, (builder) => {
    builder
        .addCase(clearFiles, (state) => {
            state.list = [];
        })
        .addCase(appendFile, (state, action) => {
            const [existing] = state.list.filter(f => f.filename === action.payload);
            if (existing) {
                existing.progress = 0;
                existing.status = 'pending';
            } else {
                state.list.push({
                    filename: action.payload,
                    progress: 0,
                    status: "pending"
                })
            }
        })
        .addCase(initFile, (state, action) => {
            state.list.filter(f => f.filename === action.payload).forEach(file => file.status = 'uploading');
        })
        .addCase(completeFile, (state, action) => {
            state.list.filter(f => f.filename === action.payload.filename)
                .forEach(file => {
                    file.status = 'done';
                    file.thumb = action.payload.thumb;
                    file.image = action.payload.image;
                    file.timestamp = new Date().valueOf()
                });
        })
        .addCase(setFileProgress, (state, action) => {
            state.list.filter(f => f.filename === action.payload.filename)
                .forEach(file => file.progress = action.payload.progress);
        })
        .addCase(abortFile, (state, action) => {
            state.list.filter(f => f.filename === action.payload.filename)
                .forEach(file => file.status = action.payload.status);
        })
});


export default reducer;
