import React from 'react';

import capitalize from '../utils/capitalize';
interface PreviewTitleProps {
  title: string[];
}

const PreviewTitle = ({ title }: PreviewTitleProps): React.ReactElement => {
  const temporaryTitle = title.map((word: string): string => capitalize(word));
  const nameOfThetitle =
    temporaryTitle.length > 1
      ? temporaryTitle.join('/')
      : temporaryTitle.join(' ');

  return (
    <div className="flex flex-col justify-center">
      {nameOfThetitle.length === 0 ? (
        <h1 className="text-center text-2xl font-bold">Analyzing...</h1>
      ) : (
        <h1 className="text-center px-2">
          Preview: You have uploaded a picture of a dog and it is classified as{' '}
          <span className="font-bold">{nameOfThetitle}</span>
        </h1>
      )}
    </div>
  );
};

export default PreviewTitle;
