import { ColumnContainerProps, TaskContainerProps } from "@/shared/types";
import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";


type ColumnsStore = {
  columns: ColumnContainerProps[] | [];
  setColumns: (initVal: ColumnContainerProps[]) => void;

  delColumn: (columnId: string | number) => void;
  delTaskFromColumn: (taskId: number, columnId: number) => void;
  addColumn: () => void;

  addTaskToColumn: (columnId: number) => void;
  switchColumnsPlaces: (activeId: number, overId: number) => void;
  moveTaskToAnotherPlace: (active: any, over: any) => void;


  updateTask: (taskId: number, newData: Partial<TaskContainerProps>) => TaskContainerProps | null;
  rollbackTask: (taskId: number, oldData: TaskContainerProps) => void;
};

const dndStore = create<ColumnsStore>((set, get) => ({
  columns: [],
  setColumns: (initVal : ColumnContainerProps[]) => 
    set((state) => { return {columns: initVal}}),



  addColumn: () =>
    set((state) => {
      const newColumn: ColumnContainerProps = {
        id: Math.round(Math.random() * 1001),
        title: "New Column",
        tasks: [],
        index: Math.round(Math.random() * 1001),
      };

      return { columns: [...state.columns, newColumn] };
    }),
  delColumn: (id) =>
    set((state) => {
      const columnsWithoutOne = state.columns
        .slice()
        .filter((el) => el.id !== id);

      return { columns: columnsWithoutOne };
    }),
  delTaskFromColumn: (columnId, taskId) =>
    set((state) => {
      const newColumns = state.columns.slice();
      const colIndex = newColumns.findIndex((el) => el.id === columnId);
     
      newColumns[colIndex].tasks = newColumns[colIndex].tasks.filter(
        (el) => el.id !== taskId
      );

      return { columns: newColumns };
    }),
  addTaskToColumn: (columnId) =>
    set((state) => {
      const newColumns = state.columns.slice();
      const columnIndex = newColumns.findIndex((el) => el.id === columnId);

      const columnTasks = newColumns[columnIndex].tasks;
      const newTask: TaskContainerProps = {
        id: Math.round(Math.random() * 1001),
        content: "NewTask",
        columnId: columnId,
        index: Math.round(Math.random() * 1001),
      };

      newColumns[columnIndex].tasks = [...columnTasks, newTask];

      return { columns: newColumns };
    }),
  switchColumnsPlaces: (activeId, overId) =>
    set((state) => {
      const columns = state.columns.slice();
      const firstIndex = columns.findIndex((el) => el.id === activeId);
      const secondIndex = columns.findIndex((el) => el.id === overId);

      const temp = columns[firstIndex].index;
      columns[firstIndex].index = columns[secondIndex].index;
      columns[secondIndex].index = temp;


      return { columns: columns.slice().sort((a,b)=>a.index - b.index) };
    }),
  moveTaskToAnotherPlace: (active, over) =>
    set((state) => {
      const newColumns = state.columns.slice();

      const activeColumn = newColumns.find(
        (el) => el.id === active.data.current.columnId
      );

      if (activeColumn === undefined) return state;

      const activeTask = activeColumn.tasks.find((el) => el.id === active.id);

      if (activeTask === undefined) return state;
      
      if (over.data.current.type === "Column") {
        if (over.id === active.data.current.columnId) return state


        const overColumn = newColumns.find((el) => el.id === over.id);
        console.log(overColumn)
        if (overColumn === undefined) return state;

        overColumn.tasks = [...overColumn.tasks, activeTask];
        
        activeColumn.tasks = activeColumn.tasks.filter(el => el.id !== active.id)
        
        const activeColumnIndex = newColumns.indexOf(activeColumn)

        const overColumnIndex = newColumns.indexOf(overColumn);

        newColumns[overColumnIndex] = overColumn;
        newColumns[activeColumnIndex] = activeColumn;
      }
      
      if (over.data.current.type === "Task") {
        const activeTaskIndex = activeColumn.tasks.indexOf(activeTask)

        const overTask = activeColumn.tasks.find((el) => el.id === over.id)

        if (overTask === undefined) return state

        const overTaskIndex = activeColumn.tasks.indexOf(overTask)

        activeColumn.tasks = arrayMove(activeColumn.tasks, activeTaskIndex, overTaskIndex)

        const activeColumnIndex = newColumns.indexOf(activeColumn)

        newColumns[activeColumnIndex] = activeColumn
      }
      
      return { columns: newColumns };
    }),


    updateTask: (taskId, newData) => {
      const { columns } = get();

      for (const column of columns) {
        const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          const oldTask = {...column.tasks[taskIndex]};
          column.tasks[taskIndex] = { ...oldTask, ...newData };
          set({ columns: [...columns] });
          return oldTask;
        }
      }
      return null;
    },

    rollbackTask(taskId, oldData) {
      const { columns } = get();

      for (const column of columns) {
        const taskIndex = column.tasks.findIndex((task) => task.id === taskId);

        if (taskIndex !== -1) {
          column.tasks[taskIndex] = oldData;
          set({ columns: [...columns] });
          break;
        }
      }
    },
}));

export { dndStore };








