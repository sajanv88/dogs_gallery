import { api } from '../service/api';

export interface BreedsResponse {
  breeds: string[];
}

const wrapperOnBreedsName = async (
  breedName: string,
): Promise<BreedsResponse> => {
  const response = await api.get(`/breed/${breedName}/images`);
  const {
    data: { message },
  } = response;
  const breedResponse: BreedsResponse = {
    breeds: message,
  };

  return breedResponse;
};

export const fetchDogByBreedName = function* fetchDogByBreedName(
  allBreeds: Map<string, string[]>,
  names: string[],
): IterableIterator<Promise<BreedsResponse>> {
  for (const name of names) {
    if (allBreeds.has(name)) {
      yield wrapperOnBreedsName(name).then(
        (response: BreedsResponse): BreedsResponse => response,
      );
    }
  }
};
