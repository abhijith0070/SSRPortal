// @ts-nocheck
'use client';
import clsx from 'clsx';
import { default as ReactDataTable } from 'react-data-table-component';
import { ExpandableRowsComponent, TableProps } from 'react-data-table-component/dist/src/DataTable/types';

interface TDataTable<T> extends TableProps<T> {
  id?: string;
  isExpandable?: boolean;
  expandRenderer?: ExpandableRowsComponent<T>;
}

const DataTable = (props: TDataTable<any>) => {
  
  const dataTableProps: TDataTable<any> = {
    columns: props.columns,
    data: props.data,
    expandableRows: props.isExpandable,
    expandableRowsComponent: props.isExpandable ? props.expandRenderer : () => <div />,
    className: clsx(['data-table flex-grow border !rounded-lg max-h-[740px]', props.className]),
    fixedHeader: true,
    fixedHeaderScrollHeight: 'auto',
    highlightOnHover: true,
  };

  if(props?.id) {
    dataTableProps.id = props.id;
  }
  
  return <ReactDataTable {...dataTableProps} />;
};

export default DataTable;