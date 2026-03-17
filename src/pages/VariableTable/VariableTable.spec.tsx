import { describe, it, expect } from "vitest";
import {
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
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

describe("variable table", () => {
  // 界面要素齐全
  it("Table Display", async () => {
    render(<VariableTableWithProvider />);
    // 检查列标题
    const headers = screen.getAllByRole("columnheader");
    expect(headers.some((h) => h.textContent?.includes("Index"))).toBe(true);
    expect(headers.some((h) => h.textContent?.includes("Name"))).toBe(true);
    expect(headers.some((h) => h.textContent?.includes("Data Type"))).toBe(
      true,
    );
    expect(headers.some((h) => h.textContent?.includes("Default Value"))).toBe(
      true,
    );
    expect(headers.some((h) => h.textContent?.includes("Comment"))).toBe(true);
    // 检查按钮
    expect(screen.getByText("Add Row")).toBeInTheDocument();
    expect(screen.getByText("Delete Row")).toBeInTheDocument();
    expect(screen.getByText("Import")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
    // 检查文本输入区存在
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
  // 综合测试
  it("Integration Testing", async () => {
    render(<VariableTableWithProvider />);
    const user = userEvent.setup();
    // 1、未新增之前数据为0条
    expect(store.getState().table.data.length).toBe(0);
    // 2、新增一行
    const addButton = screen.getByRole("button", { name: /Add Row/i });
    await user.click(addButton);
    // 2.1 UI上有一行store中也有一行
    const firstRow = document.querySelector(
      `[data-row-key="1"]`,
    ) as HTMLElement;
    expect(firstRow).toBeInTheDocument();
    expect(store.getState().table.data.length).toBe(1);
    // 2.2 Index列为1其余列为空
    const cellsOfFirstRow = within(firstRow).getAllByRole("cell");
    expect(cellsOfFirstRow.length === 5);
    expect(cellsOfFirstRow[0]).toHaveTextContent("1");
    expect(cellsOfFirstRow[1]).toHaveTextContent("");
    expect(cellsOfFirstRow[2]).toHaveTextContent("");
    expect(cellsOfFirstRow[3]).toHaveTextContent("");
    expect(cellsOfFirstRow[4]).toHaveTextContent("");
    const newEmptyRow = store.getState().table.data[0];
    expect(newEmptyRow.index).toBe(1);
    expect(newEmptyRow.name).toBe("");
    expect(newEmptyRow.dataType).toBe("");
    expect(newEmptyRow.defaultValue).toBe("");
    expect(newEmptyRow.comment).toBe("");
    // 3、编辑2中新增行的name列
    const name1 = "counter";
    await user.click(cellsOfFirstRow[1]);
    const firstNameInput = within(cellsOfFirstRow[1]).getByRole("textbox");
    // 3.1 点击之后进入编辑状态
    expect(firstNameInput).toBeInTheDocument();
    // 3.2 保存非空白name
    await user.type(firstNameInput, name1);
    fireEvent.blur(firstNameInput);
    expect(store.getState().table.data[0].name).toBe(name1);
    expect(cellsOfFirstRow[1]).toHaveTextContent(name1);
    // 3.3 再次编辑姓名输入为空
    await user.type(firstNameInput, " ");
    fireEvent.blur(firstNameInput);
    expect(cellsOfFirstRow[1]).toHaveTextContent(name1);
    //4、再新增一行
    await user.click(addButton);
    const secondRow = document.querySelector(
      `[data-row-key="2"]`,
    ) as HTMLElement;
    expect(secondRow).toBeInTheDocument();
    expect(store.getState().table.data.length).toBe(2);
    // 4.1 第二行序号递增
    expect(store.getState().table.data[1].index).toBe(2);
    // 4.2编辑第二行中的name并尝试保存和第一行相同的名字
    const cellsOfSecondRow = within(secondRow).getAllByRole("cell");
    await user.click(cellsOfSecondRow[1]);
    let secondNameInput = within(cellsOfSecondRow[1]).getByRole("textbox");
    await user.type(secondNameInput, name1);
    fireEvent.blur(secondNameInput);
    expect(store.getState().table.data[1].name).not.toBe(name1);
    expect(cellsOfSecondRow[1]).not.toHaveTextContent(name1);
    // 4.3 重新输入一个不重复的名字保存
    await user.click(cellsOfSecondRow[1]);
    secondNameInput = within(cellsOfSecondRow[1]).getByRole("textbox");
    await user.type(secondNameInput, "newcouner");
    fireEvent.blur(secondNameInput);
    expect(store.getState().table.data[1].name).toBe("newcouner");
    expect(cellsOfSecondRow[1]).toHaveTextContent("newcouner");
    // 5、编辑第二行的data type
    await user.click(cellsOfSecondRow[2]);
    let secondDataTypeSelect = within(cellsOfSecondRow[2]).getByRole(
      "combobox",
    );
    expect(secondDataTypeSelect).toBeInTheDocument();
    // 5.1 选中BOOL
    await user.click(secondDataTypeSelect);
    // 无语了antd 会生成两个下拉列表 通过role=listbox找到的元素是不能触发改变的
    let boolOption = document.querySelector("[title='BOOL']");
    expect(boolOption).toBeInTheDocument();
    await user.click(boolOption!);
    fireEvent.blur(secondDataTypeSelect);
    expect(store.getState().table.data[1].dataType).toBe("BOOL");
    expect(cellsOfSecondRow[2]).toHaveTextContent("BOOL");
    expect(store.getState().table.data[1].defaultValue).toBe("TRUE");
    expect(cellsOfSecondRow[3]).toHaveTextContent("TRUE");
    // 5.2 选中INT
    await user.click(cellsOfSecondRow[2]);
    secondDataTypeSelect = within(cellsOfSecondRow[2]).getByRole("combobox");
    await user.click(secondDataTypeSelect);
    boolOption = document.querySelector("[title='INT']");
    expect(boolOption).toBeInTheDocument();
    await user.click(boolOption!);
    fireEvent.blur(secondDataTypeSelect);
    expect(store.getState().table.data[1].dataType).toBe("INT");
    expect(cellsOfSecondRow[2]).toHaveTextContent("INT");
    expect(store.getState().table.data[1].defaultValue).toBe("0");
    expect(cellsOfSecondRow[3]).toHaveTextContent("0");
  });
});
