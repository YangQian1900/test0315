import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FormContext from "@/context/form-context";
import type { FormInstance } from "antd";
import EditableCell from ".";
import "@testing-library/jest-dom";

//定义需要传入的泛型的数据结构
interface IHuman {
  id: string;
  name: string;
}

const alice: IHuman = { id: "shenfenzheng01", name: "Alice" };

/**
 * 测试点：
 *  1、正常显示 children
 *  2、编辑模式下显示 Form.Item
 *  3、调用 onCellSave 保存
 */
describe("test EditableCell", () => {
  const mockOnCellSave = vi.fn((_rowId, _cellKey, cellValue) => cellValue);
  const mockForm = {
    getFielvalue: vi.fn(() => "newCellValue"),
    setFieldValue: vi.fn(),
  };

  it("render children when not editing", () => {
    render(
      <FormContext.Provider value={mockForm as unknown as FormInstance<IHuman>}>
        <EditableCell<IHuman, "id">
          isEditing={false}
          cellKey="name"
          rowIdName="id"
          record={alice}
          onCellSave={mockOnCellSave}
        >
          {alice.name}
        </EditableCell>
      </FormContext.Provider>,
    );
    expect(screen.getByText(alice.name)).toBeInTheDocument();
  });
});
