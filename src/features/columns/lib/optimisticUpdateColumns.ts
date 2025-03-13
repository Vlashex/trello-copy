import { dndStore } from '@/lib/model/columnsStore/store';
import { optimisticUpdate } from '@/lib/model/optimisticUpdateFn';
import { TaskContainerProps } from '@/shared/types';
import axios from 'axios';



const updateFn = (taskId: number, newData: Partial<TaskContainerProps>): TaskContainerProps | null => {
  return dndStore.getState().updateTask(taskId, newData);
};

// Серверная функция для обновления задачи
const updateTaskOnServer = async(taskId: number, newData: Partial<TaskContainerProps>) => {
  // Здесь вы можете использовать "use server" в Next.js 14 для обозначения серверной функции
  const response = await axios.put(`/api/tasks/${taskId}`, newData);
  return response.data;
}

// Функция запроса
const requestFn = async (taskId: number, newData: Partial<TaskContainerProps>) => {
  return updateTaskOnServer(taskId, newData);
};
const rollbackFn = (taskId: number, oldData: TaskContainerProps | null) => {
  oldData?dndStore.getState().rollbackTask(taskId, oldData):null;
};


export const optimisticUpdateColumn = (taskId: number, newData: Partial<TaskContainerProps>) => optimisticUpdate({
  updateFn: () => updateFn(taskId, newData),
  requestFn: () => requestFn(taskId, newData),
  rollbackFn: (rollbackData: TaskContainerProps | null) => rollbackFn(taskId, rollbackData)
});
