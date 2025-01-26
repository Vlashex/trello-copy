import { columnStore } from "@/lib/model/columnsStore/store";
import { ColumnContainerProps } from "@/shared/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskContainer } from "./Task";

export const ColumnContainer = ({ title, id, tasks }: ColumnContainerProps) => {
  const delColumn = columnStore((state) => state.delColumn);

  const addTaskToColumn = columnStore((state) => state.addTaskToColumn);

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
        <button
          className="ml-auto hover:bg-gray-400 p-1"
          onClick={() => delColumn(id)}
        >
          del
        </button>
      </div>
      <div className="flex flex-grow flex-col px-2 gap-2">
        <SortableContext items={tasks}>
          {tasks.map((value, index) => (
            <TaskContainer
              key={index}
              id={value.id}
              content={value.content}
              columnId={id}
            />
          ))}
        </SortableContext>
      </div>
      <button className="hover:bg-gray-400" onClick={() => addTaskToColumn(id)}>
        {" "}
        New task
      </button>
    </div>
  );
};