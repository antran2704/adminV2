import { Input, Table, TableColumnsType, TableProps } from "antd";
import { useTranslations } from "next-intl";
import { ChangeEvent, memo, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { IFile, INftTable, IPagination } from "~/interface";

import { NO_IMAGE } from "~/commons/image";
import { ENftStatus } from "~/enum";
import { Link, useRouter } from "~/navigation";
import { formatBigNumber } from "~/helper/format";
import { DAY_DYHM } from "~/commons/format";

interface Props {
  items: INftTable[];
  pagination?: IPagination;
  loading?: boolean;
  canSelect?: boolean;
  selectedRowKeys?: React.Key[];
  onSelectedRowKeys?: (selected: React.Key[]) => void;
  onSelectedRows?: (selectedRows: INftTable[]) => void;
  onPagination?: (nextPage: number, pageSize: number) => void;
}

const NFTTable = (props: Props) => {
  const {
    items,
    pagination,
    loading = false,
    canSelect = false,
    selectedRowKeys = [],
    onSelectedRowKeys,
    onPagination,
    onSelectedRows,
  } = props;

  const router = useRouter();

  const t = useTranslations("NFTPage");
  const tCommon = useTranslations("Common");

  const [newRange, setNewRange] = useState<number>(0);

  const onInputRange = (e: ChangeEvent<HTMLInputElement>, total: number) => {
    const value = Number(e.target.value);

    if (isNaN(value)) return;

    if (value > total) {
      setNewRange(total);
      return;
    }

    setNewRange(value);
  };

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: INftTable[],
  ) => {
    if (onSelectedRowKeys) onSelectedRowKeys(newSelectedRowKeys);

    if (onSelectedRows) {
      onSelectedRows(selectedRows);
    }
  };

  // columnt table
  const columns: TableColumnsType<INftTable> = useMemo(() => {
    return [
      {
        title: t("table.id"),
        dataIndex: "_id",
        className: "cursor-pointer",
        render: (userId: string) => (
          <span className="whitespace-nowrap">{userId}</span>
        ),
      },
      {
        title: t("table.thumbnail"),
        dataIndex: "image",
        className: "cursor-pointer",
        render: (thumbnail: IFile) => (
          <div>
            <img
              onError={(e) => (e.currentTarget.src = NO_IMAGE)}
              className="w-14 h-14 min-w-14 rounded-lg object-cover object-center"
              src={thumbnail.url}
              alt="thumbnail"
              title="thumbnail"
            />
          </div>
        ),
      },
      {
        title: t("table.name"),
        dataIndex: "name",
        className: "cursor-pointer",
        render: (value: string) => (
          <span className="whitespace-nowrap">
            {value ? value : tCommon("update")}
          </span>
        ),
      },
      {
        title: t("table.collection"),
        dataIndex: "collection",
        render: ({ name, id }: { name: string; id: string }) => {
          if (name && id) {
            return (
              <Link
                href={`/product/collections/${id}`}
                className="block text-black-50 hover:text-primary-200 whitespace-nowrap"
              >
                {name}
              </Link>
            );
          } else {
            return (
              <span className="whitespace-nowrap">{tCommon("update")}</span>
            );
          }
        },
      },
      {
        title: t("table.project"),
        dataIndex: "projectName",
        render: (value: string) => (
          <span className="whitespace-nowrap">
            {value ? value : tCommon("update")}
          </span>
        ),
      },
      {
        title: t("table.onwer"),
        dataIndex: "owner",
        render: (value: string) => (
          <span className="whitespace-nowrap">
            {value ? value : tCommon("update")}
          </span>
        ),
      },
      {
        title: t("table.price"),
        dataIndex: "price",
        render: ({
          value,
          currency,
        }: {
          value: number | null;
          currency: string;
        }) => (
          <span className="whitespace-nowrap">
            {value
              ? `${formatBigNumber(value)} ${currency}`
              : tCommon("notYet")}
          </span>
        ),
      },
      {
        title: t("table.date"),
        dataIndex: "publicDate",
        render: (value: string) => (
          <span className="whitespace-nowrap">
            {value
              ? dayjs(new Date(value)).format(DAY_DYHM)
              : tCommon("notYet")}
          </span>
        ),
      },
    ];
  }, []);

  const propsTable: TableProps = useMemo(() => {
    let props: TableProps = {};

    if (canSelect) {
      props.rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: INftTable[]) =>
          onSelectChange(selectedRowKeys, selectedRows),
        preserveSelectedRowKeys: true,
        getCheckboxProps: (record: INftTable) => ({
          disabled: record.status !== ENftStatus.MINTED,
        }),
      };
    }

    return props;
  }, [canSelect, selectedRowKeys]);

  useEffect(() => {
    if (pagination && pagination.take !== newRange) {
      const itemCount = Number(pagination.take) * Number(pagination.page);

      setNewRange(itemCount > pagination.total ? pagination.total : itemCount);
    }
  }, [pagination]);

  return (
    <div className="scrollHidden overflow-x-auto">
      <Table
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={
          !pagination
            ? false
            : {
                total: pagination.total,
                pageSize: pagination.take,
                current: pagination.page,
                showSizeChanger: true,
                showTotal: (total) => {
                  return (
                    <div className="flex items-center">
                      <Input
                        onChange={(e) => onInputRange(e, total)}
                        onPressEnter={() =>
                          onPagination && onPagination(1, newRange)
                        }
                        value={newRange}
                        className="!max-w-[60px] text-center !border-none"
                      />
                      <span> of {total} items</span>
                    </div>
                  );
                },
                onChange: (nextPage, newPageSize) => {
                  if (onPagination) {
                    onPagination(nextPage, newPageSize);
                  }
                },
                position: ["bottomLeft"],
                locale: {
                  items_per_page: `/ ${tCommon("pagination.page") as string}`,
                },
              }
        }
        onRow={(record: INftTable) => {
          return {
            onDoubleClick: () => {
              router.push(`/product/NFT/${record._id}`);
            },
          };
        }}
        {...propsTable}
      />
    </div>
  );
};

export default memo(NFTTable);
