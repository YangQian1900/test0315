import { useContext, type FC } from "react";
import { Form } from "antd";
import type { IFiled, RenderFormItemFuncType } from "@/interfaces/table";
import EditableRowContext from "@/context/editable-row-content";

interface EditableCellProps {
  children: React.ReactNode;
  dataIndex: keyof IFiled;
  /** 行数据 */
  record: IFiled;
  /** 每一列自定义编辑方式 是input框还是select等等 */
  renderFormItem?: RenderFormItemFuncType;
  /** 保存该单元格修改之后的数据 */
  onCellSave: (key: IFiled["index"], value: IFiled[keyof IFiled]) => void;
}

const EditableCell: FC<EditableCellProps> = ({
  children,
  dataIndex,
  record,
  renderFormItem,
  onCellSave,
  ...restProps
}) => {
  const form = useContext(EditableRowContext);

  const save = async () => {
    try {
      // 1、表格校验
      const value = await form.validateFields([dataIndex]);
      // 2、保存单元格的值
      onCellSave(record.index, value[dataIndex]);
    } catch (err) {
      console.log("验证失败", err);
    }
  };

  return (
    <td {...restProps}>
      {renderFormItem ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          initialValue={record[dataIndex]}
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