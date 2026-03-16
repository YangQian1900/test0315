import { useDispatch, useSelector } from "react-redux";
import { columns, DefaultValueMap } from "./table";
import type { AppDispatch, RootState } from "@/store";
import { addRow, deleteRow, updateRow, setTable } from "@/store/table-slice";
import { useState } from "react";
import type {
  HandleCellSaveFuncTyp,
  ICusCellRenderColumnType,
  IFiled,
} from "@/interfaces/table";
import { message } from "antd";
import { checkDataTypeRelatedInfo, convertDataToText, convertTextToData } from "./import-helper";

const useVariableTableLogic = () => {
  const tableData = useSelector((state: RootState) => state.table.data);
  const dispatch = useDispatch<AppDispatch>();
  /** 导入的多行文本 */
  const [multiText, setMultiText] = useState("");
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
        name: "",
        dataType: "",
        defaultValue: "",
        comment: "",
      }),
    );
  };

  /** 删除一行 */
  const deleteTableRow = () => {
    dispatch(deleteRow(selectedRowKey));
  };

  const findRowData = (rowId: number) => {
    const tableIndex = rowId - 1;
    return tableIndex >= 0 && tableIndex < tableData.length
      ? tableData[rowId - 1]
      : null;
  };

  /** 保存单元格数据-公用 */
  const saveCell: HandleCellSaveFuncTyp = (rowId, cellKey, cellVaue) => {
    dispatch(
      updateRow({
        // rowKey从1开始算的
        index: findRowData(rowId)?.index || -1,
        [cellKey]: cellVaue,
      }),
    );
    return cellVaue;
  };

  /** 更新单元格数据-公用 */
  const handleCellSave: HandleCellSaveFuncTyp = (rowId, cellKey, cellValue) => {
    saveCell(rowId, cellKey, cellValue);
    // 当前没有编辑单元格
    setEditingCellKey("");
    return cellValue;
  };

  /** 保存姓名 */
  const handleNameCellSave: HandleCellSaveFuncTyp = (
    rowId,
    cellKey,
    cellValue,
  ) => {
    const valueTrimed = cellValue?.toString().trim();
    const oldValue = findRowData(rowId)?.[cellKey];
    //1、如果value为空 则提示姓名不能为空 且重置回原来的值
    if (!valueTrimed) {
      message.error("Name can't be empty");
      setEditingCellKey("");
      return oldValue;
    }
    // 2、value重复 则提示姓名重复
    const matched = tableData.find(
      (item) =>
        item.name?.toLocaleUpperCase() === valueTrimed.toLocaleUpperCase(),
    );
    if (matched?.index !== undefined && matched.index !== rowId) {
      message.error("Name has existed, please input another name");
      return oldValue;
    } else {
      // 3、检查没有问题 保存
      return handleCellSave(rowId, cellKey, valueTrimed);
    }
  };

  /** 保存数据类型 */
  const handleDataTypeCellSave: HandleCellSaveFuncTyp = (
    rowId,
    cellKey,
    cellValue,
  ) => {
    const valueUpper = cellValue?.toString().toLocaleUpperCase();
    const oldValue = findRowData(rowId)?.[cellKey];
    //1、下拉框value不会为空 还是做一下判断
    if (!valueUpper) {
      message.error("Data Type can't be empty");
      setEditingCellKey("");
      return oldValue;
    }
    // 2、类型改变的话 默认值需要改变
    if (oldValue !== valueUpper) {
      saveCell(rowId, "defaultValue", DefaultValueMap[valueUpper]);
    }

    // 3、保存新值
    return handleCellSave(rowId, cellKey, valueUpper);
  };

  /** 保存默认值 */
  const handleDefaultValueCellSave: HandleCellSaveFuncTyp = (
    rowId,
    cellKey,
    cellValue,
  ) => {
    const valueTrimed = cellValue?.toString().trim();
    const matchedRow = findRowData(rowId);
    if (!matchedRow) return;
    const oldValue = matchedRow?.[cellKey];
    // 1、默认值为空
    if (!valueTrimed) {
      handleCellSave(rowId, cellKey, valueTrimed);
      setEditingCellKey("");
      return "";
    }
    // 2、输入默认值前必须类型不能为空
    if (!matchedRow.dataType) {
      message.error("Please input data type first");
      setEditingCellKey("");
      return oldValue;
    }
    try {
      // 3、检查默认值是否合法
      checkDataTypeRelatedInfo(matchedRow.dataType, valueTrimed);

      // 4、保存
      handleCellSave(rowId, cellKey, valueTrimed?.toLocaleUpperCase());
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

  const handleCellSavePlus: { [props: string]: HandleCellSaveFuncTyp } = {
    name: handleNameCellSave,
    dataType: handleDataTypeCellSave,
    defaultValue: handleDefaultValueCellSave,
  };

  /** 导入文本 */
  const importText = () => {
    let variArr: IFiled[] | undefined;
    try {
      variArr = convertTextToData(multiText);
    } catch (e: unknown) {
      if (e instanceof Error) {
        message.error(e.message);
      }
    }
    if (variArr?.length) {
      dispatch(setTable(variArr));
    }
  };

  const exportText = ()=>{
    try{
      const str = convertDataToText(tableData);
      setMultiText(str);
    }catch (e: unknown) {
      if (e instanceof Error) {
        message.error(e.message);
      }
    }
  }

  return {
    mergedColumns,
    tableData,
    selectedRowKey,
    setSelectedRowKey,
    multiText,
    setMultiText,
    importText,
    exportText,
    addTableEmptyRow,
    deleteTableRow,
  };
};

export default useVariableTableLogic;
