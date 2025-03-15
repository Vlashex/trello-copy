import { dndStore } from "@/lib/model/columnsStore/store";
import { ColumnContainerProps } from "@/shared/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskContainer } from "./Task";
import Button from "@/features/button";
import { optimisticAddTask } from "@/features/tasks/lib/optimisticAddTask";
import { optimisticDeleteColumn } from "@/features/columns/lib/optimisticDeleteColumn";

export const ColumnContainer = ({ title, id, tasks }: ColumnContainerProps) => {

  const { transform, transition, setNodeRef, listeners, attributes } =
    useSortable({
      id: id,
      data: {
        type: "Column",
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      className="flex flex-col gap-4 min-h-[400px] px-3 min-w-[250px] w-[250px] bg-gray-500 text-white  overflow-hidden bg-gray-800 rounded-sm"
    >
      <div className="flex gap-4 items-center  p-2"
      {...listeners}
      >
        <p>
          {title} {id}
        </p>
        <div className="ml-auto">
          <Button fun={optimisticDeleteColumn} funOpts={id}>
            del
          </Button>
        </div>
      </div>
      {tasks && tasks.length > 0 ? (
        <div className="
        flex 
        flex-grow 
        flex-col 
        gap-2 
        max-h-[500px] 
        overflow-y-auto
        custom-scrollbar
        "
        >
          <SortableContext items={tasks}>
            {tasks.sort((a,b) => b.position - a.position).map((value, index) => (
              <TaskContainer
                key={index}
                id={value.id}
                content={value.content}
                columnId={id}
                position={value.position}
              />
            ))}
          </SortableContext>
        </div>
      ) : null}

      <Button fun={optimisticAddTask} funOpts={id}>
        New task
      </Button>
    </div>
  );
};
