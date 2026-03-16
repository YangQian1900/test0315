import type { IFiled } from "@/interfaces/table";
import { message } from "antd";
import { checkValues, DefaultValueMap, isDataType } from "./table";

/** 文本开始字符串 */
const START_STR = "VAR";
/** 文本结束字符串 */
const END_STR = "END_VAR";
/** 一行变量引入的格式正则 */
const REG = /^(\w+)\s*:\s*(\w+)(?:\s*:=\s*([^;]+))?;(?:\s*\/\/\s*(.*))?$/;

/** 将文本转化为字符串数组 这个过程中去掉 VAR END_VAR 以及空行*/
export const textToStrArr = (text: string): string[] => {
  if (!text?.trim()) {
    throw Error("import text can't be empty");
  }
  const tempArr = text
    .trim()
    .split("\n")
    .map((i) => i.trim());
  if (tempArr[0] !== START_STR || tempArr[tempArr.length - 1] !== END_STR) {
    throw Error(
      `Format is wrong, please start with '${START_STR}' and end with '${END_STR}'`,
    );
  }
  return tempArr.filter((item) => {
    return item !== START_STR && item !== END_STR && item;
  });
};

export const getVarInfo = (str: string): IFiled => {
  const matchArr = str.match(REG);
  if (!matchArr) {
    throw Error("Format error, cannot parse");
  }
  return {
    // 临时给个-1
    index: -1,
    name: matchArr[1],
    dataType: matchArr[2]?.toLocaleUpperCase(),
    defaultValue: matchArr[3]?.toLocaleUpperCase(),
    comment: matchArr[4],
  };
};

/** 检查类型相关信息：即类型和默认值 */
export const checkDataTypeRelatedInfo = (dataType:string, defaultValue:string) => {
  // 检查类型
  if (!isDataType(dataType)) {
    throw Error(`Unsupported data type: ${dataType}`);
  }
  // 检查类型对应的默认值是否OK
  if (defaultValue && !checkValues[dataType](defaultValue)) {
    const error =
      dataType === "BOOL"
        ? "When data type is BOOL, defaule value can only accept false, FALSE, true, TRUE"
        : "When data type is INT, defaule value can only accept a integer bewteen -2147483648 and 2147483647";
    throw Error(error);
  }
};

export const convertTextToData = (text: string) => {
  try {
    // 1、提取出变量定义的字符串数组
    const strArr = textToStrArr(text);
    if (strArr.length === 0) {
      return;
    }
    const tempVarInfo: IFiled[] = [];
    // 2、循环数组获取变量信息
    for (const varStr of strArr) {
      tempVarInfo.push(getVarInfo(varStr));
    }
    const varInfo: IFiled[] = [];
    const names = new Set();
    // 3、一行一行检查、调整数据
    for (const index in tempVarInfo) {
        const vari = tempVarInfo[index];
        // 3.1 检查名字
        if(names.has(vari.name)){
            throw Error(`Duplicate name: ${vari.name}`);
        }
        // 3.2 检查数据类型和默认值
        checkDataTypeRelatedInfo(vari.dataType, vari.defaultValue);
        varInfo.push({
            ...vari,
            index:varInfo.length+1,
            defaultValue:vari.defaultValue || DefaultValueMap[vari.dataType]
        });
    }
    // 4、返回数据
    return varInfo;
  } catch (e: unknown) {
    if (e instanceof Error) {
      message.error(e.message);
    }
  }
};
