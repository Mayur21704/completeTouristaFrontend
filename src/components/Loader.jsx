const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <span className="absolute inset-0 flex items-center justify-center text-blue-500 font-semibold">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loader;
