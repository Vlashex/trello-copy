import React from "react";
import { TaskContainerProps } from "@/shared/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskUI from "./ui/TaskUI";

export function TaskContainer ({ id, content, columnId }: TaskContainerProps) {
  const {
    transform,
    transition,
    setNodeRef,
    listeners,
    attributes,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "Task",
      columnId: columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={"bg-black rounded-sm p-1" + (isDragging?"border-solid border-[1px] border-red-400 z-50":"")} 
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <TaskUI
        id={id} 
        content={content}
      />
    </div>
  );
};