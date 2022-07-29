import React from 'react';
import {useSelector} from 'react-redux';
import PreviewImage from "./PreviewImage";
import {selectFiles} from "../features/files";

const Preview = () => {
    const files = useSelector(selectFiles);

    return (
        <div id="preview-images">
            {files.map(f => <PreviewImage key={f.filename} image={f.image}/>)}
        </div>
    )
}
export default Preview;
