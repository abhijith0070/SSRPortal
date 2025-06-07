'use client';

import { ExpanderComponentProps, TableColumn } from 'react-data-table-component';
import { useState } from 'react';

import DataTable from '@/components/data-table';
import { TTeam } from '@/types/team';

type DataRow = {
  code: string
  mentor: any
  members: any[],
};

const columns: TableColumn<DataRow>[] = [
  {
    name: 'ID',
    selector: row => row.code,
  },
  {
    name: 'Members',
    format: d => (
        <div className="text-gray-500">
            {d.members.length}
            {' '}
            Members
        </div>
    ),
  },
];

const ExpandedComponent: React.FC<ExpanderComponentProps<DataRow>> = ({ data }) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

const ManageTeamTable = ({ data: d }: { data: TTeam[] }) => {

  const [data, setData] = useState(d);
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(20);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    const response = await fetch(`/api/manage/users/?page=${page}&count=${perPage}`);
    // @ts-ignore
    setData(response?.data?.data);
    setLoading(false);
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handlePerRowsChange = async (count: number, page: number) => {
    setLoading(true);

    const response = await fetch(`/api/manage/users/?page=${page}&count=${count}`).then(res => res.json());

    setData(response?.data?.data);
    setPerPage(count);
    setLoading(false);
  };


  return (
      <DataTable
          id="manage-users-table"
          pagination
          paginationServer
          paginationTotalRows={d.length}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          progressPending={loading}
          data={data}
          columns={columns}
          isExpandable={true}
          expandRenderer={ExpandedComponent}
      />
  );
};

export default ManageTeamTable;
//
// const Landing = () => (
//     <div>
//         <h1>hello world</h1>
//     </div>
// );
//
// export default Landing;