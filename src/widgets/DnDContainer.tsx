"use client";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ColumnContainer } from "./Column";
import { createPortal } from "react-dom";
import { TaskContainer } from "./Task";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ColumnContainerProps } from "@/shared/types";
import { addColumn } from "@/api/addColumnAction";
import useSWR from "swr";
import { dndStore } from "@/lib/model/columnsStore/store";
import { optimisticUpdateColumn } from "@/features/columns/lib/optimisticUpdateColumns";
import { optimisticAddColumn } from "@/features/columns/lib/optimisticAddColumn";

const fetcher = (url: string) => {
  return axios
    .get(url, { timeout: 5000 })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
      throw new Error("Failed to load");
    });
};

export default function () {
  const { data } = useSWR<ColumnContainerProps[]>(
    "http://localhost:4200/api/columns",
    fetcher,
    {
      refreshInterval: 0,
    }
  );
  useEffect(() => {
    data ? dndStore.getState().setColumns(data) : null;
  }, [data]);

  const columns = dndStore((state) => state.columns);

  const moveTaskToAnotherColumn = dndStore((state) => state.moveTaskToAnotherColumn);
  const moveTaskToAnotherPlaceInColumn = dndStore((state) => state.moveTaskToAnotherPlaceInColumn);


  const [rollBackColumnsData, setRollBackColumnsData] =
    useState<ColumnContainerProps[]>();

  const switchColumnsPlaces = dndStore((state) => state.switchColumnsPlaces);

  const [active, setActive] = useState<any>(null);

  useEffect(()=>console.log(active), [active])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <main className="flex gap-8 items-start mt-40 overflow-x-auto p-4 h-screen w-full">
      {columns ? (
        <DndContext
          sensors={sensors}
          onDragStart={({ active }) => {
            console.log(active)
            if (active?.data.current?.type === "Column") {
              setActive({
                type: active?.data.current?.type,
                data: columns.find((el) => el.id === active.id) || null,
              });
              setRollBackColumnsData(columns);
            }
            if (active?.data.current?.type === "Task") {
              const column = columns.find((el) => el.id === active?.data.current?.columnId);

              if (!column) return;

              const task = column.tasks.find((el) => el.id === active?.id);

              if (!task) return;

              setActive({
                type: active?.data.current?.type,
                data: task || null,
              });
            }
          }}
          onDragEnd={({ active, over }) => {
            if (
              active?.data.current?.type === "Column" &&
              over &&
              rollBackColumnsData
            ) {
              optimisticUpdateColumn(rollBackColumnsData, columns);
            }
          }}
          onDragOver={({ active: _active, over }) => {
            if (
              active &&
              active.type === "Column" &&
              active?.data.id &&
              over &&
              over?.id
            ) {
              switchColumnsPlaces(active?.data.id, over?.id as number);
            } else if (
              active &&
              active.type === "Task" &&
              active?.data.id &&
              over &&
              over?.id
            ) {
              if (over?.data.current?.type === "Column") {
                moveTaskToAnotherColumn(active.data.id, over.id as number)
              } else if (over?.data.current?.type === "Task" && _active && _active?.data.current?.columnId) {
                moveTaskToAnotherPlaceInColumn(active.data.id, over.id as number, _active.data.current.columnId)
              }
            }
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
                position={value.position}
              />
            ))}
          </SortableContext>
          {!!active &&
            createPortal(
              <DragOverlay>
                {active.type === "Task" ? active.data && (
                  <TaskContainer
                    id={active.data.id}
                    content={active.data.content}
                    columnId={active.data.columnId}
                    position={active.data.position}
                  />
                ) : (
                  <ColumnContainer
                    id={active.data.id}
                    title={active.data.title}
                    tasks={active.data.tasks}
                    position={active.data.position}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      ) : (
        <div className="w-[80%]"></div>
      )}
      <div className="bg-black text-white p-2 ml-auto">
        <button onClick={() => optimisticAddColumn()}>Add column</button>
      </div>
    </main>
  );
}
