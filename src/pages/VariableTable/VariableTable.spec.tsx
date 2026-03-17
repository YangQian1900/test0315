import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
  // 点击新增空白行
  it("Add and Delete Row", async () => {
    render(<VariableTableWithProvider />);
    const addButton = screen.getByRole("button", { name: /Add Row/i });
    const user = userEvent.setup();
    // 新增一行
    await user.click(addButton);
    let state = store.getState().table;
    expect(state.data.length).toBe(1);
    const newEmptyRow = state.data[0];
    expect(newEmptyRow.index).toBe(1);
    expect(newEmptyRow.name).toBe("");
    expect(newEmptyRow.dataType).toBe("");
    expect(newEmptyRow.defaultValue).toBe("");
    expect(newEmptyRow.comment).toBe("");
    // 选中新增的一行
    const row = document.querySelector(`[data-row-key="1"]`);
    expect(row).toBeInTheDocument();
    await user.click(row); // 模拟选中
    // 删除一行
    const deleteButton = screen.getByRole("button", { name: /Delete Row/i });
    await user.click(deleteButton);
    state = store.getState().table;
    expect(state.data.length).toBe(0);
  });
});
