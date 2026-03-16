import { useDispatch, useSelector } from "react-redux";
import { columns } from "./table";
import type { AppDispatch, RootState } from "@/store";
import { addRow, deleteRow, updateRow, setTable } from "@/store/table-slice";
import { useState } from "react";
import type {
  HandleCellSaveFuncTyp,
  ICusCellRenderColumnType,
  IFiled,
} from "@/interfaces/table";
import { message } from "antd";

const useVariableTableLogic = () => {
  const tableData = useSelector((state: RootState) => state.table.data);
  const dispatch = useDispatch<AppDispatch>();
  /** 当前选中行的key */
  const [selectedRowKey, setSelectedRowKey] = useState(-1);
  /** 当前正在编辑的单元格key */
  const [editingCellKey, setEditingCellKey] = useState<"" | keyof IFiled>();
  const mergedColumns: ICusCellRenderColumnType[] = columns.map((col) => {
    return {
      ...col,
      onCell: (record) => ({
        onClick: () => {
          setEditingCellKey(col.dataIndex);
        },
        isEditing: col.dataIndex === editingCellKey,
        cellKey: col.dataIndex,
        record,
        renderFormItem: col.renderFormItem,
        onCellSave: handleCellSavePlus[col.dataIndex] || handleCellSave,
      }),
    };
  });

  /** 新增一空白行 */
  const addTableEmptyRow = () => {
    dispatch(
      addRow({
        index: -1,
      }),
    );
  };

  /** 删除一行 */
  const deleteTableRow = () => {
    dispatch(deleteRow(selectedRowKey));
  };

  /** 更新单元格数据-公用 */
  const handleCellSave: HandleCellSaveFuncTyp = (rowKey, cellKey, value) => {
    dispatch(
      updateRow({
        // rowKey从1开始算的
        ...tableData[rowKey - 1],
        [cellKey]: value,
      }),
    );
    // 当前没有编辑单元格
    setEditingCellKey("");
    return value;
  };

  /** 保存姓名 */
  const handleNameCellSave: HandleCellSaveFuncTyp = (
    rowKey,
    cellKey,
    value,
  ) => {
    //1、如果value为空 则提示姓名不能为空 且重置回原来的值
    if (!value || !value.toString().trim()) {
      message.error("Name can't be empty");
      setEditingCellKey("");
      return tableData.find((item) => item.index === rowKey)?.[cellKey];
    }
    const valueTrimed = value.toString().trim();
    // 2、value重复 则提示姓名重复
    const matched = tableData.find(
      (item) =>
        item.name?.toLocaleUpperCase() === valueTrimed.toLocaleUpperCase(),
    );
    if (matched?.index !== undefined && matched.index !== rowKey) {
      message.error("Name has existed, please input another name");
      return valueTrimed;
    } else {
      // 3、检查没有问题 保存
      return handleCellSave(rowKey, cellKey, valueTrimed);
    }
  };

  const handleCellSavePlus: { [props: string]: HandleCellSaveFuncTyp } = {
    name: handleNameCellSave,
  };

  return {
    mergedColumns,
    tableData,
    selectedRowKey,
    setSelectedRowKey,
    addTableEmptyRow,
    deleteTableRow,
  };
};

export default useVariableTableLogic;
