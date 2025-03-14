import { dndStore } from '@/lib/model/columnsStore/store';
import { optimisticUpdate } from '@/lib/model/optimisticUpdateFn';
import { ColumnContainerProps } from '@/shared/types';
import axios from 'axios';



const updateFn = (columnId: number): ColumnContainerProps | null => {
    const rollBackData = dndStore.getState().columns.find((el) => el.id === columnId);
    dndStore.getState().addTaskToColumn(columnId);
    return rollBackData || null;
};

// Серверная функция для обновления колонок
const updateTaskOnServer = async(columnId: number) => {
  const response = 
    await axios.post(`http://localhost:4200/api/tasks/${columnId}`)
    .then((res) => {
        return {
            status: res.data.status,
            error: null,
        }
    })
    .catch((err) => {
        return {
            status: null,
            error: err
        }
    })
    console.log(response)
  return response;
}

// Функция запроса
const requestFn = async (columnId: number) => {
  return updateTaskOnServer(columnId);
};
const rollbackFn = (rollBackData: ColumnContainerProps) => {
  dndStore.getState().updateColumns(rollBackData);
};


export const optimisticAddTask = (columnId: number) => optimisticUpdate<ColumnContainerProps>({
  updateFn: () => updateFn(columnId),
  requestFn: () => requestFn(columnId),
  rollbackFn: (rollBackData: ColumnContainerProps) => rollbackFn(rollBackData)
});
