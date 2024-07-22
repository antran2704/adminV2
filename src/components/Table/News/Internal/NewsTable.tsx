import { ChangeEvent, memo, useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  message,
  Modal,
  Select,
  Switch,
  Table,
  TableColumnsType,
} from "antd";
import { useTranslations } from "next-intl";
import { SearchOutlined } from "@ant-design/icons";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import clsx from "clsx";

import { INewsInternalTable, IPagination, ISearchNews } from "~/interface";

import { NO_IMAGE } from "~/commons/image";
import { Link, useRouter } from "~/navigation";
import { initPagination } from "~/commons/pagination";
import { EOrderType } from "~/enum";

import { formatDate } from "~/helper/dateTime";
import { activeNews, deleteNews, disableNews } from "~/api-client/news";
import { FaTrash } from "react-icons/fa";
import ModalConfirm from "~/components/Modal/Confirm";

interface Props {
  items: INewsInternalTable[];
  pagination?: IPagination;
  loading?: boolean;
  search: string;
  paramater: ISearchNews;
  getData: (query: ISearchNews) => void;
  onFilter: (newParam: ISearchNews) => void;
  onSortDate: (order: EOrderType) => void;
  onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onPagination?: (nextPage: number, pageSize: number) => void;
}

const NewsTable = (props: Props) => {
  const {
    items,
    pagination = initPagination,
    loading = false,
    search = "",
    paramater,
    getData,
    onFilter,
    onSortDate,
    onChangeSearch,
    onPagination,
  } = props;

  const router = useRouter();

  const t = useTranslations("NewsPage");
  const tFilter = useTranslations("Filter");
  const tCommon = useTranslations("Common");
  const tSuccess = useTranslations("Success");
  const tError = useTranslations("Error");

  const [messageApi, contextHolder] = message.useMessage();

  const [listItem, setListItem] = useState<INewsInternalTable[]>([]);

  const [selectDelete, setSelectDelete] = useState<string | null>(null);

  const [filter, setFilter] = useState<{
    // eslint-disable-next-line no-unused-vars
    [x in keyof Partial<ISearchNews>]: string | number;
  }>({});

  const [modalFilter, setModalFilter] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const updateList = (
    record: INewsInternalTable,
    newData: Partial<INewsInternalTable>,
  ) => {
    const newItems = [...listItem];

    newItems[record.key as number] = { ...record, ...newData };
    setListItem(newItems);
  };

  const onActive = async (newsId: string, record: INewsInternalTable) => {
    if (!newsId) return;

    try {
      await activeNews(newsId);
      updateList(record, { status: true });
      messageApi.success(tSuccess("ok"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onDisable = async (newsId: string, record: INewsInternalTable) => {
    if (!newsId) return;

    try {
      await disableNews(newsId);
      updateList(record, { status: false });
      messageApi.success(tSuccess("ok"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onDelete = async (newsId: string) => {
    if (!newsId) return;
    setLoadingDelete(true);

    try {
      await deleteNews(newsId);
      setSelectDelete(null);
      onShowModalDelete();
      getData(paramater);
      messageApi.success(tSuccess("delete"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
    setLoadingDelete(false);
  };

  // columnt table
  const columns: TableColumnsType<INewsInternalTable> = useMemo(() => {
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
        title: t("table.thumbnail"),
        dataIndex: "thumbnail",
        className: "cursor-pointer",
        render: (image: string) => (
          <img
            onError={(e) => (e.currentTarget.src = NO_IMAGE)}
            className="w-[150px] min-w-[150px] h-[150px] rounded-lg object-cover object-center"
            src={image}
            alt="thumbnail"
            title="thumbnail"
          />
        ),
      },
      {
        title: t("table.title"),
        dataIndex: "title",
        className: "cursor-pointer",
        render: (value: string) => (
          <span className="line-clamp-2">
            {value ? value : tCommon("update")}
          </span>
        ),
        width: 400,
      },
      {
        title: t("table.description"),
        dataIndex: "description",
        className: "cursor-pointer",
        render: (value: string) => (
          <span className="line-clamp-3">
            {value ? value : tCommon("update")}
          </span>
        ),
        width: 400,
      },
      {
        title: t("table.status"),
        dataIndex: "status",
        render: (value: boolean, record: INewsInternalTable) => (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Switch
              value={value}
              onClick={(e) => {
                if (value) {
                  onDisable(record.id, record);
                } else {
                  onActive(record.id, record);
                }
              }}
            />
          </div>
        ),
      },
      {
        title: t("table.createdAt"),
        dataIndex: "createdAt",
        render: (value: string) => (
          <span className="line-clamp-3">
            {value ? formatDate(value) : tCommon("update")}
          </span>
        ),
      },
      {
        title: t("table.action"),
        dataIndex: "action",
        render: (_, record: INewsInternalTable) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/news/${record.id}/internal`);
              }}
              icon={<GoPencil className="text-lg" />}
              size="middle"
            />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setSelectDelete(record.id);
                onShowModalDelete();
              }}
              className="hover:!bg-red-200 hover:!text-white hover:!border-none"
              icon={<FaTrash className="text-lg" />}
              size="middle"
            />
          </div>
        ),
      },
    ];
  }, [listItem]);

  const onSelectFilter = (value: string, option: any) => {
    const name: keyof ISearchNews = option.name;

    setFilter({ ...filter, [name]: value });
  };

  const handleFilter = () => {
    const newParam = {
      ...paramater,
      ...filter,
      page: 1,
      search: "",
    } as ISearchNews;

    onFilter(newParam);
    onShowModalFilter();
  };

  const onShowModalDelete = () => {
    setModalDelete(!modalDelete);
  };

  const onClearFilter = () => {
    const newParam = {
      order: EOrderType.DESC,
      take: paramater.take,
      page: 1,
      search: "",
    } as ISearchNews;

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
          <h2 className="text-2xl font-semibold text-shade-50">{t("title")}</h2>
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
          onRow={(record: INewsInternalTable) => {
            return {
              onDoubleClick: () => {
                router.push(`/news/${record.id}/internal`);
              },
            };
          }}
        />
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
            <p className="text-base font-medium">{t("filter.status")}</p>
            <Select
              placeholder="Status"
              size="large"
              value={filter.isPublic as string}
              onChange={onSelectFilter}
              options={[
                {
                  value: "true",
                  name: "isPublic",
                  label: t("filter.active"),
                },
                {
                  value: "false",
                  name: "isPublic",
                  label: t("filter.inactive"),
                },
              ]}
            />
          </div>
        </div>
      </Modal>

      {/* Modal delete */}
      <ModalConfirm
        title={t("modalDelete.title")}
        description={t("modalDelete.description")}
        type="error"
        open={modalDelete}
        onCancel={onShowModalDelete}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        onOk={() => onDelete(selectDelete as string)}
        okButtonProps={{
          size: "large",
          className: clsx("md:w-fit w-1/2 !bg-red-200"),
        }}
        cancelButtonProps={{
          className: "md:w-[100px] w-1/2",
          size: "large",
        }}
        destroyOnClose={true}
        confirmLoading={loadingDelete}
      />

      {/* Message of antd */}
      {contextHolder}
    </div>
  );
};

export default memo(NewsTable);
