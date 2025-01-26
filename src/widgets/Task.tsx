import { TaskContainerProps } from "@/shared/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const TaskContainer = ({ id, content, columnId }: TaskContainerProps) => {
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
      <h1 className="mb-1">Task {id}</h1>
      <p className="overflow-y-visible min-h-20">
        {content}
      </p>
    </div>
  );
};