import React, { forwardRef as forwardReference, Ref as Reference } from 'react';

interface PreviewImageProps {
  alt: string;
  src: string;
}

const PreviewImage = (
  { src, alt }: PreviewImageProps,
  reference: Reference<HTMLImageElement>,
): React.ReactElement => (
  <figure className="flex justify-center">
    <img
      src={src}
      alt={alt}
      ref={reference}
      className="object-center sm:object-top md:object-right lg:object-bottom xl:object-left h-40"
    />
  </figure>
);

export default forwardReference(PreviewImage);
