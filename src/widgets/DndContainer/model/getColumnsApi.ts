import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { dndStore } from '@/lib/model/columnsStore/store';
import { ColumnContainerProps } from '@/shared/types';

import isEqual from 'lodash/isEqual'

const fetcher = (url: string) =>
  axios
    .get(url, { timeout: 5000 })
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
      throw new Error('Failed to load');
    });

const useColumns = () => {
  const { data } = useSWR<ColumnContainerProps[]>(
    'http://localhost:4200/api/columns',
    fetcher,
    { refreshInterval: 0 }
  );

  // Получаем текущие колонки из dndStore
  const currentColumns = dndStore((state) => state.columns);

  // Обновляем dndStore только если данные изменились
  useEffect(() => {
    if (data && !isEqual(data, currentColumns)) {
      dndStore.getState().setColumns(data);
    }
  }, [data, currentColumns]);

  // Мемоизация сортированного списка, чтобы не создавать новый массив на каждый рендер
  const sortedColumns = useMemo(() => {
    return currentColumns.slice().sort((a, b) => a.position - b.position);
  }, [currentColumns]);

  return { columns: sortedColumns };
};


export default useColumns