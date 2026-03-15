import EditableRowContext from "@/context/editable-row-content";
import Form from "antd/es/form";
import { type FC } from "react";

const EditableRow: FC<{children: React.ReactNode }> = ({ children, ...props }) => {
    const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableRowContext.Provider value={form}>
        <tr {...props}>{children}</tr>
      </EditableRowContext.Provider>
    </Form>
  );
};

export default EditableRow;