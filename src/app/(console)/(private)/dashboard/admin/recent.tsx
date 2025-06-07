const RecentActivity = () => {
  return (
      <div className="bg-white p-4 hidden rounded-lg border mt-8">
          <div className="text-3xl text-gray-500 font-bold mb-8">Recent Activities</div>
          <div className="flex flex-col gap-4">
              <div className="bg-gray-100 border rounded-md p-5">
                  <div className="flex justify-between">
                      <div className="text-xl font-bold">Project 1</div>
                      <div className="text-sm text-gray-500">1 day ago</div>
                  </div>
                  <div className="text-gray-500">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
                      voluptatum.
                  </div>
                  <div className="flex gap-4 mt-4">
                      <div className="bg-gray-200 rounded-md p-2">Mentor 1</div>
                      <div className="bg-gray-200 rounded-md p-2">Mentor 2</div>
                      <div className="bg-gray-200 rounded-md p-2">Mentor 3</div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default RecentActivity;