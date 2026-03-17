import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormContext from "@/context/form-context";
import Form from "antd/es/form";
import "@testing-library/jest-dom";
import { useContext } from "react";
import EditableRow from ".";

const alice = { id: "shenfenzheng01", name: "Alice" };
const alice2 = { id: "shenfenzheng01", name: "Alice2" };

/**
 * 测试要点：
 *  1、formcontext被传到了子组件
 *  2、record变化时 setFieldsValue被调用了
 */
describe("test EditableRow", () => {
  it("child get context", () => {
    const Child = () => {
      const formInstance = useContext(FormContext);
      return <div data-testid="childDv">{formInstance ? "1" : "0"}</div>;
    };
    render(
      <EditableRow record={alice}>
        <Child />
      </EditableRow>,
    );
    expect(screen.getByTestId("childDv")).toHaveTextContent("1");
  });

  it("when data changes, form get updated", () => {
    const Child = () => {
      return (
        <td>
          <Form.Item name="name">
            <input data-testid="input" />
          </Form.Item>
        </td>
      );
    };
    const { rerender } = render(
      <EditableRow record={alice}>
        <Child />
      </EditableRow>,
    );
    rerender(
      <EditableRow record={alice2}>
        <Child />
      </EditableRow>,
    );

    const input = screen.getByTestId("input") as HTMLInputElement;
    expect(input.value).toBe(alice2.name);
  });
});
