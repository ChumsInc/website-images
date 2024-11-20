import {BootstrapColor} from "chums-components";
import React from "react";
import {useAppSelector} from "../app/configureStore";
import {ProgressBar} from "react-bootstrap";
import {FileStatus} from "../features/files/types";
import {selectFileByName} from "../features/files/selectors";


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

export default function FileItem({fileName}: FileItemProps) {
    const file = useAppSelector((state) => selectFileByName(state, fileName));
    if (!file) {
        return null;
    }
    return (
        <div>
            <div className="text-muted"><small>{file.filename}</small></div>
            <ProgressBar variant={barColor(file.status)} now={file.progress} striped={file.progress < 100}
                         style={{height: '5px'}}/>
        </div>
    )
};
