export const isBoolString = (str: string) => {
  const strBools = ["true", "false", "TRUE", "FALSE"];
  return strBools.includes(str);
};

/** 字符串是否是在[2147483648, 2147483647]中的整数*/
export const isStrValidInt = (str: string): boolean => {
  const num = Number(str);
  return Number.isInteger(num) && num >= -2147483648 && num <= 2147483647;
};
