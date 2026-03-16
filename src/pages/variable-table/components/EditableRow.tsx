import EditableRowContext from "@/context/editable-row-content";
import Form from "antd/es/form";
import { useEffect } from "react";

const EditableRow = <T extends object>({
  record,
  children,
  ...props
}: {
  record: T;
  children: React.ReactNode;
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // 数据变化时同步 Form
    form.setFieldsValue(record);
  }, [record, form]);

  return (
    <Form form={form} component={false}>
      <EditableRowContext.Provider value={form}>
        <tr {...props}>{children}</tr>
      </EditableRowContext.Provider>
    </Form>
  );
};

export default EditableRow;