// import { create } from 'zustand';
// import { arrayMove } from '@dnd-kit/sortable';
// import { ColumnContainerProps, TaskContainerProps } from '@/shared/types';

// export interface ColumnsSlice {
//   columns: ColumnContainerProps[];
//   setColumns: (columns: ColumnContainerProps[]) => void;
//   addColumn: () => void;
//   delColumn: (id: number) => void;
//   switchColumnsPlaces: (activeId: number, overId: number) => void;
// }

// export interface TasksSlice {
//   addTaskToColumn: (columnId: number) => void;
//   delTaskFromColumn: (columnId: number, taskId: number) => void;
//   moveTaskToAnotherPlace: (active: any, over: any) => void;
//   updateTask: (taskId: number, newData: Partial<TaskContainerProps>) => TaskContainerProps | null;
//   rollbackTask: (taskId: number, oldData: TaskContainerProps) => void;
// }

// export type StoreState = ColumnsSlice & TasksSlice;


// /* Создаём слайс для работы с колонками */
// const createColumnsSlice = (set, get):ColumnsSlice => ({
//   columns: [],
//   setColumns: (initVal) => set({ columns: initVal }),
//   addColumn: () =>
//     set((state) => {
//       const newColumn = {
//         id: Math.round(Math.random() * 1001),
//         title: 'New Column',
//         tasks: [],
//       };
//       return { columns: [...state.columns, newColumn] };
//     }),
//   delColumn: (id) =>
//     set((state) => ({
//       columns: state.columns.filter((col) => col.id !== id),
//     })),
//   switchColumnsPlaces: (activeId, overId) =>
//     set((state) => {
//       const oldColumns = state.columns.slice();
//       const oldIndex = oldColumns.findIndex((el) => el.id === activeId);
//       const newIndex = oldColumns.findIndex((el) => el.id === overId);
//       return { columns: arrayMove(oldColumns, oldIndex, newIndex) };
//     }),
//   // Можно добавить и другие методы для работы с колонками
// });

// /* Создаём слайс для работы с задачами */
// const createTasksSlice = (set, get):TasksSlice => ({
//   addTaskToColumn: (columnId) =>
//     set((state) => {
//       const newColumns = state.columns.slice();
//       const columnIndex = newColumns.findIndex((el) => el.id === columnId);
//       if (columnIndex === -1) return {};
//       const columnTasks = newColumns[columnIndex].tasks;
//       const newTask = {
//         id: Math.round(Math.random() * 1001),
//         content: 'NewTask',
//         columnId: columnId,
//       };
//       newColumns[columnIndex].tasks = [...columnTasks, newTask];
//       return { columns: newColumns };
//     }),
//   delTaskFromColumn: (columnId, taskId) =>
//     set((state) => {
//       const newColumns = state.columns.slice();
//       const colIndex = newColumns.findIndex((col) => col.id === columnId);
//       if (colIndex === -1) return {};
//       newColumns[colIndex].tasks = newColumns[colIndex].tasks.filter(
//         (task) => task.id !== taskId
//       );
//       return { columns: newColumns };
//     }),
//   moveTaskToAnotherPlace: (active, over) =>
//     set((state) => {
//       const newColumns = state.columns.slice();
//       const activeColumn = newColumns.find(
//         (col) => col.id === active.data.current.columnId
//       );
//       if (!activeColumn) return state;
//       const activeTask = activeColumn.tasks.find((t) => t.id === active.id);
//       if (!activeTask) return state;
      
//       if (over.data.current.type === 'Column') {
//         if (over.id === active.data.current.columnId) return state;
//         const overColumn = newColumns.find((col) => col.id === over.id);
//         if (!overColumn) return state;
//         overColumn.tasks = [...overColumn.tasks, activeTask];
//         activeColumn.tasks = activeColumn.tasks.filter(t => t.id !== active.id);
//       }
      
//       if (over.data.current.type === 'Task') {
//         const activeTaskIndex = activeColumn.tasks.indexOf(activeTask);
//         const overTask = activeColumn.tasks.find((t) => t.id === over.id);
//         if (!overTask) return state;
//         const overTaskIndex = activeColumn.tasks.indexOf(overTask);
//         activeColumn.tasks = arrayMove(activeColumn.tasks, activeTaskIndex, overTaskIndex);
//       }
      
//       return { columns: newColumns };
//     }),
//   updateTask: (taskId, newData) => {
//     const { columns } = get();
//     for (const column of columns) {
//       const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
//       if (taskIndex !== -1) {
//         const oldTask = { ...column.tasks[taskIndex] };
//         column.tasks[taskIndex] = { ...oldTask, ...newData };
//         set({ columns: [...columns] });
//         return oldTask;
//       }
//     }
//     return null;
//   },
//   rollbackTask: (taskId, oldData) =>
//     set((state) => {
//       const newColumns = state.columns.map((col) => ({
//         ...col,
//         tasks: col.tasks.map((task) =>
//           task.id === taskId ? oldData : task
//         ),
//       }));
//       return { columns: newColumns };
//     }),
// });

// /* Объединяем слайсы в один глобальный store */
// const useStore = create<StoreState>((set, get): => ({
//   ...createColumnsSlice(set, get),
//   ...createTasksSlice(set, get),
// }));

// export { useStore };
