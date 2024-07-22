import clsx from "clsx";
import { FaSpinner } from "react-icons/fa";

interface ISizeStyle {
  [k: string]: string;
}

interface Props {
  className?: string;
  size?: "S" | "M" | "L";
}

const sizeStyle: ISizeStyle = {
  S: "text-xl",
  M: "text-2xl",
  L: "text-3xl",
};

const SpinnerLoading = (props: Props) => {
  const { size = "M", className } = props;

  return (
    <div>
      <FaSpinner className={clsx(sizeStyle[size], className, "animate-spin")} />
    </div>
  );
};

export default SpinnerLoading;
