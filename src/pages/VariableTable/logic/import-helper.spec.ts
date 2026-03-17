import { describe, it, expect } from "vitest";
import { textToStrArr } from "./import-helper";

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

describe("textToStrArr", () => {
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
