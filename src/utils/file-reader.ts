export interface ImageProps {
  imageSource: string;
  name: string;
}

export const getFile = async (file: File): Promise<ImageProps | Error> => {
  return new Promise((resolve: Function, reject: Function): void => {
    if (file === undefined) {
      reject(new Error('File upload cancelled.'));
    } else {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.addEventListener('load', function onload(): void {
        const imageObject: ImageProps = {
          imageSource: fileReader.result as string,
          name: file.name.replace(/\W[a-z]+/u, ''),
        };
        resolve(imageObject);
      });
      fileReader.addEventListener('error', function onError(): void {
        reject(new Error('Error caught: when reading a file'));
      });
    }
  });
};
