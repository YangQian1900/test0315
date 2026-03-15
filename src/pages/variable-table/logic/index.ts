import { useSelector } from "react-redux";
import { getColumns } from "./table";
import type { RootState } from "@/store";

const useVariableTableLogic = () => {
    const tableData = useSelector((state:RootState)=>state.table.data)
    const columns = getColumns();
    return { columns, tableData };
};

export default useVariableTableLogic;