// import { TaskContainerProps } from '@/shared/types';
// import { create } from 'zustand';

// export type TasksSlice = {
//     addTaskToColumn: (columnId: number) => void;
//     delTaskFromColumn: (taskId: number, columnId: number) => void;
//     moveTaskToAnotherPlace: (active: any, over: any) => void;
//     updateTask: (taskId: number, newData: Partial<TaskContainerProps>) => TaskContainerProps | null;
//     rollbackTask: (taskId: number, oldData: TaskContainerProps) => void;
//   };


// export const useTasksStore = create<TasksSlice>((set) => ({
//   tasks: [],
//   setTasks: (initVal: TaskContainerProps[]) => set({ tasks: initVal }),
  
//   delTaskFromColumn: (columnId, taskId) =>
//     set((state) => {
//       const newColumns = state.columns.slice();
//       const colIndex = newColumns.findIndex((el) => el.id === columnId);
     
//       newColumns[colIndex].tasks = newColumns[colIndex].tasks.filter(
//         (el) => el.id !== taskId
//       );

//       return { columns: newColumns };
//     }),
//   addTaskToColumn: (columnId) =>
//     set((state) => {
//       const newColumns = state.columns.slice();
//       const columnIndex = newColumns.findIndex((el) => el.id === columnId);

//       const columnTasks = newColumns[columnIndex].tasks;
//       const newTask: TaskContainerProps = {
//         id: Math.round(Math.random() * 1001),
//         content: "NewTask",
//         columnId: columnId,
//       };

//       newColumns[columnIndex].tasks = [...columnTasks, newTask];

//       return { columns: newColumns };
//     }),
  
//   moveTaskToAnotherPlace: (active, over) =>
//     set((state) => {
//       const newColumns = state.columns.slice();

//       const activeColumn = newColumns.find(
//         (el) => el.id === active.data.current.columnId
//       );

//       if (activeColumn === undefined) return state;

//       const activeTask = activeColumn.tasks.find((el) => el.id === active.id);

//       if (activeTask === undefined) return state;
      
//       if (over.data.current.type === "Column") {
//         if (over.id === active.data.current.columnId) return state


//         const overColumn = newColumns.find((el) => el.id === over.id);
//         console.log(overColumn)
//         if (overColumn === undefined) return state;

//         overColumn.tasks = [...overColumn.tasks, activeTask];
        
//         activeColumn.tasks = activeColumn.tasks.filter(el => el.id !== active.id)
        
//         const activeColumnIndex = newColumns.indexOf(activeColumn)

//         const overColumnIndex = newColumns.indexOf(overColumn);

//         newColumns[overColumnIndex] = overColumn;
//         newColumns[activeColumnIndex] = activeColumn;
//       }
      
//       if (over.data.current.type === "Task") {
//         const activeTaskIndex = activeColumn.tasks.indexOf(activeTask)

//         const overTask = activeColumn.tasks.find((el) => el.id === over.id)

//         if (overTask === undefined) return state

//         const overTaskIndex = activeColumn.tasks.indexOf(overTask)

//         activeColumn.tasks = arrayMove(activeColumn.tasks, activeTaskIndex, overTaskIndex)

//         const activeColumnIndex = newColumns.indexOf(activeColumn)

//         newColumns[activeColumnIndex] = activeColumn
//       }
      
//       return { columns: newColumns };
//     }),


//     updateTask: (taskId, newData) => {
//       const { columns } = get();

//       for (const column of columns) {
//         const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
//         if (taskIndex !== -1) {
//           const oldTask = {...column.tasks[taskIndex]};
//           column.tasks[taskIndex] = { ...oldTask, ...newData };
//           set({ columns: [...columns] });
//           return oldTask;
//         }
//       }
//       return null;
//     },

//     rollbackTask(taskId, oldData) {
//       const { columns } = get();

//       for (const column of columns) {
//         const taskIndex = column.tasks.findIndex((task) => task.id === taskId);

//         if (taskIndex !== -1) {
//           column.tasks[taskIndex] = oldData;
//           set({ columns: [...columns] });
//           break;
//         }
//       }
//     },
// }));
