'use client'
import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useDnd } from './model/useDnd';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import ColumnsListContainer from '../ColumnsListContainer';
import { createPortal } from 'react-dom';
import { TaskContainer } from '../Task';
import ColumnContainer from '../Column';
import { optimisticAddColumn } from '../Column/api/optimisticAddColumn';
import axios from 'axios';
import useSWR from 'swr';
import { ColumnContainerProps } from '@/shared/types';
import { dndStore } from '@/lib/model/columnsStore/store';
import { useEffect } from 'react';


const fetcher = (url: string) =>
  axios
    .get(url, { timeout: 5000 })
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
      throw new Error('Failed to load');
    });

export default function DndContainer() {
  const { data } = useSWR<ColumnContainerProps[]>(
    'http://localhost:4200/api/columns',
    fetcher,
    { refreshInterval: 0 }
  );

  useEffect(()=>{
    data? dndStore.getState().setColumns(data): null;
  }, [data])

  const columns = dndStore(state => state.columns);

  const {
    active,
    onDragStart,
    onDragOver,
    onDragEnd,
  } = useDnd(columns);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  return (
    <main className="flex custom-scrollbar gap-2 items-start m-2 overflow-x-auto p-4 h-screen w-full">
      {columns ? (
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
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
      ) : (
        <div className="w-[80%]" />
      )}
      <div className="bg-black text-white p-2 ml-auto">
        <button onClick={() => optimisticAddColumn()}>Add column</button>
      </div>
    </main>
  );
}
