import {
  Button,
  DatePicker,
  Modal,
  Pagination,
  Select,
  Switch,
  Table,
  TableColumnsType,
} from "antd";
import { useTranslations } from "next-intl";
import { ChangeEvent, memo, useEffect, useMemo, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import dayjs from "dayjs";

import { EOrderType, EWalletStatus, EWalletType } from "~/enum";
import { IPagination } from "~/interface";
import { ISearchWallet, IWalletTable } from "~/interface/wallet";

import { initPagination } from "~/commons/pagination";
import { formatDate } from "~/helper/dateTime";
import ShowTotal from "~/components/Pagination/ShowTotal";
import clsx from "clsx";
import Link from "next/link";
import Search from "~/components/Search";

interface Props {
  items: IWalletTable[];
  pagination?: IPagination;
  loading?: boolean;
  search: string;
  paramater: ISearchWallet;
  onFilter: (newParam: ISearchWallet) => void;
  onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onPagination?: (nextPage: number, pageSize: number) => void;
  onSortDate: (order: EOrderType) => void;
  handleGetData: (paramater: ISearchWallet) => void;
}

const WalletTable = (props: Props) => {
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

  const t = useTranslations("WalletPage");
  const tFilter = useTranslations("Filter");
  const tCommon = useTranslations("Common");

  const [listItem, setListItem] = useState<IWalletTable[]>([]);

  const [filter, setFilter] = useState<{
    // eslint-disable-next-line no-unused-vars
    [x in keyof Partial<ISearchWallet>]: string | number;
  }>({});

  const [modalFilter, setModalFilter] = useState(false);

  // columnt table
  const columns: TableColumnsType<IWalletTable> = useMemo(() => {
    return [
      {
        title: t("table.id"),
        dataIndex: "id",
        render: (id: string) => (
          <Link className="block text-black" href={`/wallets/${id}`}>
            <span className="whitespace-nowrap">{id}</span>
          </Link>
        ),
        align: "center",
      },
      {
        title: t("table.owner"),
        dataIndex: "owner",
        render: (username: string) => (
          <span className="whitespace-nowrap">
            {username ? username : "Chưa cập nhật"}
          </span>
        ),
        align: "center",
      },
      {
        title: t("table.platform"),
        dataIndex: "platform",
        render: (platform: EWalletType) => (
          <span className="whitespace-nowrap">
            {platform === EWalletType.INVESTOR
              ? t("table.investor")
              : t("table.merchant")}
          </span>
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
      {
        title: t("table.status"),
        dataIndex: "status",
        render: () => <Switch defaultChecked />,
        align: "center",
      },
    ];
  }, [listItem]);

  const onSelectFilter = (value: string, option: any) => {
    const name: keyof ISearchWallet = option.name;

    setFilter({ ...filter, [name]: value });
  };

  const onSelectDate = (dateString: string, name: keyof ISearchWallet) => {
    setFilter({ ...filter, [name]: dateString });
  };

  const handleFilter = () => {
    const newParam = {
      ...paramater,
      ...filter,
      page: 1,
      search: "",
    } as ISearchWallet;

    onFilter(newParam);
    onShowModalFilter();
  };

  const onClearFilter = () => {
    const newParam = {
      order: EOrderType.DESC,
      status: EWalletStatus.ALL,
      take: paramater.take,
      walletObject: EWalletType.ALL,
      page: 1,
      search: "",
    } as ISearchWallet;

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
                <Search
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
            <Search
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
            <p className="text-base font-medium">{t("table.platform")}</p>
            <Select
              placeholder="Chọn đối tượng"
              size="large"
              value={filter.walletObject as string}
              onChange={onSelectFilter}
              options={[
                {
                  value: EWalletType.INVESTOR,
                  name: "walletObject",
                  label: t("filter.investor"),
                },
                {
                  value: EWalletType.MERCHANT,
                  name: "walletObject",
                  label: t("filter.merchant"),
                },
                {
                  value: EWalletType.ALL,
                  name: "walletObject",
                  label: t("filter.all"),
                },
              ]}
            />
          </div>
          <div className="flex flex-col pb-3 border-b border-b-neutral-200 gap-2">
            <p className="text-base font-medium">{t("table.status")}</p>
            <Select
              placeholder="Trạng thái"
              size="large"
              value={filter.status as string}
              onChange={onSelectFilter}
              options={[
                {
                  value: EWalletStatus.ACTIVE,
                  name: "status",
                  label: t("filter.active"),
                },
                {
                  value: EWalletStatus.INACTIVE,
                  name: "status",
                  label: t("filter.inactive"),
                },
                {
                  value: EWalletStatus.ALL,
                  name: "status",
                  label: t("filter.all"),
                },
              ]}
            />
          </div>
          <div className="flex flex-col pb-3 border-b border-b-neutral-200 gap-2">
            <p className="text-base font-medium">{t("filter.date")}</p>
            <div className="flex items-center gap-2">
              <DatePicker
                value={filter.startDate ? dayjs(filter.startDate) : ""}
                onChange={(_, dateString) =>
                  onSelectDate(dateString as string, "startDate")
                }
                className="!py-2 !rounded-xl"
              />
              <DatePicker
                value={filter.endDate ? dayjs(filter.endDate) : ""}
                onChange={(_, dateString) =>
                  onSelectDate(dateString as string, "endDate")
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

export default memo(WalletTable);
