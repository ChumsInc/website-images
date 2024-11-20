import React from 'react';
import {useSelector} from 'react-redux';
import {selectFiles} from "../features/files";
import FileItem from "./FileItem";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallback from "../app/ErrorBoundaryFallback";


const FileList = () => {
    const files = useSelector(selectFiles);

    return (
        <div>
            {files
                .map(f =>
                    <ErrorBoundary key={f.filename} FallbackComponent={ErrorBoundaryFallback}>
                        <FileItem fileName={f.filename} />
                    </ErrorBoundary>
                )}
        </div>
    )
}


export default FileList;
