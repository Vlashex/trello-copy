import { dndStore } from '@/lib/model/columnsStore/store';
import { optimisticUpdate } from '@/lib/model/optimisticUpdateFn';
import { ColumnContainerProps } from '@/shared/types';
import axios from 'axios';

type positions = {id: number, position: number}

const updateFn = (rollBackData: ColumnContainerProps[], columns: ColumnContainerProps[]): [] | ColumnContainerProps[] => {
  console.log("Optimistic column")
    dndStore.getState().setColumns(columns)
    return rollBackData;
};

// Серверная функция для обновления колонок
const updateTaskOnServer = async(reqData: positions[]) => {
  const response = 
    await axios.put(`http://localhost:4200/api/columns`, reqData, {
        withCredentials: true
    })
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
const requestFn = async (columns: ColumnContainerProps[]) => {
    const reqData = columns.map(({id, position}) => ({id, position}))

  return updateTaskOnServer(reqData);
};
const rollbackFn = (rollBackData: ColumnContainerProps[]) => {
  dndStore.getState().setColumns(rollBackData);
};


export const optimisticUpdateColumn = (rollBackData: ColumnContainerProps[], columns: ColumnContainerProps[]) => optimisticUpdate({
  updateFn: () => updateFn(rollBackData, columns),
  requestFn: () => requestFn(columns),
  rollbackFn: (rollBackData: ColumnContainerProps[]) => rollbackFn(rollBackData)
});
