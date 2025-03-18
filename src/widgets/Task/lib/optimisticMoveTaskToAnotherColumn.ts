import { dndStore } from '@/lib/model/columnsStore/store';
import { optimisticUpdate } from '@/lib/model/optimisticUpdateFn';
import { ColumnContainerProps } from '@/shared/types';
import axios from 'axios';



const updateFn = (rollBackData: ColumnContainerProps[]): ColumnContainerProps[] => {
    return rollBackData;
};

// Серверная функция для обновления колонок
const updateTaskOnServer = async(taskId:number, _taskPosition: number, columnId: number) => {
    // const taskPosition = dndStore.getState().columns[columnId]?.tasks.filter((el) => el.position < _taskPosition).length;
    console.log(_taskPosition)

  const response = 
    await axios.put(`http://localhost:4200/api/tasks/${taskId}/${_taskPosition}/${columnId}`)
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
const requestFn = async (taskId:number, taskPosition: number, columnId: number) => {
  return updateTaskOnServer(taskId, taskPosition, columnId);
};
const rollbackFn = (rollBackData: ColumnContainerProps[]) => {
  dndStore.getState().setColumns(rollBackData);
};


export const optimisticUpdateTaskPosition = (rollBackData: ColumnContainerProps[], taskId:number, taskPosition: number, columnId: number) => optimisticUpdate<ColumnContainerProps[]>({
  updateFn: () => updateFn(rollBackData),
  requestFn: () => requestFn(taskId, taskPosition, columnId),
  rollbackFn: (rollBackData: ColumnContainerProps[]) => rollbackFn(rollBackData)
});
