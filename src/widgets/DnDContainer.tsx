"use client"
import { columnStore } from "@/lib/model/columnsStore/store";
import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import { ColumnContainer } from "./Column";
import { createPortal } from "react-dom";
import { TaskContainer } from "./Task";

export default function () {
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
        onDragStart={({ active }) => {
          setActive(columns.find((el) => el.id === active.id) || null);
        }}
        onDragEnd={({ active, over }) =>
          active?.data.current?.type === 'Column' && over
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
