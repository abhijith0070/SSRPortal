import { SearchIcon } from 'lucide-react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSearchParams } from 'next/navigation';

const YEARS = [
  {
    label: '2017-18',
    value: '1718',
  },
  {
    label: '2018-19',
    value: '1819',
  },
  {
    label: '2019-20',
    value: '1920',
  },
  {
    label: '2020-21',
    value: '2021',
  },
  {
    label: '2021-22',
    value: '2122',
  },
  {
    label: '2022-23',
    value: '2223',
  },
];

const ProjectsSidebar = ({ handleSearch: _, filter, setFilter }: any) => {
  
  const searchParams = useSearchParams();
    
  return (
      <>
          <form className="w-full" method="GET">
              <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                  Search
              </label>
              <div className="relative flex items-center justify-between">
                  <input
                      type="search"
                      id="default-search"
                      // onChange={(e) => handleSearch(e.target.value)}
                      className="block w-full pl-4 pr-2 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-primary"
                      placeholder="Search"
                      name="query"
                      defaultValue={searchParams.get('query')?.toString()}
                  />
                  <button
                      type="submit"
                      className="text-primary/50 absolute top-1/2 right-3 -translate-y-1/2 font-medium rounded-lg text-sm"
                  >
                      <SearchIcon size="15" />
                  </button>
              </div>
          </form>
          <div className="w-full hidden mt-8">
              <FormControl fullWidth size="small">
                  <InputLabel id="filter-year-id">Filter by year</InputLabel>
                  <Select
                      labelId="filter-year-id"
                      id="demo-simple-select"
                      value={filter?.year}
                      label="Filter by year"
                      onChange={(e) => setFilter({ ...filter, year: e.target.value })}
                  >
                      {YEARS.map((y) => (
                          <MenuItem key={y.value} value={y.value}>{y.label}</MenuItem>
                      ))}
                  </Select>
              </FormControl>
          </div>
      </>
  );
};

export default ProjectsSidebar;