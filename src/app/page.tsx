"use client";
import { columnStore } from "@/lib/model/columnsStore/store";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";

type TaskContainerProps = {
  id: number;
  content: string;
  columnId: number;
};

const TaskContainer = ({ id, content, columnId }: TaskContainerProps) => {
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

  if (isDragging) {
    return (
      <div className="w-full h-0 border-solid border-[1px] border-red-400" />
    );
  }

  return (
    <div
      className=" bg-black rounded-sm p-1"
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <h1 className="mb-1">Task {id}</h1>
      <p className="overflow-y-visible min-h-20">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi repellat
        alias optio in natus facere voluptates eos debitis nesciunt iste
        aspernatur, autem, harum inventore ipsum culpa ut corporis qui sint?
      </p>
    </div>
  );
};
type ColumnContainerProps = {
  id: number;
  title: string;
  tasks: TaskContainerProps[];
};
const ColumnContainer = ({ title, id, tasks }: ColumnContainerProps) => {
  const delColumn = columnStore((state) => state.delColumn);

  const addTaskToColumn = columnStore((state) => state.addTaskToColumn);

  const {
    transform,
    transition,
    setNodeRef,
    listeners,
    attributes,
    overIndex,
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

  const moveTaskToAnotherPlace = columnStore(
    (state) => state.moveTaskToAnotherPlace
  );

  const [activeId, setActiveId] = useState<number | null>(null);

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

export default function Home() {
  const columns = columnStore((state) => state.columns);
  const addColumn = columnStore((state) => state.addColumn);
  const switchColumnsPlaces = columnStore((state) => state.switchColumnsPlaces);
  const moveTaskToAnotherPlace = columnStore(
    (state) => state.moveTaskToAnotherPlace
  );

  const [active, setActive] = useState<any>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <main className="flex gap-8 items-start mt-40 overflow-x-auto p-4 h-screen w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => {
          setActive(columns.find((el) => el.id === active.id) || null);
        }}
        onDragEnd={({ active, over }) =>
          over != null
            ? switchColumnsPlaces(Number(active.id), Number(over.id))
            : null
        }
        onDragOver={({ active, over }) => {
          over ? moveTaskToAnotherPlace(active, over) : null;
        }}
      >
        <SortableContext
          items={columns}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((value) => (
            <ColumnContainer
              key={value.id}
              id={value.id}
              title={value.title}
              tasks={value.tasks}
            />
          ))}
        </SortableContext>
        {active &&
          createPortal(
            <DragOverlay>
              {active.content !== undefined ? (
                <TaskContainer
                  id={active.id}
                  content={active.content}
                  columnId={active.columnId}
                />
              ) : (
                <ColumnContainer
                  id={active.id}
                  title={active.title}
                  tasks={active.tasks}
                />
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
      <div className="bg-black text-white p-2 ml-auto">
        <button onClick={() => addColumn()}>Add column</button>
      </div>
    </main>
  );
}
