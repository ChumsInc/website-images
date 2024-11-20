import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ProductImage} from "chums-types";
import {RootState} from "../../app/configureStore";
import {FileStatus} from "./types";
import {selectPendingCount, selectUploadingCount} from "./selectors";
import {maxFiles} from "./utils";

export const clearFiles = createAction('files/clearFiles');
export const appendFile = createAction<string>('files/appendFile');
export const initFile = createAction<string>('files/file/loadstart')
export const completeFile = createAction('files/file/done', (filename: string, thumb: string, image: ProductImage) => {
    return {
        payload: {
            filename,
            thumb,
            image,
        }
    }
})
export const abortFile = createAction('files/file/abort', (filename: string, status: FileStatus) => {
    return {
        payload: {
            filename,
            status
        }
    }

})
export const setFileProgress = createAction('files/file/progress', (filename: string, progress: number) => {
    return {
        payload: {
            filename,
            progress
        }
    }
});

export const sendFiles = createAsyncThunk<void, FileList>(
    'files/sendFiles',
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
    'files/sendFile',
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
