import {
  Button,
  Table,
  TableColumnsType,
  Tabs,
  TabsProps,
  message,
} from "antd";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { ChangeEvent, memo, useEffect, useMemo, useState } from "react";
import { useRouter } from "~/navigation";
import { FaBan, FaCheck } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { CiFilter } from "react-icons/ci";
import { FiLayout } from "react-icons/fi";

import {
  activeCollection,
  disableCollection,
  merchantReviewCollection,
} from "~/api-client/collection";

import { ModalConfirm } from "~/components/Modal";

import { ECollectionStatus } from "~/enum";
import { ICollectionTable, ICollectionAction, IPagination } from "~/interface";

import { NO_IMAGE } from "~/commons/image";
import { initPagination } from "~/commons/pagination";
import { formatBigNumber } from "~/helper/format";
import MESSAGE_ERROR from "~/commons/error";
import Link from "next/link";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import Search from "~/components/Search";
import { BtnExcel } from "~/components/Button";

interface Props {
  items: ICollectionTable[];
  pagination?: IPagination;
  statusParam?: string | null;
  loading?: boolean;
  search: string;
  onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeTab: (key: ECollectionStatus | string) => void;
  onPagination?: (nextPage: number, pageSize: number) => void;
}

const CollectionTable = (props: Props) => {
  const {
    items,
    pagination = initPagination,
    loading = false,
    statusParam = ECollectionStatus.ALL,
    search = "",
    onChangeSearch,
    onPagination,
    onChangeTab,
  } = props;

  const tCollectionPage = useTranslations("CollectionPage");
  const tCommon = useTranslations("Common");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const [listItem, setListItem] = useState<ICollectionTable[]>([]);
  const [selectCollection, setSelectCollection] =
    useState<ICollectionTable | null>(null);

  const [isOpenEnable, setIsOpenEnable] = useState<boolean>(false);
  const [isOpenDisable, setIsOpenDisable] = useState<boolean>(false);
  const [isMerchantReview, setIsMerchantReview] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const onModalEnable = () => {
    if (isOpenEnable) {
      setSelectCollection(null);
    }

    setIsOpenEnable(!isOpenEnable);
  };

  const onModalMerchant = () => {
    if (isMerchantReview) {
      setSelectCollection(null);
    }

    setIsMerchantReview(!isMerchantReview);
  };

  const onModalDisable = () => {
    if (isOpenDisable) {
      setSelectCollection(null);
    }

    setIsOpenDisable(!isOpenDisable);
  };

  //   handle call api enable collection
  const handleMerchantReview = async (collectionId: string) => {
    if (!collectionId) return;

    try {
      await merchantReviewCollection(collectionId);
      messageApi.success(tSuccess("ok"));

      const newList: ICollectionTable[] = listItem;

      // find index item was selected to update status
      const indexSelectCollection: number = listItem.findIndex(
        (item: ICollectionTable) => item._id === selectCollection?._id,
      );

      if (indexSelectCollection < 0) return;

      // update status for item was selected
      newList[indexSelectCollection] = {
        ...selectCollection,
        status: ECollectionStatus.ADMIN_REVIEW,
        action: {
          id: selectCollection?.action.id,
          status: ECollectionStatus.ADMIN_REVIEW,
        },
      } as ICollectionTable;

      setListItem([...newList]);
    } catch (err) {
      const response = hanldeErrorAxios(err);
      messageApi.error(tError(response.message));
    }

    onModalMerchant();
  };

  //   handle call api enable collection
  const handleEnable = async (collectionId: string) => {
    if (!collectionId) return;

    try {
      await activeCollection(collectionId);
      messageApi.success(tSuccess("ok"));

      const newList: ICollectionTable[] = listItem;

      // find index item was selected to update status
      const indexSelectCollection: number = listItem.findIndex(
        (item: ICollectionTable) => item._id === selectCollection?._id,
      );

      if (indexSelectCollection < 0) return;

      // update status for item was selected
      newList[indexSelectCollection] = {
        ...selectCollection,
        status: ECollectionStatus.LISTED,
        action: {
          id: selectCollection?.action.id,
          status: ECollectionStatus.LISTED,
        },
      } as ICollectionTable;

      setListItem([...newList]);
    } catch (err) {
      const response = hanldeErrorAxios(err);
      messageApi.error(tError(response.message));
    }

    onModalEnable();
  };

  //   handle call api disable collection
  const handleDisable = async (collectionId: string) => {
    try {
      await disableCollection(collectionId);
      messageApi.success(tSuccess("ok"));

      const newList: ICollectionTable[] = listItem;

      // find index item was selected to update status
      const indexSelectCollection: number = listItem.findIndex(
        (item: ICollectionTable) => item._id === selectCollection?._id,
      );

      if (indexSelectCollection < 0) return;

      // find index item was selected to update status
      newList[indexSelectCollection] = {
        ...selectCollection,
        status: ECollectionStatus.UNLISTED,
        action: {
          id: selectCollection?.action.id,
          status: ECollectionStatus.UNLISTED,
        },
      } as ICollectionTable;
      setListItem([...newList]);
    } catch (err) {
      const response = hanldeErrorAxios(err);
      messageApi.error(tError(response.message));
      if (response.message === "HAVE_SOME_OWNED_NFTs") {
        messageApi.error(tError(response.message));
      } else {
        messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }
    }

    onModalDisable();
  };

  // Data of tabs
  const tabs: TabsProps["items"] = useMemo(() => {
    return [
      {
        key: ECollectionStatus.ALL,
        label: tCollectionPage("all"),
      },
      {
        key: ECollectionStatus.LISTED,
        label: tCollectionPage("process"),
      },
      {
        key: ECollectionStatus.UNLISTED,
        label: tCollectionPage("cancel"),
      },
    ];
  }, []);

  // columnt table
  const columns: TableColumnsType<ICollectionTable> = useMemo(() => {
    return [
      {
        width: 100,
        title: tCollectionPage("table.avartar"),
        dataIndex: "coverImage",
        className: "cursor-pointer",
        render: (avartar: string) => (
          <img
            className="w-14 h-14 min-w-14 rounded-lg object-cover object-center"
            onError={(e) => (e.currentTarget.src = NO_IMAGE)}
            src={avartar}
            alt="avartar"
            title="avartar"
          />
        ),
      },
      {
        width: 100,
        title: tCollectionPage("table.thumbnail"),
        dataIndex: "image",
        className: "cursor-pointer",
        render: (thumbnail: string) => (
          <img
            className="w-14 h-14 min-w-14 rounded-lg object-cover object-center"
            onError={(e) => (e.currentTarget.src = NO_IMAGE)}
            src={thumbnail}
            alt="thumbnail"
            title="thumbnail"
          />
        ),
      },
      {
        title: tCollectionPage("table.project"),
        dataIndex: "project",
        className: "cursor-pointer",
        render: ({ name, id }: { name: string; id: string }) => {
          if (name && id) {
            return (
              <Link
                href={`/product/projects/${id}`}
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
        title: tCollectionPage("table.name"),
        dataIndex: "name",
        className: "cursor-pointer",
        render: (name: string) => (
          <span>{name ? name : tCommon("update")}</span>
        ),
      },
      {
        title: tCollectionPage("table.description"),
        dataIndex: "description",
        className: "cursor-pointer",
        render: (value: string) => (
          <p className="min-w-[300px] line-clamp-3">
            {value ? value : tCommon("update")}
          </p>
        ),
        width: 200,
      },
      {
        title: tCollectionPage("table.quantity"),
        dataIndex: "quantityOfNFT",
        render: (value: number) => (
          <span className="whitespace-nowrap">
            {value >= 0 ? formatBigNumber(Number(value)) : tCommon("update")}
          </span>
        ),
      },
      // {
      //   title: tCollectionPage("table.price"),
      //   dataIndex: "publicPrice",
      //   render: (value: number) => (
      //     <span className="whitespace-nowrap">
      //       {value ? value : tCommon("update")}
      //     </span>
      //   ),
      // },
      // {
      //   title: tCollectionPage("table.total"),
      //   dataIndex: "total",
      //   render: (value: number) => (
      //     <span className="whitespace-nowrap">
      //       {value ? value : tCommon("update")}
      //     </span>
      //   ),
      // },
      // {
      //   title: tCollectionPage("table.date"),
      //   dataIndex: "publicDate",
      //   render: (value: string) => (
      //     <span className="whitespace-nowrap">
      //       {value ? value : tCommon("update")}
      //     </span>
      //   ),
      // },
      {
        title: tCollectionPage("table.status"),
        dataIndex: "status",
        render: (status: ECollectionStatus) => (
          <p className="flex items-center whitespace-nowrap text-sm gap-2">
            <span
              className={clsx(
                "min-w-2 w-2 h-2 rounded-full",
                {
                  "bg-green-300": status === ECollectionStatus.LISTED,
                },
                {
                  "bg-yellow-400":
                    status === ECollectionStatus.MERCHANT_REVIEW ||
                    status === ECollectionStatus.ADMIN_REVIEW,
                },
                {
                  "bg-neutral-300": status === ECollectionStatus.UNLISTED,
                },
              )}
            ></span>
            {/* content for each status of collection */}
            {status === ECollectionStatus.MERCHANT_REVIEW &&
              tCollectionPage("merchantReview")}
            {status === ECollectionStatus.ADMIN_REVIEW &&
              tCollectionPage("pending")}
            {status === ECollectionStatus.LISTED && tCollectionPage("process")}
            {status === ECollectionStatus.UNLISTED && tCollectionPage("cancel")}
          </p>
        ),
      },
      {
        title: tCollectionPage("table.action"),
        dataIndex: "action",
        render: (data: ICollectionAction, record: ICollectionTable) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={() => router.push(`/product/collections/${data.id}`)}
              icon={<GoPencil className="text-lg" />}
              size="middle"
            />

            {data.status !== ECollectionStatus.LISTED && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();

                  setSelectCollection(record);

                  if (data.status === ECollectionStatus.MERCHANT_REVIEW) {
                    onModalMerchant();
                    return;
                  }

                  onModalEnable();
                }}
                icon={<FaCheck className="text-lg" />}
                size="middle"
              />
            )}

            {data.status === ECollectionStatus.LISTED && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();

                  setSelectCollection(record);
                  onModalDisable();
                }}
                icon={<FaBan className="text-lg" />}
                size="middle"
              />
            )}
          </div>
        ),
        align: "center",
      },
    ];
  }, []);

  useEffect(() => {
    setListItem(items);
  }, [items]);

  return (
    <div className="bg-white p-5 rounded-md">
      {/* Header */}
      <div className="flex items-start lg:flex-row flex-col-reverse justify-between">
        <Tabs
          activeKey={statusParam as ECollectionStatus}
          items={tabs}
          onChange={onChangeTab}
        />
        <div className="lg:w-fit w-full">
          <div className="w-full flex items-center lg:justify-start justify-between gap-3">
            <BtnExcel type="primary" size="large">
              {tCommon("exportExcel")}
            </BtnExcel>

            <div className="flex items-center gap-3">
              <div className="sm:block hidden">
                <Search
                  allowClear={true}
                  value={search}
                  onChange={onChangeSearch}
                  placeholder={tCommon("placeholder.search")}
                  size="large"
                  className="inp__search !w-[320px]"
                />
              </div>

              <Button icon={<CiFilter className="text-xl" />} size="large" />
              <Button icon={<FiLayout className="text-xl" />} size="large" />
            </div>
          </div>

          <div className="sm:hidden block w-full pt-5">
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
          pagination={{
            total: pagination.total,
            pageSize: pagination.take,
            current: pagination.page,
            showSizeChanger: true,
            onChange: (nextPage, newPageSize) => {
              if (onPagination) {
                onPagination(nextPage, newPageSize);
              }
            },
            position: ["bottomLeft"],
            locale: {
              items_per_page: `/ ${tCommon("pagination.page") as string}`,
            },
          }}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                router.push(`/product/collections/${record._id}`);
              },
            };
          }}
        />

        {/* Modal Active Collection */}
        <ModalConfirm
          title="Niêm yết bộ sưu tập"
          subtitle="Bạn muốn niêm yết bộ sưu tập này?"
          open={isOpenEnable}
          type="info"
          description="*Lưu ý: Niêm yết tất cả NFT của bộ sưu tập lên sàn"
          onCancel={onModalEnable}
          onOk={() => handleEnable(selectCollection?._id as string)}
          okText={tCommon("confirm")}
          cancelText={tCommon("goBack")}
          okButtonProps={{
            size: "large",
            className: clsx("md:w-[100px] w-1/2 !bg-primary-200"),
          }}
          cancelButtonProps={{
            className: "md:w-[100px] w-1/2",
            size: "large",
          }}
          destroyOnClose={true}
        />

        {/* Modal Disable Collection */}
        <ModalConfirm
          title="Hủy niêm yết bộ sưu tập"
          subtitle="Bạn muốn hủy niêm yết bộ sưu tập này?"
          open={isOpenDisable}
          type="danger"
          description="*Lưu ý: Hủy niêm yết tất cả các NFT của Bộ sưu tập, không thể thực hiện giao dịch"
          onCancel={onModalDisable}
          onOk={() => handleDisable(selectCollection?._id as string)}
          okText={tCommon("confirm")}
          cancelText={tCommon("goBack")}
          okButtonProps={{
            size: "large",
            className: clsx("md:w-[100px] w-1/2 !bg-[#F0A328]"),
          }}
          cancelButtonProps={{
            className: "md:w-[100px] w-1/2",
            size: "large",
          }}
          destroyOnClose={true}
        />

        {/* Modal Merchant Review Collection */}
        <ModalConfirm
          title="Yêu cầu duyệt bộ sưu tập"
          subtitle="Bạn muốn yêu cầu duyệt bộ sưu tập này?"
          open={isMerchantReview}
          type="info"
          onCancel={onModalMerchant}
          onOk={() => handleMerchantReview(selectCollection?._id as string)}
          okText={tCommon("confirm")}
          cancelText={tCommon("goBack")}
          okButtonProps={{
            size: "large",
            className: clsx("md:w-[100px] w-1/2 !bg-primary-200"),
          }}
          cancelButtonProps={{
            className: "md:w-[100px] w-1/2",
            size: "large",
          }}
          destroyOnClose={true}
        />

        {/* message Antd */}
        {contextHolder}
      </div>
    </div>
  );
};

export default memo(CollectionTable);
