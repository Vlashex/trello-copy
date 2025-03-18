import React from "react";
import { SortableContext } from "@dnd-kit/sortable";
import { ColumnContainerProps } from "@/shared/types";
import { ColumnUI } from "./ui/ColumnUI";
import Button from "@/features/button";
import { optimisticDeleteColumn } from "./api/optimisticDeleteColumn";
import TasksContainer from "../TasksListContainer";
import { optimisticAddTask } from "../Tasks/lib/optimisticAddTask";


interface ColumnCompositionProps extends ColumnContainerProps {
  style: React.CSSProperties;
  setNodeRef: (node: HTMLElement | null) => void;
  listeners: any; // уточните тип, если возможно
  attributes: any;
}


export const ColumnComposition = ({
  title,
  id,
  tasks,
  style,
  setNodeRef,
  listeners,
  attributes,
}: ColumnCompositionProps) => {
  return (
    <ColumnUI style={style} setNodeRef={setNodeRef} attributes={attributes}>
      {/* Заголовок колонки с кнопкой удаления */}
      <div className="flex gap-4 items-center p-2" {...listeners}>
        <p>{title} {id}</p>
        <div className="ml-auto">
          <Button fun={optimisticDeleteColumn} funOpts={id}>
            del
          </Button>
        </div>
      </div>

      {/* Область с задачами */}
      {tasks && tasks.length > 0 ? (
        <div className="flex flex-grow flex-col gap-2 max-h-[500px] overflow-y-auto custom-scrollbar">
          <SortableContext items={tasks}>
            <TasksContainer columnId={id} tasks={tasks} />
          </SortableContext>
        </div>
      ) : null}

      {/* Футер с кнопкой добавления новой задачи */}
      <Button fun={optimisticAddTask} funOpts={id}>
        New task
      </Button>
    </ColumnUI>
  );
};
