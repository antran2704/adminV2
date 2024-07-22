import {
  Button,
  Select,
  Table,
  TableColumnsType,
  Tabs,
  TabsProps,
  message,
} from "antd";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FaTrash } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { CiFilter } from "react-icons/ci";
import { FiLayout } from "react-icons/fi";
import { IoReload } from "react-icons/io5";

import { EOrderType, EPlatform } from "~/enum";
import { IPagination, IParamaterListUser, IUser } from "~/interface";

import {
  deleteUser,
  disableUser,
  enableUser,
  getInfoUser,
} from "~/api-client/permission";

import StatusUser from "~/components/Permisson/Status";
import ModalDeleteUser from "~/components/Permisson/ModalDeleteUser";
import ModalUpdateUser from "~/components/Permisson/ModalUpdateUser";

import MESSAGE_ERROR from "~/commons/error";
import { initPagination } from "~/commons/pagination";
import { formatDate } from "~/helper/dateTime";
import Search from "~/components/Search";
import { BtnExcel } from "~/components/Button";

interface DataType extends IUser {
  key: React.Key;
  action: string;
}

interface Props {
  items: DataType[];
  pagination?: IPagination;
  loading?: boolean;
  search: string;
  paramater: IParamaterListUser;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<React.Key[]>>;
  onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onPagination?: (nextPage: number, pageSize: number) => void;
  onChangeTab: (key: EPlatform | string) => void;
  onSortDate: (order: EOrderType) => void;
  handleGetData: (paramater: IParamaterListUser) => void;
}

