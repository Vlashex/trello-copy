import { dndStore } from '@/lib/model/columnsStore/store';
import { optimisticUpdate } from '@/lib/model/optimisticUpdateFn';
import { ColumnContainerProps } from '@/shared/types';
import axios from 'axios';



const updateFn = (columnId: number): [] | ColumnContainerProps[] => {
    const rollBackData = dndStore.getState().columns;
    dndStore.getState().delColumn(columnId);
    return rollBackData;
};

// Серверная функция для обновления колонок
const deleteColumnOnServer = async(columnId: number) => {
  const response = 
    await axios.put(`http://localhost:4200/api/columns/${columnId}`)
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
  return deleteColumnOnServer(columnId);
};
const rollbackFn = (rollBackData: ColumnContainerProps[]) => {
  dndStore.getState().setColumns(rollBackData);
};


export const optimisticDeleteColumn = (columnId: number) => optimisticUpdate({
  updateFn: () => updateFn(columnId),
  requestFn: () => requestFn(columnId),
  rollbackFn: (rollBackData: ColumnContainerProps[]) => rollbackFn(rollBackData)
});
