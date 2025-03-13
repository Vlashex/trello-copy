import { dndStore } from "@/lib/model/columnsStore/store";
import { ColumnContainerProps } from "@/shared/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskContainer } from "./Task";
import Button from "@/features/button";

export const ColumnContainer = ({ title, id, tasks }: ColumnContainerProps) => {
  const delColumn = dndStore((state) => state.delColumn);

  const addTaskToColumn = dndStore((state) => state.addTaskToColumn);

  const {
    transform,
    transition,
    setNodeRef,
    listeners,
    attributes,
  } = useSortable({
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
      {...listeners}
      className="flex flex-col gap-4 min-h-[400px] min-w-[250px] w-[250px] bg-gray-500 text-white  overflow-hidden bg-gray-800 rounded-sm"
    >
      <div className="flex gap-4 items-center  p-2">
        <p>
          {title} {id}
        </p>
        <div className="ml-auto">
            <Button fun={delColumn} funOpts={id}>del</Button>
        </div>

      </div>
      {
        tasks?
        <div className="flex flex-grow flex-col px-2 gap-2">
          {/* <SortableContext items={tasks}>
            tasks.map((value, index) => (
              <TaskContainer
                key={index}
                id={value.id}
                content={value.content}
                  columnId={id}
              />
            ))
          </SortableContext> */}
        </div>
      :null
      }
    
      <Button fun={addTaskToColumn} funOpts={id}>New task</Button>
    </div>
  );
};