import { Button, Table, TableColumnsType, message } from "antd";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState } from "react";
import { FaBan, FaCheck } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { useRouter } from "~/navigation";

import { activeProject, disableProject } from "~/api-client/project";

import { EProductStatus } from "~/enum";
import {
  DataTableProject as DataType,
  IPagination,
  IProjectAction,
  IProjectName,
} from "~/interface";

import { ModalConfirm } from "~/components/Modal";

import { NO_IMAGE } from "~/commons/image";
import { initPagination } from "~/commons/pagination";
import hanldeErrorAxios from "~/helper/handleErrorAxios";

interface Props {
  items: DataType[];
  pagination?: IPagination;
  loading?: boolean;
  onPagination: (nextPage: number, pageSize: number) => void;
}

const ProjectTable = (props: Props) => {
  const {
    items,
    pagination = initPagination,
    loading = false,
    onPagination,
  } = props;
  const t = useTranslations("ProjectPage");
  const tCommon = useTranslations("Common");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const [listItem, setListItem] = useState<DataType[]>([]);
  const [selectProject, setSelectProject] = useState<DataType | null>(null);

  const [isOpenEnable, setIsOpenEnable] = useState<boolean>(false);
  const [isOpenDisable, setIsOpenDisable] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const onModalEnable = () => {
    if (isOpenEnable) {
      setSelectProject(null);
    }

    setIsOpenEnable(!isOpenEnable);
  };

  const onModalDisable = () => {
    if (isOpenDisable) {
      setSelectProject(null);
    }

    setIsOpenDisable(!isOpenDisable);
  };

  //   handle call api enable project
  const handleEnable = async (projectId: string) => {
    if (!projectId) return;

    try {
      await activeProject(projectId);
      messageApi.success(tSuccess("ok"));

      const newList: DataType[] = listItem;

      // find index item was selected to update status
      const indexSelectProject: number = listItem.findIndex(
        (item: DataType) => item.projectId === selectProject?.projectId,
      );

      if (indexSelectProject < 0) return;

      // update status for item was selected
      newList[indexSelectProject] = {
        ...selectProject,
        status: EProductStatus.ENABLE,
        action: {
          id: selectProject?.action.id,
          status: EProductStatus.ENABLE,
        },
      } as DataType;

      setListItem([...newList]);
    } catch (err) {
      const response = hanldeErrorAxios(err);
      messageApi.error(tError(response.message));
    }

    onModalEnable();
  };

  //   handle call api disable project
  const handleDisable = async (projectId: string) => {
    try {
      await disableProject(projectId);
      messageApi.success(tSuccess("ok"));

      const newList: DataType[] = listItem;

      // find index item was selected to update status
      const indexSelectProject: number = listItem.findIndex(
        (item: DataType) => item.projectId === selectProject?.projectId,
      );

      if (indexSelectProject < 0) return;

      // find index item was selected to update status
      newList[indexSelectProject] = {
        ...selectProject,
        status: EProductStatus.DISABLE,
        action: {
          id: selectProject?.action.id,
          status: EProductStatus.DISABLE,
        },
      } as DataType;

      setListItem([...newList]);
    } catch (err) {
      const response = hanldeErrorAxios(err);
      messageApi.error(tError(response.message));
    }

    onModalDisable();
  };

  // columnt table
  const columns: TableColumnsType<DataType> = useMemo(() => {
    return [
      {
        title: t("table.projectId"),
        dataIndex: "projectId",
        className: "cursor-pointer",
        render: (userId: string) => (
          <span className="whitespace-nowrap">{userId}</span>
        ),
      },
      {
        title: t("table.name"),
        dataIndex: "info",
        className: "cursor-pointer",
        render: (data: IProjectName) => (
          <div className="flex items-center gap-3">
            <img
              className="w-14 h-14 min-w-14 rounded-lg object-cover object-center"
              onError={(e) => (e.currentTarget.src = NO_IMAGE)}
              src={data.thumbnail}
              alt="thumbnail"
              title="thumbnail"
            />
            <span className="whitespace-nowrap">
              {data.name ? data.name : "Chưa cập nhật"}
            </span>
          </div>
        ),
      },
      {
        title: t("table.merchant"),
        dataIndex: "merchant",
        className: "cursor-pointer",
        render: (name: string) => (
          <span className="whitespace-nowrap">
            {name ? name : tCommon("update")}
          </span>
        ),
        filters: [
          {
            text: "Joe",
            value: "Joe",
          },
        ],
        filterSearch: true,
      },
      {
        title: t("table.floors"),
        dataIndex: "quantityOfFloor",
        render: (value: number) => (
          <span className="whitespace-nowrap">
            {value >= 0 ? value : tCommon("update")}
          </span>
        ),
      },
      {
        title: t("table.apartments"),
        dataIndex: "quantityOfUnit",
        render: (value: number) => (
          <span className="whitespace-nowrap">
            {value >= 0 ? value : tCommon("update")}
          </span>
        ),
      },
      {
        title: t("table.category"),
        dataIndex: "categories",
        render: (value: string[]) => (
          <span className="whitespace-nowrap">
            {value ? value.join(", ") : tCommon("update")}
          </span>
        ),
      },
      {
        title: t("table.collection"),
        dataIndex: "collection",
        render: (value: string) => (
          <span className="whitespace-nowrap">
            {value ? value : tCommon("update")}
          </span>
        ),
      },
      {
        title: t("table.status"),
        dataIndex: "status",
        render: (status: EProductStatus) => (
          <p className="flex items-center whitespace-nowrap text-sm gap-2">
            <span
              className={clsx(
                "min-w-2 w-2 h-2 rounded-full",
                {
                  "bg-green-300": status === EProductStatus.ENABLE,
                },
                {
                  "bg-yellow-400": status === EProductStatus.IN_ACTIVE,
                },
                {
                  "bg-neutral-300": status === EProductStatus.DISABLE,
                },
              )}
            ></span>
            {status === EProductStatus.ENABLE
              ? t("process")
              : status === EProductStatus.IN_ACTIVE
                ? t("pending")
                : t("cancel")}
          </p>
        ),
      },
      {
        title: t("table.action"),
        dataIndex: "action",
        render: (data: IProjectAction, record: DataType) => (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push(`projects/${data.id}`)}
              icon={<GoPencil className="text-lg" />}
              size="middle"
            />

            {data.status !== EProductStatus.ENABLE && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();

                  setSelectProject(record);
                  onModalEnable();
                }}
                icon={<FaCheck className="text-lg" />}
                size="middle"
              />
            )}

            {data.status === EProductStatus.ENABLE && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectProject(record);
                  onModalDisable();
                }}
                icon={<FaBan className="text-lg" />}
                size="middle"
              />
            )}
          </div>
        ),
      },
    ];
  }, []);

  useEffect(() => {
    setListItem(items);
  }, [items]);

  return (
    <div className="scrollHidden overflow-x-auto">
      {/* Table show list user */}
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
            onPagination(nextPage, newPageSize);
          },
          position: ["bottomLeft"],
          locale: {
            items_per_page: `/ ${tCommon("pagination.page") as string}`,
          },
        }}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              router.push(`/product/projects/${record.projectId}`);
            },
          };
        }}
      />

      {/* Modal Active Project */}
      <ModalConfirm
        title="Niêm yết dự án"
        subtitle="Bạn muốn niêm yết này?"
        open={isOpenEnable}
        type="info"
        description="*Lưu ý: Niêm yết tất cả bộ sưu tập của dự án lên sàn"
        onCancel={onModalEnable}
        onOk={() => handleEnable(selectProject?.projectId as string)}
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

      {/* Modal Disable Project */}
      <ModalConfirm
        title="Hủy niêm yết dự án"
        subtitle="Bạn muốn hủy niêm yết dự án này?"
        open={isOpenDisable}
        type="danger"
        description="*Lưu ý: Hủy niêm yết tất cả các NFT của dự án, không thể thực hiện giao dịch"
        onCancel={onModalDisable}
        onOk={() => handleDisable(selectProject?.projectId as string)}
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

      {/* message Antd */}
      {contextHolder}
    </div>
  );
};

export default memo(ProjectTable);
