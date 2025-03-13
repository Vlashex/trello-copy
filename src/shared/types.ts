export type TaskContainerProps = {
  id: number;
  content: string;
  columnId: number;
  index: number
};

export type ColumnContainerProps = {
  id: number;
  title: string;
  tasks: TaskContainerProps[];
  index: number
};