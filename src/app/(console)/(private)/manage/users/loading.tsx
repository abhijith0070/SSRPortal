import Spinner from '@/components/spinner';

const Loading = () => {
  return (
      <div className="flex items-center justify-center h-64">
          <Spinner />
      </div>
  );
};

export default Loading;