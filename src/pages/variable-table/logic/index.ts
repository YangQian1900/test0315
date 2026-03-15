import { getColumns } from "./table";

const useVariableTableLogic = () => {
    const columns = getColumns();
    return { columns };
};

export default useVariableTableLogic;