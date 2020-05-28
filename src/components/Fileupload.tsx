import * as mobilenet from '@tensorflow-models/mobilenet';
import React, { Fragment, useRef as useReference, useState } from 'react';

import { getFile, ImageProps as ImageProperties } from '../utils/file-reader';
import { formatNames } from '../utils/names';
import PreviewImage from './Previewimage';
import PreviewTitle from './Title';

interface Predictions {
  className: string;
  probability: number;
}

interface FileUploadProps {
  classifiedDogNames: string[];
  onUploadCompleted: (arr: string[]) => void;
  onUploadStarted?: () => void;
}

const FileUpload = ({
  classifiedDogNames,
  onUploadStarted,
  onUploadCompleted,
}: FileUploadProps): React.ReactElement => {
  const imageReference = useReference<HTMLImageElement>(null);
  const fileInput = useReference<HTMLInputElement>(null);
  const [image, setImage] = useState<ImageProperties | null>(null);

  const onFileHandler = async function onFileHandler(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<boolean> {
    const {
      target: { files },
    } = event;

    const file = files as FileList;

    if (onUploadStarted !== undefined && file[0] !== undefined)
      onUploadStarted();

    try {
      const imageInfo = (await getFile(file[0])) as ImageProperties;
      setImage(imageInfo);

      if (imageReference.current !== null) {
        const model = await mobilenet.load();
        const predictions = (await model.classify(
          imageReference.current,
        )) as Predictions[];

        // Tensorflow automatically returns a sorted array by its probability value
        const [{ className }] = predictions;

        const filteredNames = formatNames(
          className
            .split(/\s|,/u)
            .map((item: string): string =>
              item.toLowerCase().replace(/\s/u, ''),
            )
            .filter((item: string): string => item),
        );

        onUploadCompleted(filteredNames);
      }
    } catch (error) {
      /*
       * In commerical product we can add an error notification to the users.
       * I am skipping intentionally for now
       */
      console.warn(error);
    }

    return true;
  };

  const onUploadHandler = function onUploadHandler(
    event: React.MouseEvent<HTMLButtonElement>,
  ): void {
    event.preventDefault();
    fileInput.current?.click();
  };

  return (
    <Fragment>
      <input
        type="file"
        accept="image/*"
        onChange={onFileHandler}
        className="hidden"
        ref={fileInput}
      />
      <div style={{ width: '390px' }}>
        {image === null ? null : (
          <Fragment>
            <PreviewTitle title={classifiedDogNames} />
            <PreviewImage
              src={image.imageSource}
              alt={image.name}
              ref={imageReference}
            />
          </Fragment>
        )}
      </div>
      <div className="flex justify-center">
        <button
          className="w-auto mt-1 bg-blue-600 hover:bg-blue-500 px-6 py-3 text-white font-bold rounded"
          onClick={onUploadHandler}
        >
          {image === null ? `Upload` : `Change`}
        </button>
      </div>
    </Fragment>
  );
};

export default FileUpload;
