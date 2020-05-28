export const formatNames = (array: string[]): string[] => {
  const temporary: string[][] = [];

  array.forEach((name: string): void => {
    if (/\s/u.test(name)) {
      temporary.push(name.split(' '));
    } else {
      temporary.push([name]);
    }
  });
  const unique = new Set(temporary.flat());

  return Array.from(Array.from(unique));
};
