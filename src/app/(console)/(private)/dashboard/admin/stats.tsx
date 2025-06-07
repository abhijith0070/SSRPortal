import Index from './quick-actions';

const STATS = [
  { label: 'Teams', value: 10 },
  { label: 'Students', value: 994 },
  { label: 'Mentors', value: 30 },
  { label: 'Projects Completed', value: 10 }, 
  { label: 'Projects Ongoing', value: 10 },
  { label: 'Proposals Submitted', value: 10 },
];

const StatsSections = () => {
  return (
      <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
              <div className="grid grid-cols-3 gap-4">
                  {STATS.map((stat, index) => (
                      <div className="w-full min-h-56 bg-white rounded-lg flex p-4" key={index}>
                          <div>
                              <div className="mb-2 text-base font-medium text-gray-400">
                                  {stat.label}
                              </div>
                              <div className="text-3xl font-semibold text-gray-700">
                                  {stat.value}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          <Index />
      </div>
  );
};

export default StatsSections;