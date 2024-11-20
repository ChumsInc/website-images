import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {processingStatusList} from "./utils";
import {FileProgress} from "./types";

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
