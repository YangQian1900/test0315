import type { IFiled } from "@/interfaces/table";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ITableState {
  data: IFiled[];
}

const initialState: ITableState = {
  data: [
    // {
    //   index: 1,
    //   name: "Variable 1",
    //   dataType: "BOOL",
    //   defaultValue: "TRUE",
    //   comment: "This is a comment",
    // },
  ],
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    addRow: (state, action: PayloadAction<IFiled>) => {
      state.data.push({
        ...action.payload,
        // index从1开始自增
        index: state.data.length + 1,
      });
    },
    deleteRow: (state, action: PayloadAction<number>) => {
      state.data = state.data
        .filter((item) => item.index !== action.payload)
        .map((item, index) => {
          return {
            ...item,
            index: index + 1,
          };
        });
    },
    /** 可以只更新一个或者多个属性 */
    updateRow: (
      state,
      action: PayloadAction<Partial<IFiled> & { index: number }>,
    ) => {
      const index = state.data.findIndex(
        (item) => item.index === action.payload.index,
      );
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...action.payload,
        };
      }
    },
    setTable: (state, action: PayloadAction<IFiled[]>) => {
      state.data = action.payload;
    },
  },
});

export const { addRow, deleteRow, updateRow, setTable } = tableSlice.actions;
export default tableSlice.reducer;
