import React from "react";
import { TaskContainerProps } from "@/shared/types";
import { TaskContainer } from "@/widgets/Tasks";

type TasksContainerProps = {
  columnId: number
  tasks: TaskContainerProps[]
}

export function TasksListContainer({ columnId, tasks }: TasksContainerProps) {
  
  if (!tasks) return <></>;
  
  return (
    <>
      {tasks
        .sort((a, b) => b.position - a.position)
        .map((value, index) => (
          <TaskContainer
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
