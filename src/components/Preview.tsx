import React from 'react';
import {useSelector} from 'react-redux';
import PreviewImage from "./PreviewImage";
import {selectFiles} from "../features/files/selectors";

const Preview = () => {
    const files = useSelector(selectFiles);

    return (
        <div id="preview-images">
            {files.map(f => <PreviewImage key={f.filename} filename={f.filename}/>)}
        </div>
    )
}
export default Preview;
