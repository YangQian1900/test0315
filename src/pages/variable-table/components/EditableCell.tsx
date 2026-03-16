import { useContext, type FC } from "react";
import { Form } from "antd";
import type { HandleCellSaveFuncTyp, IFiled, RenderFormItemFuncType } from "@/interfaces/table";
import EditableRowContext from "@/context/editable-row-content";

interface EditableCellProps {
  /** 单元格是否正处于编辑中 */
  isEditing: boolean;
  children: React.ReactNode;
  cellKey: keyof IFiled;
  /** 行数据 */
  record: IFiled;
  /** 每一列自定义编辑方式 是input框还是select等等 */
  renderFormItem?: RenderFormItemFuncType;
  /** 保存该单元格修改之后的数据 */
  onCellSave: HandleCellSaveFuncTyp;
}

const EditableCell: FC<EditableCellProps> = ({
  isEditing,
  children,
  cellKey,
  record,
  renderFormItem,
  onCellSave,
  ...restProps
}) => {
  const form = useContext(EditableRowContext);

  const save = async () => {
    try {
      // 1、表格校验
      const value = await form.validateFields([cellKey]);
      // 2、保存单元格的值
      const savedValue = onCellSave(record.index,cellKey, value[cellKey]);
      form.setFieldValue(cellKey,savedValue);
    } catch (err) {
      console.log("验证失败", err);
    }
  };

  return (
    <td {...restProps}>
      {isEditing && renderFormItem ? (
        <Form.Item
          name={cellKey}
          style={{ margin: 0 }}
          initialValue={record[cellKey]}
        >
          {renderFormItem(form, record, save)}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
