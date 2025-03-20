import { useState, useEffect } from 'react';
import { dndStore } from '@/lib/model/columnsStore/store';
import { optimisticUpdateColumn } from '@/widgets/Column/api/optimisticUpdateColumns';
import { optimisticUpdateTaskPosition } from '@/widgets/Task/lib/optimisticMoveTaskToAnotherColumn';
import { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { ColumnContainerProps } from '@/shared/types';

export const useDnd = (columns: ColumnContainerProps[]) => {
  const [active, setActive] = useState<any>(null);
  const [rollBackColumnsData, setRollBackColumnsData] = useState<ColumnContainerProps[]>();

  const moveTaskToAnotherColumn = dndStore((state) => state.moveTaskToAnotherColumn);
  const moveTaskToAnotherPlaceInColumn = dndStore((state) => state.moveTaskToAnotherPlaceInColumn);
  const switchColumnsPlaces = dndStore((state) => state.switchColumnsPlaces);

  const onDragStart = ({ active }: DragStartEvent) => {
    setRollBackColumnsData(columns);
    if (active?.data.current?.type === "Column") {
      setActive({
        type: active?.data.current?.type,
        data: columns.find((el) => el.id === active.id) || null,
      });
    } else if (active?.data.current?.type === "Task") {
      const column = columns.find((el) => el.id === active?.data.current?.columnId);
      if (column) {
        const task = column.tasks.find((el) => el.id === active?.id);
        setActive({
          type: active?.data.current?.type,
          data: task || null,
        });
      }
    }
  };

  const onDragOver = ({ active: _active, over }: DragOverEvent) => {
    if (active?.type === "Column" && active?.data.id && over?.id) {
      switchColumnsPlaces(active?.data.id, over?.id as number);
    } else if (active?.type === "Task" && active?.data.id && over?.id) {
      if (over?.data.current?.type === "Column") {
        moveTaskToAnotherColumn(active?.data.id, over?.id as number);
      } else if (over?.data.current?.type === "Task") {
        moveTaskToAnotherPlaceInColumn(active?.data.id, over?.id as number, active?.data.current?.columnId);
      }
    }
  };

  const onDragEnd = ({ active: _active, over }: DragEndEvent) => {
    if (over && rollBackColumnsData && rollBackColumnsData !== columns) {
      if (_active?.data.current?.type === "Column") {
        optimisticUpdateColumn(rollBackColumnsData, columns);
      } else if (_active?.data.current?.type === "Task") {
        optimisticUpdateTaskPosition(rollBackColumnsData, _active.id as number, active?.data.position, _active?.data.current?.columnId);
      }
    }
  };

  return {
    active,
    onDragStart,
    onDragOver,
    onDragEnd,
  };
};
