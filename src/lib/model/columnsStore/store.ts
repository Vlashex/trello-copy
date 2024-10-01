import { Active, Over } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";

type TaskContainerProps = {
  id: number;
  content: string;
  columnId: number;
};

type ColumnContainerProps = {
  id: number;
  title: string;
  tasks: TaskContainerProps[];
};

type ColumnsStore = {
  columns: ColumnContainerProps[] | [];
  delColumn: (columnId: string | number) => void;
  delTaskFromColumn: (taskId: number, columnId: number) => void;
  addColumn: () => void;

  addTaskToColumn: (columnId: number) => void;
  switchColumnsPlaces: (activeId: number, overId: number) => void;
  moveTaskToAnotherPlace: (active: any, over: any) => void;
};

const columnStore = create<ColumnsStore>((set) => ({
  columns: [],
  addColumn: () =>
    set((state) => {
      const newColumn: ColumnContainerProps = {
        id: Math.round(Math.random() * 1001),
        title: "New Column",
        tasks: [],
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
      const tastIndex = newColumns[colIndex].tasks.findIndex(
        (el) => el.id === taskId
      );
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
      };

      newColumns[columnIndex].tasks = [...columnTasks, newTask];

      return { columns: newColumns };
    }),
  switchColumnsPlaces: (activeId, overId) =>
    set((state) => {
      const oldColumns = state.columns.slice();
      const oldIndex = oldColumns.findIndex((el) => el.id === activeId);
      const newIndex = oldColumns.findIndex((el) => el.id === overId);

      return { columns: arrayMove(oldColumns, oldIndex, newIndex) };
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
        console.log(overColumn)
        activeColumn.tasks = activeColumn.tasks.filter(el => el.id !== active.id)
        console.log(activeColumn)
        const activeColumnIndex = newColumns.indexOf(activeColumn)

        const overColumnIndex = newColumns.indexOf(overColumn);

        newColumns[overColumnIndex] = overColumn;
        newColumns[activeColumnIndex] = activeColumn
        console.log(newColumns)
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
}));

export { columnStore };
