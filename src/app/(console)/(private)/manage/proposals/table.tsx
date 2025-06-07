'use client';



type DataRow = {
  id: string 
  email: string,
  name: 'test',
  type: 'MENTOR' | 'STUDENT' | 'ADMIN',
  team: null,
  is_active: boolean
  is_staff: boolean
};


// const ExpandedComponent: React.FC<ExpanderComponentProps<DataRow>> = ({ data }) => {
//   return <pre>{JSON.stringify(data, null, 2)}</pre>;
// };

interface IPaginatedData<Type> {
  results: Type[];
  count: number;
  next: string | null;
  previous: string | null;
}

const ManageUserTable = ({ data: _ }: { data: IPaginatedData<DataRow> }) => {

  // const [data, setData] = useState(d.results);
  // const [loading, setLoading] = useState(false);
  // const [perPage, setPerPage] = useState(20);

  // const fetchUsers = async (page: number) => {
  //   setLoading(true);
  //   const response = await fetch(`/api/manage/users/?page=${page}&count=${perPage}`).then(res => res.json());
  //   setData(response?.data?.data);
  //   setLoading(false);
  // };

  // const handlePageChange = (page: number) => {
  //   fetchUsers(page);
  // };
  //
  // const handlePerRowsChange = async (count: number, page: number) => {
  //   setLoading(true);
  //
  //   const response = await fetch(`/api/manage/users/?page=${page}&count=${count}`).then(res => res.json());
  //
  //   setData(response?.data?.data);
  //   setPerPage(count);
  //   setLoading(false);
  // };


  return (
      // <DataTable
      //     id="manage-users-table"
      //     pagination
      //     paginationServer
      //     paginationTotalRows={d.count}
      //     onChangeRowsPerPage={handlePerRowsChange}
      //     onChangePage={handlePageChange}
      //     progressPending={loading}
      //     data={data}
      //     columns={columns}
      //     isExpandable={true}
      //     expandRenderer={ExpandedComponent}
      // />
      <div>
          adls
      </div>
  );
};

export default ManageUserTable;