
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ColumnComposition } from "../ColumnComposition";
import { ColumnContainerProps } from "@/shared/types";

export const ColumnContainer = ({ title, id, tasks, position }: ColumnContainerProps) => {
  const { transform, transition, setNodeRef, listeners, attributes } =
    useSortable({
      id: id,
      data: { type: "Column" },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ColumnComposition
      title={title}
      id={id}
      tasks={tasks}
      style={style}
      setNodeRef={setNodeRef}
      listeners={listeners}
      attributes={attributes}
      position={position}
    />
  );
};
