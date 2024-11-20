import {createReducer} from "@reduxjs/toolkit";
import {FilesReducerState} from "./types";
import {abortFile, appendFile, clearFiles, completeFile, initFile, setFileProgress} from "./actions";

const defaultState: FilesReducerState = {
    list: []
}


const filesReducer = createReducer(defaultState, (builder) => {
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


export default filesReducer;
