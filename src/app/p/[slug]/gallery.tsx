"use client";
import type { NextPage } from "next";
import type { LightGallery } from "lightgallery/lightgallery";

import Image from "next/image";

import LightGalleryComponent from "lightgallery/react";
import "lightgallery/css/lightgallery.css";

import lgThumbnail from "lightgallery/plugins/thumbnail";
import "lightgallery/css/lg-thumbnail.css";

import lgZoom from "lightgallery/plugins/zoom";
import "lightgallery/css/lg-zoom.css";

import { useRef } from "react";

type ImageEnhanced = {
    src: string;
    alt: string;
    width: number;
    height: number;
};

type ImageGalleryPageProps = {
    images: ImageEnhanced[];
};

const ImageGalleryPage: NextPage<ImageGalleryPageProps> = ({ images }) => {

    const lightbox = useRef<LightGallery | null>(null);

    return (
        <>
            {/* Lightbox that opens on image clicks */}
            <LightGalleryComponent
                // Once the component initializes, we'll assign the instance to our React ref.  This is used in the onClick() handler of each image in the Masonry layout
                onInit={(ref) => {
                    if (ref) {
                        lightbox.current = ref.instance;
                    }
                }}
                plugins={[lgThumbnail, lgZoom]}
                // These options turn the component into a "controlled" component that let's us determine when to open/close it
                dynamic
                dynamicEl={images.map((image) => ({
                    src: process.env.NEXT_PUBLIC_CF_R2_ENDPOINT + '/' + image,
                    thumb: process.env.NEXT_PUBLIC_CF_R2_ENDPOINT + '/' + image,
                    width: '200',
                    alt: 'img',
                }))}
            />
            <div className="flex flex-wrap gap-4">
                {images.map((img, idx) => (
                    <Image
                        key={idx}
                        className="hover:opacity-80 cursor-pointer w-[240px] h-auto aspect-square object-cover"
                        // Here, we're using the ref to dynamically open the gallery to the exact image that was clicked by the user
                        onClick={() => lightbox.current?.openGallery(idx)}
                        src={process.env.NEXT_PUBLIC_CF_R2_ENDPOINT + '/' + img}
                        alt="img"
                        width="300"
                        height="400"
                    />
                ))}
            </div>
        </>
    );
};

const Gallery = ({images}) => {

    return (
        <div>
            <div className="text-primary text-xl font-semibold mt-12 mb-2 pb-2 justify-between flex items-center">
                <div>Image Gallery</div>
            </div>
            <div className="mx-auto">
            <ImageGalleryPage images={images} />
            </div>
      </div>
  );
};

export default Gallery;