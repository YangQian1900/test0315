import { describe, it, expect } from "vitest";
import {
  checkDataTypeRelatedInfo,
  getVarInfo,
  textToStrArr,
} from "./import-helper";

describe("textToStrArr", () => {
  //#region 测试数据
  const validText = `
VAR
isReady : BOOL := TRUE; // System ready flag
counter : INT := 0; // Counter
temperature : INT;
END_VAR
`;
  const validTextArr = [
    "isReady : BOOL := TRUE; // System ready flag",
    "counter : INT := 0; // Counter",
    "temperature : INT;",
  ];
  const invalidText1 = `
isReady : BOOL := TRUE; // System ready flag
counter : INT := 0; // Counter
temperature : INT;
`;
  const invalidText2 = `
VAR
END_VAR
`;
  const invalidText3 = `
VAR

END_VAR
`;
  //#endregion 测试数据

  it("should parse valid text", () => {
    const result = textToStrArr(validText);
    expect(result).toEqual(validTextArr);
  });

  it("should throw when text is invalid", () => {
    expect(() => textToStrArr("")).toThrow();
    expect(() => textToStrArr(invalidText1)).toThrow();
    expect(() => textToStrArr(invalidText2)).toThrow();
    expect(() => textToStrArr(invalidText3)).toThrow();
  });
});

describe("getVarInfo", () => {
  //#region 测试数据
  const validStr1 = "isReady : BOOL := TRUE; // System ready flag";
  const validStr2 = "temperature : INT;";
  const invalidStr1 = "isReady Bool false";
  const validStr1Result = {
    index: -1,
    name: "isReady",
    dataType: "BOOL",
    defaultValue: "TRUE",
    comment: "System ready flag",
  };
  const validStr2Result = {
    index: -1,
    name: "temperature",
    dataType: "INT",
    defaultValue: undefined,
    comment: undefined,
  };
  //#endregion 测试数据

  it("should extract info from valid string", () => {
    let result = getVarInfo(validStr1);
    expect(result).toEqual(validStr1Result);
    result = getVarInfo(validStr2);
    expect(result).toEqual(validStr2Result);
  });
  it("should throw when string is invalid", () => {
    expect(() => getVarInfo(invalidStr1)).toThrow();
  });
});

describe("checkDataTypeRelatedInfo", () => {
  it("normal situation", () => {
    expect(() => checkDataTypeRelatedInfo("BOOL", "TRUE")).not.toThrow();
    expect(() => checkDataTypeRelatedInfo("bool", "TRUE")).not.toThrow();
    expect(() => checkDataTypeRelatedInfo("INT", "0")).not.toThrow();
  });
  it("should throw for invalid type", () => {
    expect(() => checkDataTypeRelatedInfo("STRING", "abc")).toThrow();
  });

  it("should throw for invalid default value", () => {
    expect(() => checkDataTypeRelatedInfo("BOOL", "123")).toThrow();
    expect(() => checkDataTypeRelatedInfo("INT", "abc")).toThrow();
    expect(() => checkDataTypeRelatedInfo("INT", "1.3")).toThrow();
  });
});
