import {FileProgress} from "../features/files";
import classNames from "classnames";
import {Progress, ProgressBar} from "chums-components";
import React from "react";

export interface FileItemProps {
    file: FileProgress;
    onClick: (filename: string) => void;
}

const FileItem = ({file, onClick}: FileItemProps) => {
    const className = classNames({
        'bg-info': file.progress < 100,
        'bg-success': file.progress === 100,
    });
    return (
        <div onClick={() => onClick(file.filename)}>
            <div>{file.filename}</div>
            <Progress>
                <ProgressBar color="primary" valueMin={0} valueMax={100} value={file.progress} striped={file.progress < 100} />
            </Progress>
        </div>
    )
};
export default FileItem;
