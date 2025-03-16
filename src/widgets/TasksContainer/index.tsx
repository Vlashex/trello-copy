"use server";

import { TaskContainerProps } from "@/shared/types";
import { Task } from "../Task";

type TasksContainerProps = {
  columnId: number
  tasks: TaskContainerProps[]
}

export default async function TasksContainer({ columnId, tasks }: TasksContainerProps) {
  return (
    <>
      {tasks
        .sort((a, b) => b.position - a.position)
        .map((value, index) => (
          <Task
            key={index}
            id={value.id}
            content={value.content}
            columnId={columnId}
            position={value.position}
          />
        ))}
    </>
  );
}
