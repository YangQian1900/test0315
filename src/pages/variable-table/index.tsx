import type { FC } from "react";
import styles from "./index.module.scss";
import useVariableTableLogic from "./logic"
import Table from "antd/es/table";
import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";

const VariableTable:FC = () => {
  const {tableData,columns} = useVariableTableLogic();
  return (
  <div className={styles.center}>
    <Table dataSource={tableData} columns={columns} bordered className={styles.table} />
    <div className={styles["row-operation"]}>
      <Button>Add Row</Button>
      <Button>Delete Row</Button>
    </div>
    <div className={styles["custom-input"]}>
        <TextArea autoSize={{ minRows: 5, maxRows: Infinity }} />
        <div className={styles["custom-input-buttons"]}>
           <Button>Import</Button>
           <Button>Export</Button>
        </div>
    </div>
  </div>
    
  );
};

export default VariableTable