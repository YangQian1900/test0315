import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import VariableTable from ".";
import { Provider } from "react-redux";
import { store } from "@/store";
import userEvent from "@testing-library/user-event";

const VariableTableWithProvider = () => {
  return (
    <Provider store={store}>
      <VariableTable />
    </Provider>
  );
};
const user = userEvent.setup();
const getData = () => {
  return store.getState().table.data;
};
const addNewRow = async () => {
  const addButton = screen.getByTestId("btnAdd");
  await user.click(addButton);
};
const deleteRow = async (rowId: number) => {
  await selectRow(rowId);
  const deleteButton = screen.getByTestId("btnDelete");
  await user.click(deleteButton);
};
const selectRow = async (rowId: number) => {
  const row = getRow(rowId);
  await user.click(row!);
};
const getRow = (rowId: number) => {
  return document.querySelector(`[data-row-key="${rowId}"]`) as HTMLElement;
};

describe("variable table", () => {
  // 界面要素齐全
  it("Table Display", async () => {
    render(<VariableTableWithProvider />);
     const tbs = screen.getByTestId("variableTb");
     const tables = within(tbs).getAllByRole("table");
     const rows = within(tables[0]).getAllByRole("row");
    // 检查列标题
    expect(rows[0].textContent?.includes("Index")).toBe(true);
    expect(rows[0].textContent?.includes("Name")).toBe(true);
    expect(rows[0].textContent?.includes("Data Type")).toBe(
      true,
    );
    expect(rows[0].textContent?.includes("Default Value")).toBe(
      true,
    );
    expect(rows[0].textContent?.includes("Comment")).toBe(true);
    // 检查按钮
    expect(screen.getByTestId("btnAdd")).toBeInTheDocument();
    expect(screen.getByTestId("btnDelete")).toBeInTheDocument();
    expect(screen.getByTestId("btnImport")).toBeInTheDocument();
    expect(screen.getByTestId("btnExport")).toBeInTheDocument();
    // 检查文本输入区存在
    expect(screen.getByTestId("textForIO")).toBeInTheDocument();
  });

  // 增删改
  it("Table CRUD", async () => {
    render(<VariableTableWithProvider />);
    const user = userEvent.setup();
    // 1、未新增之前数据为0条
    expect(getData().length).toBe(0);
    // 2、新增一行
    await addNewRow();
    // 2.1 UI上有一行store中也有一行
    const firstRow = getRow(1);
    expect(firstRow).toBeInTheDocument();
    expect(getData().length).toBe(1);
    // 2.2 Index列为1其余列为空
    const cellsOfFirstRow = within(firstRow).getAllByRole("cell");
    expect(cellsOfFirstRow.length === 5);
    for (const index of [...Array(5).keys()]) {
      if (index == 0) {
        expect(cellsOfFirstRow[index]).toHaveTextContent("1");
      } else {
        expect(cellsOfFirstRow[index]).toHaveTextContent("");
      }
    }
    const newEmptyRow = getData()[0];
    expect(newEmptyRow.index).toBe(1);
    expect(
      newEmptyRow.name ||
        newEmptyRow.dataType ||
        newEmptyRow.defaultValue ||
        newEmptyRow.comment,
    ).toBe("");
    // 3、编辑步骤2中新增行的name列
    const name1 = "counter";
    await user.click(cellsOfFirstRow[1]);
    const firstNameInput = within(cellsOfFirstRow[1]).getByRole("textbox");
    // 3.1 点击之后进入编辑状态
    expect(firstNameInput).toBeInTheDocument();
    // 3.2 保存非空白name
    await user.type(firstNameInput, name1);
    fireEvent.blur(firstNameInput);
    expect(getData()[0].name).toBe(name1);
    expect(cellsOfFirstRow[1]).toHaveTextContent(name1);
    // 3.3 再次编辑姓名输入为空
    await user.type(firstNameInput, " ");
    fireEvent.blur(firstNameInput);
    expect(cellsOfFirstRow[1]).toHaveTextContent(name1);
    //4、再新增一行
    await addNewRow();
    const secondRow = getRow(2);
    expect(secondRow).toBeInTheDocument();
    expect(getData().length).toBe(2);
    // 4.1 第二行序号递增
    expect(getData()[1].index).toBe(2);
    // 4.2编辑第二行中的name并尝试保存和第一行相同的名字
    const cellsOfSecondRow = within(secondRow).getAllByRole("cell");
    await user.click(cellsOfSecondRow[1]);
    let secondNameInput = within(cellsOfSecondRow[1]).getByRole("textbox");
    await user.type(secondNameInput, name1);
    fireEvent.blur(secondNameInput);
    expect(getData()[1].name).not.toBe(name1);
    expect(cellsOfSecondRow[1]).not.toHaveTextContent(name1);
    // 4.3 重新输入一个不重复的名字保存
    const name2 = "newcouner";
    await user.click(cellsOfSecondRow[1]);
    secondNameInput = within(cellsOfSecondRow[1]).getByRole("textbox");
    await user.type(secondNameInput, name2);
    fireEvent.blur(secondNameInput);
    expect(getData()[1].name).toBe(name2);
    expect(cellsOfSecondRow[1]).toHaveTextContent(name2);
    // 5、编辑第二行的data type
    await user.click(cellsOfSecondRow[2]);
    let secondDataTypeSelect = within(cellsOfSecondRow[2]).getByRole(
      "combobox",
    );
    expect(secondDataTypeSelect).toBeInTheDocument();
    // 5.1 选中BOOL
    await user.click(secondDataTypeSelect);
    // 无语了antd 会生成两个下拉列表 通过role=listbox找到的元素是不能触发改变的
    const boolOption = document.querySelector("[title='BOOL']");
    expect(boolOption).toBeInTheDocument();
    await user.click(boolOption!);
    fireEvent.blur(secondDataTypeSelect);
    expect(getData()[1].dataType).toBe("BOOL");
    expect(cellsOfSecondRow[2]).toHaveTextContent("BOOL");
    expect(getData()[1].defaultValue).toBe("TRUE");
    expect(cellsOfSecondRow[3]).toHaveTextContent("TRUE");
    // 5.2 在类型是BOOL编辑第二行的默认值
    const tempValidBool = ["FALSE ", "false", "True", " "];
    const tempInvalidBool = ["12", "mm"];
    for (const testValue of [...tempValidBool, ...tempInvalidBool]) {
      await user.click(cellsOfSecondRow[3]);
      const secondDefaultValueInput = within(cellsOfSecondRow[3]).getByRole(
        "textbox",
      );
      await user.clear(secondDefaultValueInput);
      await user.type(secondDefaultValueInput, testValue);
      fireEvent.blur(secondDefaultValueInput);
      if (tempValidBool.includes(testValue)) {
        expect(getData()[1].defaultValue).toBe(
          testValue.trim().toLocaleUpperCase(),
        );
        expect(cellsOfSecondRow[3]).toHaveTextContent(
          testValue.trim().toLocaleUpperCase(),
        );
      } else {
        expect(getData()[1].defaultValue).not.toBe(
          testValue.trim().toLocaleUpperCase(),
        );
        expect(cellsOfSecondRow[3]).not.toHaveTextContent(
          testValue.trim().toLocaleUpperCase(),
        );
      }
    }

    // 5.3 选中INT
    await user.click(cellsOfSecondRow[2]);
    secondDataTypeSelect = within(cellsOfSecondRow[2]).getByRole("combobox");
    await user.click(secondDataTypeSelect);
    const intOption = document.querySelector("[title='INT']");
    expect(intOption).toBeInTheDocument();
    await user.click(intOption!);
    fireEvent.blur(secondDataTypeSelect);
    expect(getData()[1].dataType).toBe("INT");
    expect(cellsOfSecondRow[2]).toHaveTextContent("INT");
    expect(getData()[1].defaultValue).toBe("0");
    expect(cellsOfSecondRow[3]).toHaveTextContent("0");
    // 5.2 在类型是INT编辑第二行的默认值
    const tempValidInt = ["0", "2147483647", "-2147483648", " "];
    const tempInvalidInt = ["0.7", "99.99", "2147483648", "-2147483649"];
    for (const testValue of [...tempValidInt, ...tempInvalidInt]) {
      await user.click(cellsOfSecondRow[3]);
      const secondDefaultValueInput = within(cellsOfSecondRow[3]).getByRole(
        "textbox",
      );
      await user.clear(secondDefaultValueInput);
      await user.type(secondDefaultValueInput, testValue);
      fireEvent.blur(secondDefaultValueInput);
      if (tempValidInt.includes(testValue)) {
        expect(getData()[1].defaultValue).toBe(testValue.trim());
        expect(cellsOfSecondRow[3]).toHaveTextContent(testValue.trim());
      } else {
        expect(getData()[1].defaultValue).not.toBe(testValue.trim());
        expect(cellsOfSecondRow[3]).not.toHaveTextContent(testValue.trim());
      }
    }
    // 6 编辑第二行备注
    await user.click(cellsOfSecondRow[4]);
    const sendCommentInput = within(cellsOfSecondRow[4]).getByRole("textbox");
    await user.type(sendCommentInput, "Counter is for calculate number");
    fireEvent.blur(sendCommentInput);
    expect(getData()[1].comment).toBe("Counter is for calculate number");
    expect(cellsOfSecondRow[4]).toHaveTextContent(
      "Counter is for calculate number",
    );
    // 7 删除第一行数据
    await deleteRow(getData()[0].index);
    expect(getData().length).toBe(1);
    expect(getData()[0].index).toBe(1);
  });

  // 导入导出
  it("Import & Export", async () => {
    const validImportStrArr = [
      "VAR",
      "isReady : BOOL := TRUE; // System ready flag",
      "counter : INT := 0; // Counter",
      "temperature : INT;",
      "END_VAR",
    ];
     const validExportStrArr = [
      "VAR",
      "isReady : BOOL := TRUE; // System ready flag",
      "counter : INT := 0; // Counter",
      "temperature : INT := 0;",
      "END_VAR",
    ];

    render(<VariableTableWithProvider />);
    // 1、导入
    const textarea = screen.getByTestId("textForIO");
    // 1.1、正常导入
    await user.clear(textarea);
    await user.type(textarea, validImportStrArr.join("\n"));
    const btnImport = screen.getByTestId("btnImport");
    await user.click(btnImport);
    expect(getData().length).toBe(3);
    expect(getData()[2].defaultValue).toBe("0");
    let dataRows = screen.getAllByRole("row").slice(1);
    expect(dataRows.length).toBe(3);
    const thirdDefaultValueTd = within(getRow(3)).getAllByRole("cell");
    expect(thirdDefaultValueTd[3]).toHaveTextContent("0");
    // 1.2、非正常导入 数据不会保存 表格也不会变动
    await user.clear(textarea);
    await user.type(textarea, validImportStrArr.slice(2).join("\n"));
    expect(getData().length).not.toBe(2);
    dataRows = screen.getAllByRole("row").slice(1);
    expect(dataRows.length).not.toBe(2);
    //2、导出
    await user.clear(textarea);
    const btnExport = screen.getByTestId("btnExport");
    await user.click(btnExport);
    for (const txt of validExportStrArr) {
      expect(textarea.textContent.includes(txt)).toBe(true);
    }
  });
});
