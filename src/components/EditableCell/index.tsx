import { useContext } from "react";
import { Form } from "antd";
import FormContext from "@/context/form-context";
import type { HandleCellSaveFuncType, RenderFormItemFuncType } from "@/interfaces/table-common";

interface EditableCellProps<T extends object, K extends keyof T> {
  /** 单元格是否正处于编辑中 */
  isEditing: boolean;
  children: React.ReactNode;
  cellKey: keyof T;
  /** rowId对应的键名 */
  rowIdName: K;
  /** 行数据 */
  record: T;
  /** 每一列自定义编辑方式 是input框还是select等等 */
  renderFormItem?: RenderFormItemFuncType<T>;
  /** 保存该单元格修改之后的数据 */
  onCellSave: HandleCellSaveFuncType<T, K>;
}

function EditableCell<T extends object, K extends keyof T>({
  isEditing,
  children,
  cellKey,
  rowIdName,
  record,
  renderFormItem,
  onCellSave,
  ...restProps
}: EditableCellProps<T, K>) {
  const form = useContext(FormContext);

  const save = () => {
    try {
      // 1、获取单元格编辑之后的值
      const cellValue = form.getFieldValue(cellKey);
      // 2、保存单元格的值
      const savedValue = onCellSave(record[rowIdName], cellKey, cellValue);
      form.setFieldValue(cellKey, savedValue);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <td {...restProps}>
      {isEditing && renderFormItem ? (
        <Form.Item
          name={cellKey as string}
          style={{ margin: 0 }}
          initialValue={record[cellKey]}
        >
          {renderFormItem(record, save)}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}

export default EditableCell;
