import type { FC } from "react";
import styles from "./index.module.scss";
import useVariableTableLogic from "./logic";
import Table from "antd/es/table";
import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import EditableRow from "@/components/EditableRow";
import EditableCell from "@/components/EditableCell";

const VariableTable: FC = () => {
  const {
    tableRef,
    tableData,
    mergedColumns,
    editingRowId,
    setEditingRowId,
    multiText,
    setMultiText,
    importText,
    exportText,
    addTableEmptyRow,
    deleteTableRow,
  } = useVariableTableLogic();
  const tableComponents = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  return (
    <div className={styles.center}>
      <div className={styles.table} ref={tableRef}>
        <Table
          dataSource={tableData}
          columns={mergedColumns}
          components={tableComponents}
          bordered
          pagination={false}
          rowKey={(row) => row.index}
          onRow={(record) => ({
            onClick: () => {
              setEditingRowId(record.index);
            },
            record,
          })}
          // 高亮选中行
          rowClassName={(record) =>
            record.index === editingRowId ? "ant-table-row-selected" : ""
          }
          scroll={{ y: 250, x: 900 }}
          data-testid="variableTb"
        />
      </div>
      <div className={styles["row-operation"]}>
        <Button onClick={addTableEmptyRow} data-testid="btnAdd">
          Add Row
        </Button>
        <Button onClick={deleteTableRow} data-testid="btnDelete">
          Delete Row
        </Button>
      </div>
      <div className={styles["custom-input"]}>
        <TextArea
          autoSize={{ minRows: 5, maxRows: 5 }}
          value={multiText}
          onChange={(event) => {
            setMultiText(event.target.value);
          }}
          style={{ overflowY: "auto" }}
          data-testid="textForIO"
        />
        <div className={styles["custom-input-buttons"]}>
          <Button onClick={importText} data-testid="btnImport">
            Import
          </Button>
          <Button onClick={exportText} data-testid="btnExport">
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VariableTable;
