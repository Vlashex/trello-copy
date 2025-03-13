// import { ColumnContainerProps } from "@/shared/types";
// import { arrayMove } from "@dnd-kit/sortable";
// import { create } from "zustand";

// export type ColumnsSlice = {
//   columns: ColumnContainerProps[];
//   setColumns: (initVal: ColumnContainerProps[]) => void;
//   addColumn: () => void;
//   delColumn: (columnId: number | string) => void;
//   switchColumnsPlaces: (activeId: number, overId: number) => void;
// };

// export const columnsSlice = create<ColumnsSlice>((set) => ({
//   columns: [],
//   setColumns: (initVal: ColumnContainerProps[]) => set({ columns: initVal }),

//   addColumn: () =>
//     set((state) => {
//       const newColumn: ColumnContainerProps = {
//         id: Math.round(Math.random() * 1001),
//         title: "New Column",
//         tasks: [],
//       };

//       return { columns: [...state.columns, newColumn] };
//     }),
//   delColumn: (id) =>
//     set((state) => {
//       const columnsWithoutOne = state.columns
//         .slice()
//         .filter((el) => el.id !== id);

//       return { columns: columnsWithoutOne };
//     }),
//   switchColumnsPlaces: (activeId, overId) =>
//     set((state) => {
//       const oldColumns = state.columns.slice();
//       const oldIndex = oldColumns.findIndex((el) => el.id === activeId);
//       const newIndex = oldColumns.findIndex((el) => el.id === overId);

//       return { columns: arrayMove(oldColumns, oldIndex, newIndex) };
//     }),
// }));
