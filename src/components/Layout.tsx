import './Layout.css';

import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';

import { api } from '../service/api';
import { fetchDogByBreedName } from '../utils/breeds';
import FileUpload from './Fileupload';
import Info from './Info';
import Scrollable from './Scrollable';
import Spinner from './Spinner';

const allBreeds = new Map<string, string[]>();

const LayoutContainer = (): React.ReactElement => {
  const [nameOfTheBreeds, setNameOfTheBreeds] = useState<string[]>([]);
  const [classifiedDogsList, setClassifiedDogsList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  useEffect((): void => {
    api
      .get('/breeds/list/all')
      .then((response: AxiosResponse): void => {
        Object.keys(response.data.message).forEach(function loopThrough(
          key: string,
        ): void {
          allBreeds.set(key, response.data.message[key]);
        });
      })
      .catch((error: AxiosError): void => {
        console.warn(error);
      });
  }, []);

  const onUploadStartedHandler = function onUploadStartedHandler(): void {
    setClassifiedDogsList([]);
  };

  const onUploadedHandler = async function onUploadedHandler(
    names: string[],
  ): Promise<boolean> {
    if (isEmpty) {
      setIsEmpty(false);
    }

    setNameOfTheBreeds(names);
    setLoading(true);
    const dogNames: string[] = [];

    for (const name of names) {
      if (allBreeds.has(name)) {
        dogNames.push(name);
      }
    }

    setNameOfTheBreeds(dogNames);

    const data = fetchDogByBreedName(allBreeds, names);
    const allResults = [];

    while (true) {
      const next = data.next();

      if (next.done === true) {
        break;
      }

      allResults.push(next.value);
    }

    // Resolve all the promises from iterateable value and it returns 2 dimensional array
    const breedList = await Promise.all(allResults);
    const breeds = [];

    for (const dog of breedList) {
      breeds.push(dog.breeds);
    }

    // Flattern 2 dimensional array
    const breedsResult = breeds.flat();
    setClassifiedDogsList(breedsResult);
    setLoading(false);

    if (breedsResult.length === 0) {
      setIsEmpty(true);
    }

    return false;
  };

  return (
    <React.Fragment>
      <h1 className="text-3xl text-black font-bold text-center">
        Dogs gallery
      </h1>

      <div className="flex justify-center items-center">
        <div className="mt-2 w-5/6 flex flex-col justify-center items-center border-2 left-container">
          <FileUpload
            onUploadStarted={onUploadStartedHandler}
            onUploadCompleted={onUploadedHandler}
            classifiedDogNames={nameOfTheBreeds}
          />
        </div>
        <div className="w-full mt-2 bg-gray-700 border-2 right-container">
          {typeof loading === 'object' ? (
            <Info
              msg="Gallery will be display as soon as you upload your dog's
                picture."
            />
          ) : loading === true ? (
            <div className="flex justify-center items-center h-screen">
              <Spinner />
            </div>
          ) : classifiedDogsList.length > 0 ? (
            <div className="h-screen">
              <Scrollable breeds={classifiedDogsList} />
            </div>
          ) : isEmpty === true ? (
            <Info msg="No results found!" />
          ) : null}
        </div>
      </div>
    </React.Fragment>
  );
};

export default LayoutContainer;
