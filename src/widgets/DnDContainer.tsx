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
    return axios.get(url, { timeout: 5000 }) 
        .then(response => response.data)
        .catch(error => {
            console.log(error)
            throw new Error("Failed to load")
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
  useEffect(()=>{
    data?dndStore.getState().setColumns(data):null;
  }, [data])

  const columns = dndStore((state) => state.columns);

  const [rollBackColumnsData, setRollBackColumnsData] = useState<ColumnContainerProps[]>();

  const switchColumnsPlaces = dndStore((state) => state.switchColumnsPlaces);

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
      {columns?
        <DndContext
          sensors={sensors}
          onDragStart={({ active }) => {
            setActive(columns.find((el) => el.id === active.id) || null);
            setRollBackColumnsData(columns);
          }}
          onDragEnd={
            ({ active, over }) => {
              if (active?.data.current?.type === "Column" && over && rollBackColumnsData) {
                console.log("Prev", columns)
                optimisticUpdateColumn(rollBackColumnsData, columns);
                console.log("New", columns)
              }
            }
          }
          onDragOver={({ over }) => {
            console.log(active?.id, over, over?.id)
            if (active?.id && over && over?.id) {
              console.log("switch")
              switchColumnsPlaces(active?.id, (over?.id as number))
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
          {active &&
            createPortal(
              <DragOverlay>
                {active.content !== undefined ? (
                  <TaskContainer
                    id={active.id}
                    content={active.content}
                    columnId={active.columnId}
                    position={active.position}
                  />
                ) : (
                  <ColumnContainer
                    id={active.id}
                    title={active.title}
                    tasks={active.tasks}
                    position={active.position}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
    : <div className="w-[80%]"></div>  
    
    }
      <div className="bg-black text-white p-2 ml-auto">
        <button onClick={() => optimisticAddColumn()}>Add column</button>
      </div>
    </main>
  );
}
