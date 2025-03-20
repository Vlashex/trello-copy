import { dndStore } from "@/lib/model/columnsStore/store";
import { ColumnContainerProps } from "@/shared/types";
import axios from "axios";
import { useEffect } from "react";
import useSWR from "swr";

const getColumnsHook = () => {
  const fetcher = (url: string) => {
    return axios
      .get(url, { timeout: 5000 })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw new Error("Failed to load");
      });
  };
  const { data } = useSWR<ColumnContainerProps[]>(
    "http://localhost:4200/api/columns",
    fetcher,
    {
      refreshInterval: 0,
    }
  );
  useEffect(() => {
    data ? dndStore.getState().setColumns(data) : null;
  }, [data]);

  return {columns: dndStore().columns.slice()}
};

export default getColumnsHook;