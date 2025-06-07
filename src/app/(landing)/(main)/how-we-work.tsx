const DATA = [
  {
    number: '01.',
    title: 'Find a problem',
    description: 'Students try to find a problem in the society',
  },
  {
    number: '02.',
    title: 'Get the solution',
    description: 'Students get the innovative solution for the problem',
  },
  {
    number: '03.',
    title: 'Implement the solution',
    description: 'Students implement the solution in the society',
  },
];

const HowWeWork = () => {
  return (
      <section className="text-gray-600 body-font w-full">
          <div className="container px-5 py-24 mx-auto flex flex-wrap">
              <div className="flex flex-col justify-center gap-16 items-center -m-4 w-full relative">
                  <div className="absolute -top-8 left-12 w-56 h-36 -ml-24">
                      <div
                          style={{
                            backgroundImage: 'radial-gradient(rgba(0, 62, 135, 0.22) 5px, transparent 0)',
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 20px 20px',
                            height: '100%',
                          }}
                      />
                  </div>
                  <div className="flex flex-grow h-full w-full flex-col justify-end">
                      <div className="flex flex-col items-center w-full">
                          <div className="text-sm font-semibold text-primary">How we work</div>
                          <h1 className="title-font text-4xl font-bold text-gray-900 mb-2">
                              We strive for change
                          </h1>
                          <p className="leading-relaxed text-xs text-center opacity-75 max-w-[600px]">
                              Giving back to the society whatever little we can, this is the small thought that led to
                              this massive community service program that we call SSR.
                          </p>
                      </div>
                  </div>
                  <div className="flex justify-center w-full">
                      <div className="grid grid-cols-3 gap-8">
                          {DATA.map((item) => (
                              <div key={item.number} className="flex border bg-white/80 p-4 rounded-lg">
                                  <div>
                                      <div className="text-xl font-bold text-primary mr-2">{item.number}</div>
                                      <div className="text-2xl font-bold text-gray-800">
                                          {item.title}
                                      </div>
                                      <p className="opacity-70 mt-1 text-sm">
                                          {item.description}
                                      </p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </section>
  );
};

export default HowWeWork;