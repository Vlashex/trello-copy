import { dndStore } from "@/lib/model/columnsStore/store";
import { optimisticUpdate } from "@/lib/model/optimisticUpdateFn";
import { ColumnContainerProps, TaskContainerProps } from "@/shared/types";
import axios from "axios";

// Генерация случайного временного ID (отрицательные числа для избежания конфликтов)
const generateTempId = () => -Math.floor(Math.random() * 1000000);

interface UpdateResult {
  rollBackData: ColumnContainerProps | null;
  tempTask: TaskContainerProps;
}

const updateFn = (columnId: number): UpdateResult => {
  const rollBackData = dndStore
    .getState()
    .columns.find((el) => el.id === columnId);

  // Создаем временную задачу
  const tempTask: TaskContainerProps = {
    id: generateTempId(),
    content: "Новая задача", // Можно задать начальное содержание
    columnId: columnId,
    position: 99999,
    // Добавьте другие необходимые поля
  };

  // Добавляем временную задачу в колонку
  dndStore.getState().addTaskToColumn(columnId, tempTask);

  return {
    rollBackData: rollBackData ? { ...rollBackData } : null,
    tempTask,
  };
};

// Серверная функция для создания задачи
const createTaskOnServer = async (columnId: number, tempId: number) => {
  try {
    const response = await axios.post(
      `http://localhost:4200/api/tasks/${columnId}`,
      {
        // Данные для создания задачи
        content: "Новая задача",
        // Другие необходимые поля
      }
    );

    return {
      status: response.status,
      data: response.data, // Предполагается, что сервер возвращает созданную задачу с реальным ID
      error: null,
      tempId: tempId, // Сохраняем временный ID для последующего обновления
    };
  } catch (error) {
    return {
      status: null,
      data: null,
      error: error,
      tempId: tempId,
    };
  }
};

// Функция запроса
const requestFn = async (updateResult: UpdateResult) => {
  return createTaskOnServer(
    updateResult.tempTask.columnId,
    updateResult.tempTask.id
  );
};

// Функция отката
const rollbackFn = (updateResult: UpdateResult) => {
  if (updateResult.rollBackData) {
    dndStore.getState().updateColumns(updateResult.rollBackData);
  }
};

// Функция успешного выполнения (обновление временного ID на реальный)
const successFn = (serverResponse: any) => {
  if (serverResponse.data && serverResponse.tempId) {
    dndStore
      .getState()
      .updateTaskId(serverResponse.tempId, serverResponse.data.id);
  }
};

export const optimisticAddTask = (columnId: number) => {
  const updateResult = updateFn(columnId);

  optimisticUpdate<UpdateResult>({
    updateFn: () => updateResult,
    requestFn: () => requestFn(updateResult),
    rollbackFn: rollbackFn,
  }).then((response) => {
    if (response && !response.error) {
      successFn(response);
    }
  });
};
