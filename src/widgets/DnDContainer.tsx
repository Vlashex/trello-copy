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

  const addColumn = dndStore((state) => state.addColumn);
  const switchColumnsPlaces = dndStore((state) => state.switchColumnsPlaces);
  const moveTaskToAnotherPlace = dndStore(
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
      {columns?
        <DndContext
          sensors={sensors}
          onDragStart={({ active }) => {
            setActive(columns.find((el) => el.id === active.id) || null);
          }}
          onDragEnd={
            ({ active, over }) =>
              active?.data.current?.type === "Column" && over
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
                index={value.index}
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
                    index={active.index}
                  />
                ) : (
                  <ColumnContainer
                    id={active.id}
                    title={active.title}
                    tasks={active.tasks}
                    index={active.index}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
    : <div className="w-[80%]"></div>  
    
    }
      <div className="bg-black text-white p-2 ml-auto">
        <button onClick={() => addColumn()}>Add column</button>
      </div>
    </main>
  );
}
