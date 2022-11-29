import React, {useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import {useAppDispatch} from "../app/configureStore";
import {clearFiles, selectInProcessCount, sendFile, sendFiles} from "../features/files";
import {useSelector} from "react-redux";

const DropTarget = () => {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [highlight, setHighlight] = useState(false);
    const className = classNames('rounded border', {'border-secondary': !highlight, 'border-primary': highlight});
    const remaining = useSelector(selectInProcessCount);

    const clickHandler = (ev: React.MouseEvent<HTMLDivElement>) => {
        ev.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const dropHandler = async (ev: React.DragEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!ev || !ev.dataTransfer) {
            return;
        }

        console.log('dropHandler()', ev.dataTransfer.files.length);
        dispatch(sendFiles(ev.dataTransfer.files));
        // let fileIndex = 0;
        // const files = ev.dataTransfer.files;
        // const t = window.setInterval(() => {
        //     console.log('remaining', {remaining, fileIndex, intervalId});
        //     if (remaining < 1 && fileIndex < files.length) {
        //         console.log('dropping', fileIndex);
        //         const file = files[fileIndex];
        //         if (file) {
        //             dispatch(sendFile(file));
        //         }
        //         fileIndex += 1;
        //     }
        //     if (fileIndex >= files.length) {
        //         window.clearInterval(intervalId);
        //     }
        // }, 1000);
        // setIntervalId(t);
        // for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        //     const file = ev.dataTransfer.files[i];
        //     if (files) {
        //         files.push(file);
        //     }
        //     dispatch(sendFile(file));
        // }
    }

    const dragOverHandler = (ev: React.DragEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
    }

    const dragEnterHandler = (ev: React.DragEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        setHighlight(true);
    }

    const dragLeaveHandler = (ev: React.DragEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        setHighlight(false);
    }

    const filesChangeHandler = () => {
        const files = fileInputRef.current?.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                dispatch(sendFile(files[i]));
            }
        }

    }

    const clearListHandler = () => {
        dispatch(clearFiles());
    }


    return (
        <div>
            <input type="file" ref={fileInputRef} multiple onChange={filesChangeHandler} style={{display: 'none'}}/>
            <div id="drop-zone" className={className}
                 onClick={clickHandler}
                 onDrop={dropHandler}
                 onDragOver={dragOverHandler}
                 onDragEnter={dragEnterHandler}
                 onDragLeave={dragLeaveHandler}>
                <div className="text-muted drop-target">Drop Files Here.</div>
            </div>
            <div className="text-muted"><strong className="alert-title">Uploading:</strong> {remaining}</div>
            <div className="d-grid my-1">
                <button type="button" className="btn btn-outline-primary" disabled={remaining > 0} onClick={clearListHandler}>Clear List</button>
            </div>
        </div>
    )
}
export default DropTarget;
