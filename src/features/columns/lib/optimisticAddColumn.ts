import { dndStore } from '@/lib/model/columnsStore/store';
import { optimisticUpdate } from '@/lib/model/optimisticUpdateFn';
import { ColumnContainerProps } from '@/shared/types';
import axios from 'axios';



const updateFn = (): [] | ColumnContainerProps[] => {
    const rollBackData = dndStore.getState().columns;
    dndStore.getState().addColumn();
    return rollBackData;
};

// Серверная функция для обновления колонок
const updateColumnOnServer = async() => {
  const response = 
    await axios.post(`http://localhost:4200/api/columns`)
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
const requestFn = async () => {
  return updateColumnOnServer();
};
const rollbackFn = (rollBackData: ColumnContainerProps[]) => {
  dndStore.getState().setColumns(rollBackData);
};


export const optimisticAddColumn = () => optimisticUpdate({
  updateFn: () => updateFn(),
  requestFn: () => requestFn(),
  rollbackFn: (rollBackData: ColumnContainerProps[]) => rollbackFn(rollBackData)
});
