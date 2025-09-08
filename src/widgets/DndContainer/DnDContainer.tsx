"use client";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useDnd } from "./model/useDnd";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import ColumnsListContainer from "../ColumnsListContainer";
import { createPortal } from "react-dom";
import { TaskContainer } from "../Task";
import ColumnContainer from "../Column";
import { optimisticAddColumn } from "../Column/api/optimisticAddColumn";
import axios from "axios";
import useSWR from "swr";
import { ColumnContainerProps } from "@/shared/types";
import { dndStore } from "@/lib/model/columnsStore/store";
import { useEffect } from "react";

const fetcher = (url: string) =>
  axios
    .get(url, { timeout: 5000 })
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
      throw new Error("Failed to load");
    });

export default function DndContainer() {
  const { data } = useSWR<ColumnContainerProps[]>(
    "http://localhost:4200/api/columns",
    fetcher,
    { refreshInterval: 0 }
  );

  useEffect(() => {
    data ? dndStore.getState().setColumns(data) : null;
  }, [data]);

  const columns = dndStore((state) => state.columns);

  const { active, onDragStart, onDragOver, onDragEnd } = useDnd(columns);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  return (
    <main className="min-h-screen h-screen bg-gray-900 p-8">
      {/* Board Container */}
      <div className="h-full flex space-x-4 overflow-x-auto pb-4">
        {columns ? (
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={columns}
              strategy={horizontalListSortingStrategy}
            >
              <ColumnsListContainer columns={columns} />
            </SortableContext>
            {!!active &&
              createPortal(
                <DragOverlay>
                  {active.type === "Task" ? (
                    <TaskContainer {...active.data} />
                  ) : (
                    <ColumnContainer {...active.data} />
                  )}
                </DragOverlay>,
                document.body
              )}
          </DndContext>
        ) : null}

        {/* Add New Column Button */}
        <div className="w-72 flex-shrink-0">
          <button
            onClick={() => optimisticAddColumn()}
            className="flex w-full items-center justify-center rounded-lg bg-gray-700/50 p-4 text-gray-300 transition-all hover:bg-gray-700"
          >
            <span className="mr-2">+</span>
            Add column
          </button>
        </div>
      </div>
    </main>
  );
}
