import React from "react";
import { SortableContext } from "@dnd-kit/sortable";
import { ColumnContainerProps } from "@/shared/types";
import { ColumnUI } from "./ui/ColumnUI";
import Button from "@/features/button";
import { optimisticDeleteColumn } from "./api/optimisticDeleteColumn";
import TasksContainer from "../TasksListContainer";
import { optimisticAddTask } from "../Task/lib/optimisticAddTask";

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
      {/* Column Header */}
      <div className="mb-4 flex items-center justify-between" {...listeners}>
        <h3 className="font-semibold text-gray-300">
          {title} {id}
        </h3>
        <div className="ml-auto">
          <Button fun={optimisticDeleteColumn} funOpts={id}>
            <span className="text-gray-400 hover:text-gray-200">•••</span>
          </Button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 min-h-0">
        {tasks && tasks.length > 0 ? (
          <div
            className="space-y-3 overflow-y-auto min-h-0 h-full
                  [&::-webkit-scrollbar]:w-1
                  [&::-webkit-scrollbar-track]:bg-transparent 
                  [&::-webkit-scrollbar-thumb]:bg-transparent 
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  hover:[&::-webkit-scrollbar-thumb]:bg-gray-600
                  hover:[&::-webkit-scrollbar-track]:bg-gray-800
                  focus:[&::-webkit-scrollbar-thumb]:bg-gray-600
                  focus:[&::-webkit-scrollbar-track]:bg-gray-800
                  active:[&::-webkit-scrollbar-thumb]:bg-gray-600
                  active:[&::-webkit-scrollbar-track]:bg-gray-800"
          >
            <SortableContext items={tasks}>
              <TasksContainer columnId={id} tasks={tasks} />
            </SortableContext>
          </div>
        ) : null}
      </div>

      {/* Add Card Button */}
      <Button
        fun={optimisticAddTask}
        funOpts={id}
        className="mt-4 flex w-full items-center rounded-lg bg-gray-700 px-4 py-2 text-gray-300 transition-all hover:bg-gray-600"
      >
        New task
      </Button>
    </ColumnUI>
  );
};
