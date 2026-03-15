import type { FC } from "react";
import styles from "./index.module.scss";
import useVariableTableLogic from "./logic";
import Table from "antd/es/table";
import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";

const VariableTable: FC = () => {
  const {
    tableData,
    columns,
    selectedRowKey,
    setSelectedRowKey,
    addTableEmptyRow,
    deleteTableRow,
  } = useVariableTableLogic();
  return (
    <div className={styles.center}>
      <Table
        dataSource={tableData}
        columns={columns}
        bordered
        className={styles.table}
        pagination={false}
        rowKey={(row) => row.index}
        onRow={(record) => ({
          onClick: () => {
            // 点两下取消选中
            if (record.index === selectedRowKey) {
              setSelectedRowKey(-1);
            } else {
              setSelectedRowKey(record.index);
            }
          },
        })}
        // 高亮选中行
        rowClassName={(record) =>
          record.index === selectedRowKey ? "ant-table-row-selected" : ""
        }
      />
      <div className={styles["row-operation"]}>
        <Button onClick={addTableEmptyRow}>Add Row</Button>
        <Button onClick={deleteTableRow}>Delete Row</Button>
      </div>
      <div className={styles["custom-input"]}>
        <TextArea autoSize={{ minRows: 5, maxRows: Number.MAX_SAFE_INTEGER }} />
        <div className={styles["custom-input-buttons"]}>
          <Button>Import</Button>
          <Button>Export</Button>
        </div>
      </div>
    </div>
  );
};

export default VariableTable;
