import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import FormContext from "@/context/form-context";
import type { FormInstance } from "antd";
import EditableCell from ".";
import "@testing-library/jest-dom";
import type { RenderFormItemFuncType } from "@/interfaces/table-common";

//定义需要传入的泛型的数据结构
interface IHuman {
  id: string;
  name: string;
}

const alice: IHuman = { id: "shenfenzheng01", name: "Alice" };
const newName = "Emma";

/**
 * 测试要点：
 *  1、非编辑状态正常显示 children
 *  2、编辑模式下显示 Form.Item 且 初始值为当前值
 *  3、调用 onCellSave 保存
 */
describe("test EditableCell", () => {
  const mockOnCellSave = vi.fn((_rowId, _cellKey, cellValue) => cellValue);
  const mockForm = {
    getFieldValue: vi.fn(() => newName),
    setFieldValue: vi.fn(),
  };
  const renderFormItem: RenderFormItemFuncType<IHuman> = (record, save) => (
    <input
      defaultValue={record.name}
      onBlur={save} // 模拟失焦保存
      data-testid="input"
    />
  );

  it("render children when not editing", () => {
    render(
      <FormContext.Provider value={mockForm as unknown as FormInstance<IHuman>}>
        <EditableCell<IHuman, "id">
          isEditing={false}
          cellKey="name"
          rowIdName="id"
          record={alice}
          onCellSave={mockOnCellSave}
          renderFormItem={renderFormItem}
        >
          {alice.name}
        </EditableCell>
      </FormContext.Provider>,
    );
    expect(screen.getByText(alice.name)).toBeInTheDocument();
  });

  it("render form item when editing", async () => {
    render(
      <FormContext.Provider value={mockForm as unknown as FormInstance<IHuman>}>
        <EditableCell<IHuman, "id">
          isEditing={true}
          cellKey="name"
          rowIdName="id"
          record={alice}
          onCellSave={mockOnCellSave}
          renderFormItem={renderFormItem}
        >
          {alice.name}
        </EditableCell>
      </FormContext.Provider>,
    );
    const input = screen.getByTestId("input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(alice.name);

    fireEvent.blur(input);
    expect(mockOnCellSave).toHaveBeenCalledWith(alice.id, "name", newName);
    expect(mockForm.setFieldValue).toHaveBeenCalledWith("name", newName);
  });
});
