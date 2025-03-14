export type TaskContainerProps = {
  id: number;
  content: string;
  columnId: number;
  position: number
};

export type ColumnContainerProps = {
  id: number;
  title: string;
  tasks: TaskContainerProps[];
  position: number
};