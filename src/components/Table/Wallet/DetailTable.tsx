import {
  Button,
  DatePicker,
  Modal,
  Pagination,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import { useTranslations } from "next-intl";
import {
  ChangeEvent,
  Fragment,
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import dayjs from "dayjs";

import { EOrderType, ETransactionStatus, ETransactionType } from "~/enum";
import { IPagination } from "~/interface";

import { initPagination } from "~/commons/pagination";
import { formatDate } from "~/helper/dateTime";
import ShowTotal from "~/components/Pagination/ShowTotal";
import clsx from "clsx";
import Copy from "~/components/Copy";
import {
  ISearchTransaction,
  ITableTransaction,
  ITransaction,
} from "~/interface/transaction";
import { formatBigNumber } from "~/helper/format";
import { getTransaction } from "~/api-client/transaction";
import Search from "~/components/Search";

interface Props {
  items: ITableTransaction[];
  pagination?: IPagination;
  loading?: boolean;
  search: string;
  paramater: ISearchTransaction;
  onFilter: (newParam: ISearchTransaction) => void;
  onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onPagination?: (nextPage: number, pageSize: number) => void;
  onSortDate: (order: EOrderType) => void;
}

// eslint-disable-next-line no-unused-vars
const styleStatusTransaction: { [x in Partial<ETransactionStatus>]: string } = {
  [ETransactionStatus.SUCCESS]: "text-support-success-200 bg-[#DCFFEA]",
  [ETransactionStatus.PENDING]: "text-support-warn-200 bg-[#FFFCDC]",
  [ETransactionStatus.FAILED]: "text-support-error-200 bg-[#FFDCDC]",
  [ETransactionStatus.CANCEL]: "text-support-error-200 bg-[#FFDCDC]",
  [ETransactionStatus.ALL]: "",
};

const WalletDetailTable = (props: Props) => {
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

  const tWallet = useTranslations("WalletDetailPage");
  const tFilter = useTranslations("Filter");
  const tCommon = useTranslations("Common");
  const tTransaction = useTranslations("Transaction");

  const [listItem, setListItem] = useState<ITableTransaction[]>([]);
  const [transaction, setTransaction] = useState<ITransaction | null>(null);

  const [filter, setFilter] = useState<{
    // eslint-disable-next-line no-unused-vars
    [x in keyof Partial<ISearchTransaction>]: string | number;
  }>({});

  const [modalFilter, setModalFilter] = useState(false);
  const [isShowTransaction, setIsShowTransaction] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const typeOfTransaction: { [key in Partial<ETransactionType>]: any } = {
    [ETransactionType.DEPOSIT]: {
      title: tCommon("transaction.deposit"),
      icons: "/icons/transaction/wallet.png",
    },
    [ETransactionType.WITHDRAW]: {
      title: tCommon("transaction.withdraw"),
      icons: "/icons/transaction/withdraw.png",
    },
    [ETransactionType.BUY]: {
      title: tCommon("transaction.buy"),
      icons: "/icons/transaction/buy.png",
    },
    [ETransactionType.TRANSFER]: {
      title: tCommon("transaction.sell"),
      icons: "/icons/transaction/sell.png",
    },
    [ETransactionType.ALL]: undefined,
    [ETransactionType.REFUND]: undefined,
  };

  // columnt table
  const columns: TableColumnsType<ITableTransaction> = useMemo(() => {
    return [
      {
        title: tWallet("table.id"),
        dataIndex: "id",
        render: (id: string) => (
          <span
            className="block whitespace-nowrap hover:text-shade-50 cursor-pointer font-medium"
            onClick={() => handleGetTransaction(id)}
          >
            {id}
          </span>
        ),
        align: "center",
      },
      {
        title: tWallet("table.createdAt"),
        dataIndex: "createdAt",
        render: (createdAt: string) => (
          <p className="whitespace-nowrap font-medium">
            {formatDate(createdAt)}
          </p>
        ),
        align: "center",
      },
      {
        title: tWallet("table.type"),
        dataIndex: "type",
        render: (type: ETransactionType) => (
          <p className="whitespace-nowrap font-medium">
            {/* type deposit */}
            {type === ETransactionType.DEPOSIT &&
              tCommon("transaction.deposit")}

            {/* type withdraw */}
            {type === ETransactionType.WITHDRAW &&
              tCommon("transaction.withdraw")}

            {/* type buy */}
            {type === ETransactionType.BUY && tCommon("transaction.buy")}

            {/* type sell */}
            {type === ETransactionType.TRANSFER && tCommon("transaction.sell")}
          </p>
        ),
        align: "center",
      },
      {
        title: tWallet("table.from"),
        dataIndex: "from",
        render: (name: string) => (
          <span className="whitespace-nowrap font-medium">
            {name ? name : "Chưa cập nhật"}
          </span>
        ),
        align: "center",
      },
      {
        title: tWallet("table.total"),
        dataIndex: "total",
        render: ({
          value,
          type,
        }: {
          value: string;
          type: ETransactionType;
        }) => (
          <span
            className={clsx("whitespace-nowrap font-medium", [
              type === ETransactionType.DEPOSIT
                ? "text-support-success-200"
                : "text-support-error-200",
            ])}
          >
            {value ? formatBigNumber(Number(value)) : "Chưa cập nhật"}
          </span>
        ),
        align: "center",
      },
      {
        title: tWallet("table.fee"),
        dataIndex: "fee",
        render: (fee: number) => (
          <span className="whitespace-nowrap font-medium">
            {Number(fee) > 0
              ? formatBigNumber(Number(fee))
              : tCommon("transaction.free")}
          </span>
        ),
        align: "center",
      },
      {
        title: tWallet("table.to"),
        dataIndex: "to",
        render: (name: string) => (
          <span className="whitespace-nowrap font-medium">
            {name ? name : "Chưa cập nhật"}
          </span>
        ),
        align: "center",
      },
      {
        title: tWallet("table.description"),
        dataIndex: "desc",
        render: (desc: string) => (
          <span className="whitespace-nowrap font-medium">
            {desc ? desc : "Chưa cập nhật"}
          </span>
        ),
        align: "center",
      },
    ];
  }, [listItem]);

  const handleGetTransaction = async (transactionId: string) => {
    if (!transactionId) return;

    await getTransaction(transactionId).then((payload: ITransaction) => {
      if (payload) {
        setTransaction(payload);
        onShowModaltransaction();
      }
    });
  };

  const onSelectFilter = (value: string, option: any) => {
    const name: keyof ISearchTransaction = option.name;

    setFilter({ ...filter, [name]: value });
  };

  const onSelectDate = (dateString: string, name: keyof ISearchTransaction) => {
    setFilter({ ...filter, [name]: dateString });
  };

  const handleFilter = () => {
    const newParam = {
      ...paramater,
      ...filter,
      page: 1,
      search: "",
    } as ISearchTransaction;

    onFilter(newParam);
    onShowModalFilter();
  };

  const onClearFilter = () => {
    const newParam = {
      order: EOrderType.DESC,
      take: paramater.take,
      page: 1,
      search: "",
      status: ETransactionStatus.ALL,
      transactionType: ETransactionType.ALL,
      walletId: paramater.walletId,
    } as ISearchTransaction;

    onFilter(newParam);
    onShowModalFilter();

    setFilter({});
  };

  const onShowModalFilter = () => {
    setModalFilter(!modalFilter);
  };

  const onShowModaltransaction = () => {
    if (isShowTransaction && transaction) {
      setTransaction(null);
    }

    setIsShowTransaction(!isShowTransaction);
  };

  useEffect(() => {
    setListItem(items);
  }, [items]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start lg:flex-row flex-col justify-between pb-5 pt-10 gap-5">
        <div className="lg:w-4/12 w-full">
          <h2 className="md:text-2xl sm:text-xl text-lg font-semibold text-shade-50">
            {tWallet("title")}
          </h2>
        </div>
        <div className="lg:w-fit w-full">
          <div className="w-full flex items-center lg:justify-start justify-between gap-3">
            <div className="flex items-center md:w-fit md:flex-nowrap md:flex-row flex-col-reverse w-full flex-wrap gap-3">
              <div className="md:block hidden">
                <Search
                  allowClear={true}
                  value={search}
                  onChange={onChangeSearch}
                  placeholder={tCommon("placeholder.search")}
                  size="large"
                  className="inp__search !w-[320px] bg-[#F9FBFF]"
                />
              </div>

              <Select
                placeholder="Chọn lọc"
                size="large"
                className="md:w-[200px] w-full"
                value={paramater.order}
                onChange={(value) => onSortDate(value)}
                options={[
                  { value: EOrderType.DESC, label: tFilter("newest") },
                  { value: EOrderType.ASC, label: tFilter("oldest") },
                ]}
              />

              <div className="md:w-fit w-full flex items-center gap-3">
                <Button
                  className="!flex items-center justify-center font-medium !bg-shade-50 !text-white md:w-fit w-full"
                  icon={<CiFilter className="text-xl" />}
                  size="large"
                  onClick={onShowModalFilter}
                >
                  {tFilter("title")}
                </Button>

                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size="large"
                  className="md:w-fit w-full"
                >
                  {tCommon("exportExcel")}
                </Button>
              </div>
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
      <div className="scrollHidden bg-white rounded-lg overflow-x-auto">
        <Table
          columns={columns}
          dataSource={listItem}
          loading={loading}
          pagination={false}
        />

        <div className="flex items-center justify-between p-5">
          {pagination.total > 0 && (
            <Fragment>
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
            </Fragment>
          )}
        </div>
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
            <p className="text-base font-medium">{tWallet("platform")}</p>
            <Select
              placeholder="Chọn loại giao dịch"
              size="large"
              value={filter.transactionType as string}
              onChange={onSelectFilter}
              options={[
                {
                  value: ETransactionType.BUY,
                  name: "transactionType",
                  label: tCommon("transaction.buy"),
                },
                {
                  value: ETransactionType.TRANSFER,
                  name: "transactionType",
                  label: tCommon("transaction.sell"),
                },
                {
                  value: ETransactionType.DEPOSIT,
                  name: "transactionType",
                  label: tCommon("transaction.deposit"),
                },
                {
                  value: ETransactionType.WITHDRAW,
                  name: "transactionType",
                  label: tCommon("transaction.withdraw"),
                },
                {
                  value: ETransactionType.ALL,
                  name: "transactionType",
                  label: tCommon("transaction.all"),
                },
              ]}
            />
          </div>
          <div className="flex flex-col pb-3 border-b border-b-neutral-200 gap-2">
            <p className="text-base font-medium">{tWallet("filter.date")}</p>
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

      {/* Modal detail transaction */}
      <Modal
        centered={true}
        open={!!transaction && isShowTransaction}
        onCancel={onShowModaltransaction}
        destroyOnClose={true}
        closeIcon={false}
        footer={false}
        width={800}
        classNames={{
          content: "!p-0 !rounded-lg !overflow-hidden",
        }}
      >
        {transaction && (
          <Fragment>
            <div className="flex items-center justify-center py-3 px-5 bg-shade-50 gap-5">
              <img
                src={typeOfTransaction[transaction.transactionType].icons}
                alt="icon of transaction"
                className="w-12 h-12 object-contain"
              />

              <h3 className="md:text-2xl sm:text-xl text-lg font-bold text-center text-white">
                {typeOfTransaction[transaction.transactionType].title}
              </h3>
            </div>

            <div className="w-3/4 px-5 mx-auto">
              {/* header */}
              <div className="py-5 border-b border-b-neutral-300">
                <h4
                  className={clsx(
                    "md:text-4xl sm:text-3xl text-2xl font-bold text-center",
                    [
                      transaction.transactionType === ETransactionType.BUY ||
                      transaction.transactionType === ETransactionType.WITHDRAW
                        ? "text-support-error-200"
                        : "text-support-success-200",
                    ],
                  )}
                >
                  {transaction.transactionType === ETransactionType.BUY ||
                  transaction.transactionType === ETransactionType.WITHDRAW
                    ? "-"
                    : "+"}
                  {formatBigNumber(Number(transaction?.amount))} Tini
                </h4>

                <p className="md:text-base text-sm font-medium text-neutral-1300 text-center">
                  {formatDate(transaction?.createdAt)}
                </p>
              </div>

              {/* content */}
              <div className="flex flex-col py-5 border-b border-b-neutral-300 gap-6">
                {/* status of transaction */}
                <div className="flex items-center gap-5">
                  <p className="md:text-lg text-base font-normal text-neutral-1500 min-w-[140px]">
                    {tWallet("status")}
                  </p>

                  <h3
                    className={clsx("text-sm py-1 px-6 rounded-lg", [
                      styleStatusTransaction[
                        transaction.status as ETransactionStatus
                      ],
                    ])}
                  >
                    {/* status when success */}
                    {transaction.status === ETransactionStatus.SUCCESS &&
                      tTransaction("success")}

                    {/* status when pending */}
                    {transaction.status === ETransactionStatus.PENDING &&
                      tTransaction("pending")}

                    {/* status when failed */}
                    {transaction.status === ETransactionStatus.FAILED &&
                      tTransaction("failed")}

                    {/* status when cancle */}
                    {transaction.status === ETransactionStatus.CANCEL &&
                      tTransaction("cancel")}
                  </h3>
                </div>

                {/* ID of transaction */}
                <div className="flex items-center gap-5">
                  <p className="md:text-lg text-base font-normal text-neutral-1500 min-w-[140px]">
                    {tWallet("table.id")}
                  </p>

                  <h3 className="md:text-xl text-lg font-bold text-primary-1200">
                    {transaction._id}
                  </h3>

                  <Copy value={transaction._id} className="ml-auto" />
                </div>

                {transaction.transactionType === ETransactionType.BUY && (
                  <Fragment>
                    {/* project of transaction */}
                    <div className="flex items-center gap-5">
                      <p className="md:text-lg text-base font-normal text-neutral-1500 min-w-[140px]">
                        {tWallet("table.project")}
                      </p>

                      <h3 className="md:text-xl text-lg font-bold text-primary-1200">
                        Project 1
                      </h3>
                    </div>

                    {/* Collection of transaction */}
                    <div className="flex items-center gap-5">
                      <p className="md:text-lg text-base font-normal text-neutral-1500 min-w-[140px]">
                        {tWallet("table.collection")}
                      </p>

                      <h3 className="md:text-xl text-lg font-bold text-primary-1200">
                        Collection 1
                      </h3>
                    </div>

                    {/* Total NFT of transaction */}
                    <div className="flex items-center gap-5">
                      <p className="md:text-lg text-base font-normal text-neutral-1500 min-w-[140px]">
                        {tWallet("table.totalNft")}
                      </p>

                      <h3 className="md:text-xl text-lg font-bold text-primary-1200">
                        10
                      </h3>
                    </div>
                  </Fragment>
                )}

                {/* From of transaction */}
                <div className="flex items-center gap-5">
                  <p className="md:text-lg text-base font-normal text-neutral-1500 min-w-[140px]">
                    {tWallet("table.from")}
                  </p>

                  <h3 className="md:text-xl text-lg font-bold text-primary-1200">
                    {transaction.fromSource}
                  </h3>
                </div>

                {/* To of transaction */}
                <div className="flex items-center gap-5">
                  <p className="md:text-lg text-base font-normal text-neutral-1500 min-w-[140px]">
                    {tWallet("table.to")}
                  </p>

                  <h3 className="md:text-xl text-lg font-bold text-primary-1200">
                    {transaction.toDestination}
                  </h3>
                </div>

                {/* Fee of transaction */}
                <div className="flex items-center gap-5">
                  <p className="md:text-lg text-base font-normal text-neutral-1500 min-w-[140px]">
                    {tWallet("table.fee")}
                  </p>

                  <h3 className="md:text-xl text-lg font-bold text-primary-1200">
                    {Number(transaction.transactionFee) > 0
                      ? formatBigNumber(Number(transaction.transactionFee))
                      : tCommon("transaction.free")}
                  </h3>
                </div>
              </div>

              {transaction.transactionDescription && (
                <div className="py-5">
                  {/* description of transaction */}
                  <div className="flex items-center gap-5">
                    <p className="md:text-lg text-base font-normal text-neutral-1500 min-w-[140px]">
                      {tWallet("table.description")}
                    </p>

                    <h3 className="md:text-xl text-lg font-bold text-primary-1200">
                      {transaction.transactionDescription}
                    </h3>
                  </div>
                </div>
              )}

              <button
                onClick={onShowModaltransaction}
                className="block md:text-xl text-lg font-bold text-shade-50 py-5 mx-auto"
              >
                {tWallet("otherTransaction")}
              </button>
            </div>
          </Fragment>
        )}
      </Modal>
    </div>
  );
};

export default memo(WalletDetailTable);
