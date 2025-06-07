const STATS = [
  {
    title: 'Years',
    value: '10+',
  },
  {
    title: 'Projects',
    value: '994+',
  },
  {
    title: 'Volunteers',
    value: '5688+',
  },
  {
    title: 'States',
    value: '22+',
  },
];


const Stats = () => (
    <div className="flex gap-12 w-min mt-8">
        {STATS.map((stat, index) => (
            <>
                <div key={index} className="flex flex-col items-start justify-center">
                    <div className="text-4xl font-bold">{stat.value}</div>
                    <div className="opacity-50 text-2xl">{stat.title}</div>
                </div>
                {index !== STATS.length - 1 && (
                    <div className="border-r border-gray-200" />
                )}
            </>
        ))}
    </div>
);

export default Stats;