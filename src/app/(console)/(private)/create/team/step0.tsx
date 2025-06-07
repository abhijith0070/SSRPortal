import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { ArrowRightIcon } from 'lucide-react';
import React from 'react';

import Button from '@/components/button';

const START_YEAR = 2009;
const END_YEAR = new Date().getFullYear();
const YEAR = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, index) => {
  const currentYear = START_YEAR + index;
  const nextYear = (currentYear + 1) % 100; // Extract last two digits of the next year
  return `${currentYear}-${nextYear.toString().padStart(2, '0')}`;
}).reverse();

const Step0 = ({
  year,
  setYear,
  teamNumber,
  setTeamNumber,
  nextStep,
}: {
  year: string | null,
  setYear: React.Dispatch<React.SetStateAction<string | null>>,
  teamNumber: number | null,
  setTeamNumber: React.Dispatch<React.SetStateAction<number>>,
  nextStep: () => void,
}) => {
  return (
      <>
          <div className="mx-auto">
              <div className="text-3xl mb-2 text-primary text-center font-bold">Create Team</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
              <FormControl>
                  <InputLabel id="ssr-year">SSR Year</InputLabel>
                  <Select
                      labelId="ssr-year"
                      label="SSR Year"
                      value={year}
                      onChange={(e) => setYear(e.target.value as string)}
                      className="bg-gray-50"
                  >
                      {YEAR.map((y, i) => (
                          <MenuItem key={i} value={y}>{y}</MenuItem>
                      ))}
                  </Select>
              </FormControl>
              <TextField
                  id="t-number"
                  label="Outlined"
                  variant="outlined"
                  type="number"
                  value={teamNumber}
                  onChange={(e) => setTeamNumber(e.target.value as unknown as number)}
                  className="bg-gray-50"
                  aria-valuemax={999}
                  required
              />
          </div>
          <div className="flex justify-between">
              <div>
                  <div className="text-sm text-gray-500">Your team code will be:</div>
                  <div className="text-2xl font-bold">
                      SSR
                      {year?.slice(2) || 'YY'}
                      -
                      {teamNumber?.toString().padStart(3, '0')}
                  </div>
              </div>
              <Button 
                  variant="primary"
                  onClick={(e: any) => {
                    e.preventDefault();
                    return nextStep();
                  }}
              >
                  Select Mentor
                  {' '}
                  <ArrowRightIcon className="ml-2" size="20" />
              </Button>
          </div>
      </>
  );
};

export default Step0;