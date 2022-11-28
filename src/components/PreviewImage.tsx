import React from 'react';
import numeral from "numeral";
import {ImageSizePath, ProductImage} from "chums-types";

const linkPath = (filename: string) => `/images/products/400/${filename}`;

export interface PreviewImageProps {
    image?: ProductImage;
}

const PreviewImage = ({image}: PreviewImageProps) => {
    if (!image) {
        return null;
    }
    const src = `/images/products/250/${image.filename}?ts=${image.timestamp}`;
    return (
        <figure>
            <a target="_blank" href={src}>
                <img src={src} alt={image.filename} className="img-thumbnail"/>
            </a>
            <figcaption className="figure-caption">
                <div>{image.filename}</div>
                {Object.keys(image.sizes)
                    .map(key => image.sizes[key as ImageSizePath])
                    .map((size, index) => (
                        <div className={'text-muted size-list'} key={index}>
                            <div><a href={linkPath(image.filename)} target="_blank">{size?.width ?? '?'}x{size?.height ?? '?'}</a></div>
                            <div>{numeral(size?.size).format((size?.size ?? 0) > 1000 ? '0.0b' : '0b')}</div>
                        </div>
                    ))}
            </figcaption>
        </figure>

    )
}
export default PreviewImage;
