import SpinnerLoading from "./Spinner";

const PrimaryLoading = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white z-[9999]">
      <SpinnerLoading size="L" />
    </div>
  );
};

export default PrimaryLoading;
