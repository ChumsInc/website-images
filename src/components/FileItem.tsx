import {FileProgress, FileStatus, selectFileByName} from "../features/files";
import {BootstrapColor, Progress, ProgressBar} from "chums-components";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../app/configureStore";


const barColor = (status: FileStatus): BootstrapColor => {
    switch (status) {
    case 'pending':
        return 'secondary';
    case 'uploading':
        return 'primary';
    case 'done':
        return 'success';
    case 'error':
        return 'danger';
    default:
        return 'warning';
    }
}

export interface FileItemProps {
    fileName: string;
}

const FileItem = ({fileName}: FileItemProps) => {
    const file = useSelector((state:RootState) => selectFileByName(state, fileName));
    if (!file) {
        return null;
    }
    return (
        <div>
            <div className="text-muted"><small>{file.filename}</small></div>
            <Progress style={{height: '5px'}}>
                <ProgressBar color={barColor(file.status)} valueMin={0} valueMax={100} value={file.progress}
                             striped={file.progress < 100}/>
            </Progress>
        </div>
    )
};
export default FileItem;
