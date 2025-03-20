import { ColumnContainerProps } from '@/shared/types'
import React from 'react'
import { ColumnContainer } from '../Column/model/ColumnContainer';

type ColumnsListContainerProps = {
    columns: ColumnContainerProps[]
}

export function ColumnsListContainer({columns} : ColumnsListContainerProps) {
    
    if (!columns) return <></>;
  
    return <>
        {
            columns
            .sort((a,b) => b.position - a.position)
            .map((val, index) => (
                <ColumnContainer
                    {...val}
                    key={index}
                />
            ))
        }
    </>
}
