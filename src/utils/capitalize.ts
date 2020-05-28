const capitalize = (string: string): string =>
  string.replace(/\b\w/u, (char: string): string => char.toUpperCase());

export default capitalize;