const PermissionTable = (props: Props) => {
  const {
    items,
    pagination = initPagination,
    loading = false,
    search = "",
    paramater,
    selectedRowKeys,
    setSelectedRowKeys,
    onChangeSearch,
    onPagination,
    onSortDate,
    onChangeTab,

    handleGetData,
  } = props;

  const t = useTranslations("PermissionPage");
  const tCommon = useTranslations("Common");
  const tFilter = useTranslations("Filter");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const [infoUser, setInfoUser] = useState<IUser | null>(null);
  const [listItem, setListItem] = useState<DataType[]>([]);

  const [selectDelete, setSelectDelete] = useState<string | null>(null);

  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalDeleteMany, setModalDeleteMany] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  // Data of tabs
  const tabs: TabsProps["items"] = useMemo(() => {
    return [
      {
        key: EPlatform.INVESTOR_WEB,
        label: t("investor"),
      },
      {
        key: EPlatform.MERCHANT_WEB,
        label: t("merchant"),
      },
      {
        key: EPlatform.ADMIN_WEB,
        label: t("admin"),
      },
    ];
  }, []);

  // columnt table
  const columns: TableColumnsType<DataType> = useMemo(() => {
    return [
      {
        title: t("table.accountId"),
        dataIndex: "_id",
        render: (userId: string) => (
          <span className="whitespace-nowrap">{userId}</span>
        ),
      },
      {
        title:
          paramater.platform === EPlatform.INVESTOR_WEB
            ? t("table.phoneNumber")
            : "Email",
        dataIndex: "username",
        render: (username: string) => (
          <span className="whitespace-nowrap">
            {username ? username : "Chưa cập nhật"}
          </span>
        ),
      },
      {
        title:
          paramater.platform === EPlatform.MERCHANT_WEB
            ? t("table.companyName")
            : t("table.fullName"),
        dataIndex: "fullName",
        render: (fullname: string) => (
          <span className="whitespace-nowrap">
            {fullname ? fullname : tCommon("update")}
          </span>
        ),
      },
      {
        title: t("table.role"),
        dataIndex: "roles",
        render: (role: string) => (
          <span className="whitespace-nowrap">
            {role ? role : tCommon("update")}
          </span>
        ),
      },
      {
        title: t("table.status"),
        dataIndex: "disabledAccount",
        render: ({ status, userId }: { status: boolean; userId: string }) => (
          <StatusUser
            isCheck={!status}
            userId={userId}
            platform={paramater.platform as EPlatform}
          />
        ),
      },
      {
        title: t("table.createdAt"),
        dataIndex: "createdAt",
        render: (createdAt: string) => (
          <p className="whitespace-nowrap">{formatDate(createdAt)}</p>
        ),
        filterDropdown: () => (
          <ul className="flex flex-col">
            <li
              onClick={() => onSortDate(EOrderType.ASC)}
              className={clsx(
                "text-base px-5 py-2 hover:bg-primary-200 hover:text-white transition-all ease-linear duration-100 cursor-pointer",
                [
                  paramater.order === EOrderType.ASC &&
                    "bg-primary-200 text-white",
                ],
              )}
            >
              {tFilter("newest")}
            </li>
            <li
              onClick={() => onSortDate(EOrderType.DESC)}
              className={clsx(
                "text-base px-5 py-2 hover:bg-primary-200 hover:text-white transition-all ease-linear duration-100 cursor-pointer",
                [
                  paramater.order === EOrderType.DESC &&
                    "bg-primary-200 text-white",
                ],
              )}
            >
              {tFilter("oldest")}
            </li>
          </ul>
        ),
      },
      {
        title: t("table.action"),
        dataIndex: "action",
        render: (userId: string) => (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onShowModalUpdate(userId)}
              icon={<GoPencil className="text-lg" />}
              size="middle"
            />
            <Button
              onClick={() => {
                if (!userId) return;
                setSelectDelete(userId);
                onShowModalDelete();
              }}
              icon={<FaTrash className="text-lg" />}
              size="middle"
            />
            <Button icon={<IoReload className="text-lg" />} size="middle" />
          </div>
        ),
      },
    ];
  }, [listItem]);

  const onShowModalDelete = () => {
    if (modalDelete) {
      setSelectDelete(null);
    }

    setModalDelete(!modalDelete);
  };

  const onShowModalDeleteMany = () => {
    setModalDeleteMany(!modalDeleteMany);
  };

  const onShowModalUpdate = async (userId: string) => {
    if (!userId) return;

    await handleGetInfoUser(userId);
  };

  const onCloseModalUpdate = () => {
    setModalUpdate(false);
    setInfoUser(null);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onEnableSelectUser = async (listId: string[]) => {
    if (!listId.length) return;

    let newListSelect: React.Key[] = [...selectedRowKeys];

    try {
      for (let i = 0; i < listId.length; i++) {
        await enableUser(listId[i], paramater.platform as EPlatform);
        newListSelect.shift();
      }

      messageApi.success(tSuccess("ok"));
    } catch (error) {
      messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }

    handleGetData(paramater);
    setSelectedRowKeys(newListSelect);
  };

  const onDisableSelectUser = async (listId: string[]) => {
    if (!listId.length) return;

    let newListSelect: React.Key[] = [...selectedRowKeys];

    try {
      for (let i = 0; i < listId.length; i++) {
        await disableUser(listId[i], paramater.platform as EPlatform);
        newListSelect.shift();
      }

      messageApi.success(tSuccess("ok"));
    } catch (error) {
      messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }

    handleGetData(paramater);
    setSelectedRowKeys(newListSelect);
  };

  const handleSelect = (value: string) => {
    switch (value) {
      case "delete":
        onShowModalDeleteMany();
        break;

      case "changePassword":
        // onShowModalUpdate();
        break;

      case "enable":
        onEnableSelectUser(selectedRowKeys as string[]);
        break;

      case "disable":
        onDisableSelectUser(selectedRowKeys as string[]);
        break;
    }
  };

  // hanlde get infor user when select edit
  const handleGetInfoUser = async (userId: string) => {
    if (!userId) return;

    try {
      const payload: IUser = await getInfoUser(
        userId,
        paramater.platform as EPlatform,
      );
      setInfoUser(payload);
      setModalUpdate(true);
    } catch (error) {
      messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }
  };

  // handle when delete user
  const onDeleteSelectUser = async (listId: string[]) => {
    if (!listId.length) return;

    let newListSelect: React.Key[] = [...selectedRowKeys];
    try {
      for (let i = 0; i < listId.length; i++) {
        await deleteUser(listId[i], paramater.platform as EPlatform);
        newListSelect.shift();
      }

      messageApi.success(tSuccess("ok"));
    } catch (error) {
      messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }

    onShowModalDeleteMany();
    handleGetData(paramater);
    setSelectedRowKeys(newListSelect);
  };

  // handle when delete user
  const onDeleteUser = async (userId: string) => {
    if (!userId) return;
    try {
      await deleteUser(userId, paramater.platform as EPlatform);

      messageApi.success(tSuccess("ok"));
      onShowModalDelete();
      handleGetData(paramater);
    } catch (error) {
      messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    setListItem(items);
  }, [items]);

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="bg-white p-5 rounded-md">
      {/* Header */}
      <div className="flex items-start lg:flex-row flex-col-reverse justify-between">
        <div className="lg:w-4/12 w-full">
          <Tabs
            defaultActiveKey={paramater.platform || "all"}
            items={tabs}
            onChange={onChangeTab}
          />
        </div>
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
        <div className="flex items-center pb-2 gap-3">
          <span className="text-sm">
            {hasSelected ? `Đã chọn ${selectedRowKeys.length}` : ""}
          </span>

          {hasSelected && (
            <Select
              placeholder="Thao tác hàng loạt"
              size="large"
              style={{ width: 180 }}
              onChange={handleSelect}
              options={[
                { value: "delete", label: "Xóa" },
                { value: "changePassword", label: "Đổi mật khẩu" },
                { value: "enable", label: "Kích hoạt" },
                { value: "disable", label: "Hủy kích hoạt" },
              ]}
            />
          )}
        </div>

        {/* Table show list user */}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={listItem}
          loading={loading}
          pagination={{
            total: pagination.total,
            pageSize: pagination.take,
            current: pagination.page,
            showSizeChanger: true,
            onChange: (nextPage, newPageSize) => {
              if (onPagination) onPagination(nextPage, newPageSize);
            },
            position: ["bottomLeft"],
            locale: {
              items_per_page: `/ ${tCommon("pagination.page") as string}`,
            },
          }}
        />
      </div>

      {/* Modal delete */}
      <ModalDeleteUser
        open={modalDelete}
        onClick={() => onDeleteUser(selectDelete as string)}
        onClose={onShowModalDelete}
      />

      {/* Modal delete many */}
      <ModalDeleteUser
        open={modalDeleteMany}
        onClick={() => onDeleteSelectUser(selectedRowKeys as string[])}
        onClose={onShowModalDeleteMany}
      />

      {/* Modal update info user */}
      <ModalUpdateUser
        platform={paramater.platform as EPlatform}
        user={infoUser}
        open={modalUpdate}
        onClose={onCloseModalUpdate}
        onUpdate={() => handleGetData(paramater)}
      />

      {/* Message of antd */}
      {contextHolder}
    </div>
  );
};

export default memo(PermissionTable);
