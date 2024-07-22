import clsx from "clsx";
import { memo } from "react";
import { IPagination } from "~/interface";

interface Props {
  className?: string;
  pagination: IPagination;
}

const ShowTotalPagination = (props: Props) => {
  const { pagination, className } = props;

  return (
    <p className={clsx("text-sm", className)}>
      {(pagination.page - 1) * pagination.take + 1} to{" "}
      {pagination.page * pagination.take > pagination.total
        ? pagination.total
        : pagination.page * pagination.take}{" "}
      of {pagination.total}
    </p>
  );
};

export default memo(ShowTotalPagination);
