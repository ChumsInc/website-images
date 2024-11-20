import React from 'react';
import numeral from "numeral";
import {ImageSizePath} from "chums-types";
import {selectFileByName} from "../features/files";
import {useSelector} from "react-redux";
import {RootState} from "../app/configureStore";

const linkPath = (filename: string, path?: ImageSizePath) => `/images/products/${path ?? '400'}/${filename}`;

export interface PreviewImageProps {
    filename: string;
}

const PreviewImage = ({filename}: PreviewImageProps) => {
    const file = useSelector((state: RootState) => selectFileByName(state, filename))
    if (!file) {
        return null;
    }
    const {status, progress, thumb, image} = file;
    const src = thumb ?? '/images/products/250/missing.png';
    return (
        <figure>
            <a target="_blank" href={src}>
                <img src={src} alt={image?.filename ?? filename} className="img-thumbnail"/>
            </a>
            {!image && (
                <figcaption className="figure-caption">
                    <div>{filename}</div>
                    <div><strong className="me-3">{status}</strong> {numeral(progress / 100).format('0%')}</div>
                </figcaption>
            )}
            {!!image && (
                <figcaption className="figure-caption">
                    <div>{image.filename}</div>
                    {Object.keys(image.sizes)
                        .map(key => (
                            <div className={'text-muted size-list'} key={key}>
                                <div><a href={linkPath(image.filename, key as ImageSizePath)}
                                        target="_blank">{image.sizes[key as ImageSizePath]?.width ?? '?'}x{image.sizes[key as ImageSizePath]?.height ?? '?'}</a>
                                </div>
                                <div>{numeral(image.sizes[key as ImageSizePath]?.size).format((image.sizes[key as ImageSizePath]?.size ?? 0) > 1000 ? '0.0b' : '0b')}</div>
                            </div>
                        ))}
                </figcaption>

            )}
        </figure>

    )
}
export default PreviewImage;
