export const isBoolString = (str: string, ignoreCase = true) => {
  const strBools = ["true", "false"];
  if (ignoreCase) {
    return strBools
      .map((item) => item.toLocaleUpperCase())
      .includes(str?.toLocaleUpperCase());
  } else {
    return strBools.includes(str);
  }
};
