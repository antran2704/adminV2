import {
  Button,
  DatePicker,
  Input,
  Modal,
  Pagination,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import { useTranslations } from "next-intl";
import { ChangeEvent, memo, useEffect, useMemo, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import dayjs from "dayjs";

import { IPagination, IRatingTable, ISearchRating } from "~/interface";

import { initPagination } from "~/commons/pagination";
import { formatDate } from "~/helper/dateTime";
import ShowTotal from "~/components/Pagination/ShowTotal";
import clsx from "clsx";
import Link from "next/link";
import { EOrderType } from "~/enum";

interface Props {
  items: IRatingTable[];
  pagination?: IPagination;
  loading?: boolean;
  search: string;
  paramater: ISearchRating;
  onFilter: (newParam: ISearchRating) => void;
  onSortDate: (order: EOrderType) => void;
  onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onPagination?: (nextPage: number, pageSize: number) => void;
}

const RatingTable = (props: Props) => {
  const {
    items,
    pagination = initPagination,
    loading = false,
    search = "",
    paramater,
    onFilter,
    onChangeSearch,
    onPagination,
    onSortDate,
  } = props;

  const t = useTranslations("RatingPage");
  const tFilter = useTranslations("Filter");
  const tCommon = useTranslations("Common");

  const [listItem, setListItem] = useState<IRatingTable[]>([]);

  const [filter, setFilter] = useState<{
    // eslint-disable-next-line no-unused-vars
    [x in keyof Partial<ISearchRating>]: string | number;
  }>({});

  const [modalFilter, setModalFilter] = useState(false);

  // columnt table
  const columns: TableColumnsType<IRatingTable> = useMemo(() => {
    return [
      {
        title: t("table.id"),
        dataIndex: "id",
        render: (id: string) => (
          <Link className="block text-black" href={`/ratings/${id}`}>
            <span className="whitespace-nowrap">{id}</span>
          </Link>
        ),
        align: "center",
      },
      {
        title: t("table.content"),
        dataIndex: "comment",
        render: (username: string) => (
          <span className="whitespace-nowrap">
            {username ? username : "Chưa cập nhật"}
          </span>
        ),
        align: "center",
      },
      {
        title: t("table.rating"),
        dataIndex: "rating",
        render: (username: string) => (
          <span className="whitespace-nowrap">
            {username ? username : "Chưa cập nhật"}
          </span>
        ),
        align: "center",
      },
      {
        title: t("table.unit"),
        dataIndex: "unit",
        render: ({ name, id }: { name: string; id: string }) => (
          <span className="whitespace-nowrap">
            {name ? name : "Chưa cập nhật"}
          </span>
        ),
        align: "center",
      },
      {
        title: t("table.user"),
        dataIndex: "user",
        render: ({ name, id }: { name: string; id: string }) => (
          <span className="whitespace-nowrap">
            {name ? name : "Chưa cập nhật"}
          </span>
        ),
        align: "center",
      },
      {
        title: t("table.merchant"),
        dataIndex: "merchant",
        render: ({ name, id }: { name: string; id: string }) => (
          <span className="whitespace-nowrap">
            {name ? name : "Chưa cập nhật"}
          </span>
        ),
        align: "center",
      },
      {
        title: t("table.nft"),
        dataIndex: "NFT",
        render: (value: string) => (
          <Link href={`/product/NFT/${value}`} className="whitespace-nowrap">
            {value ? value : "Chưa cập nhật"}
          </Link>
        ),
        align: "center",
      },
      {
        title: t("table.createdAt"),
        dataIndex: "createdAt",
        render: (createdAt: string) => (
          <p className="whitespace-nowrap">{formatDate(createdAt)}</p>
        ),
        align: "center",
      },
    ];
  }, [listItem]);

  const onSelectFilter = (value: string, option: any) => {
    const name: keyof ISearchRating = option.name;

    setFilter({ ...filter, [name]: value });
  };

  const onSelectDate = (dateString: string, name: keyof ISearchRating) => {
    setFilter({ ...filter, [name]: dateString });
  };

  const handleFilter = () => {
    const newParam = {
      ...paramater,
      ...filter,
      page: 1,
      search: "",
    } as ISearchRating;

    onFilter(newParam);
    onShowModalFilter();
  };

  const onClearFilter = () => {
    const newParam = {
      order: EOrderType.DESC,
      take: paramater.take,
      page: 1,
      search: "",
    } as ISearchRating;

    onFilter(newParam);
    onShowModalFilter();

    setFilter({});
  };

  const onShowModalFilter = () => {
    setModalFilter(!modalFilter);
  };

  useEffect(() => {
    setListItem(items);
  }, [items]);

  return (
    <div className="bg-white rounded-lg">
      {/* Header */}
      <div className="flex items-start lg:flex-row flex-col justify-between pb-5 pt-10 px-5 gap-5">
        <div className="lg:w-4/12 w-full">
          <h2 className="md:text-2xl sm:text-xl text-lg font-semibold text-shade-50">
            {t("title")}
          </h2>
        </div>
        <div className="lg:w-fit w-full">
          <div className="w-full flex items-center lg:justify-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="md:block hidden">
                <Input
                  addonBefore={
                    <div className="flex items-center justify-center h-full px-3 cursor-pointer ">
                      <SearchOutlined />
                    </div>
                  }
                  allowClear={true}
                  value={search}
                  onChange={onChangeSearch}
                  placeholder={tCommon("placeholder.search")}
                  size="large"
                  className="inp__search !w-[320px0 bg-[#F9FBFF]"
                />
              </div>

              <Select
                placeholder="Chọn lọc"
                size="large"
                value={paramater.order}
                onChange={(value) => onSortDate(value as EOrderType)}
                style={{ width: 200 }}
                options={[
                  { value: EOrderType.DESC, label: tFilter("newest") },
                  { value: EOrderType.ASC, label: tFilter("oldest") },
                ]}
              />

              <Button
                className="!flex items-center justify-center font-medium !bg-shade-50 !text-white"
                icon={<CiFilter className="text-xl" />}
                size="large"
                onClick={onShowModalFilter}
              >
                {tFilter("title")}
              </Button>
            </div>
          </div>

          <div className="md:hidden block w-full pt-5">
            <Input
              addonBefore={
                <div className="flex items-center justify-center h-full px-3 cursor-pointer border-r">
                  <SearchOutlined />
                </div>
              }
              value={search}
              allowClear={true}
              onChange={onChangeSearch}
              placeholder={tCommon("placeholder.search")}
              size="large"
              className="inp__search"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="scrollHidden overflow-x-auto">
        <Table
          columns={columns}
          dataSource={listItem}
          loading={loading}
          pagination={false}
        />

        {pagination.total > 0 && (
          <div className="flex items-center justify-between p-5">
            <ShowTotal pagination={pagination} />
            <Pagination
              pageSize={pagination.take}
              total={pagination.total}
              current={pagination.page}
              onChange={(nextPage, newPageSize) => {
                if (onPagination) onPagination(nextPage, newPageSize);
              }}
              locale={{
                items_per_page: `/ ${tCommon("pagination.page") as string}`,
              }}
            />
          </div>
        )}
      </div>

      {/* Modal filter */}
      <Modal
        centered={true}
        open={modalFilter}
        onCancel={onShowModalFilter}
        destroyOnClose={true}
        closeIcon={false}
        footer={() => (
          <div className="flex item justify-between">
            {!!Object.keys(filter).length && (
              <Button
                icon={<IoMdClose />}
                size="large"
                type="text"
                onClick={onClearFilter}
                className="!flex items-center md:w-fit gap-2"
              >
                {tFilter("cancel")}
              </Button>
            )}

            <div className="flex items-center justify-end ml-auto gap-2">
              <Button
                onClick={onShowModalFilter}
                size="large"
                className="md:w-[100px] w-full"
              >
                {tCommon("goBack")}
              </Button>
              <Button
                size="large"
                type="primary"
                onClick={handleFilter}
                className={clsx("md:w-[100px] w-full")}
              >
                {tCommon("confirm")}
              </Button>
            </div>
          </div>
        )}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col pb-3 border-b border-b-neutral-200 gap-2">
            <p className="text-base font-medium">{t("table.rating")}</p>
            <Select
              placeholder="Rating"
              size="large"
              value={filter.rating as string}
              onChange={onSelectFilter}
              options={[
                {
                  value: "5",
                  name: "rating",
                  label: "5",
                },
                {
                  value: "4",
                  name: "rating",
                  label: "4",
                },
                {
                  value: "3",
                  name: "rating",
                  label: "3",
                },
                {
                  value: "2",
                  name: "rating",
                  label: "2",
                },
                {
                  value: "1",
                  name: "rating",
                  label: "1",
                },
              ]}
            />
          </div>
          <div className="flex flex-col pb-3 border-b border-b-neutral-200 gap-2">
            <p className="text-base font-medium">{t("filter.date")}</p>
            <div className="flex items-center gap-2">
              <DatePicker
                value={filter.fromDate ? dayjs(filter.fromDate) : ""}
                onChange={(_, dateString) =>
                  onSelectDate(dateString as string, "fromDate")
                }
                className="!py-2 !rounded-xl"
              />
              <DatePicker
                value={filter.toDate ? dayjs(filter.toDate) : ""}
                onChange={(_, dateString) =>
                  onSelectDate(dateString as string, "toDate")
                }
                className="!py-2 !rounded-xl"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default memo(RatingTable);
