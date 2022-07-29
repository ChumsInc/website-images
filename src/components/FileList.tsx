import React from 'react';
import {useSelector} from 'react-redux';
import {selectFiles} from "../features/files";
import FileItem from "./FileItem";
import {ErrorBoundary} from "chums-components";


const FileList = () => {
    const files = useSelector(selectFiles);

    const clickHandler = (fileName: string) => {
        // const [file] = files.filter(f => f.filename === fileName);
        // if (file) {
        //     console.log(file);
        // }
    }

    return (
        <code>
                <pre>
                    {files
                        // .sort((a, b) => (a.filename > b.filename ? 1 : -1))
                        .map(f =>
                            <ErrorBoundary key={f.filename}>
                                <FileItem file={f} onClick={clickHandler}/>
                            </ErrorBoundary>
                        )}
                </pre>
        </code>
    )
}


export default FileList;
