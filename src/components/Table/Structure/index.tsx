import { Button, Input, Table, TableColumnsType, message } from "antd";
import { useTranslations } from "next-intl";
import { ChangeEvent, memo, useEffect, useMemo, useState } from "react";
import { FaBan, FaCheck } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { PlusCircleOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "~/navigation";

import {
  createUnitOfStructure,
  deleteStructureUnit,
  updateStructureUnit,
} from "~/api-client/project";

import { ModalConfirm } from "~/components/Modal";

import { IPagination, IStructure, ITableStructure } from "~/interface";
import { initPagination } from "~/commons/pagination";

import MESSAGE_ERROR from "~/commons/error";
import clsx from "clsx";
import hanldeErrorAxios from "~/helper/handleErrorAxios";

interface Props {
  projectId: string;
  items: ITableStructure[];
  pagination?: IPagination;
  loading?: boolean;
  onGetList: () => void;
  onPagination: (nextPage: number, pageSize: number) => void;
}

interface IEditItem {
  [k: string]: ITableStructure;
}

const ProjectTable = (props: Props) => {
  const {
    projectId,
    items,
    pagination = initPagination,
    loading = false,
    onPagination,
    onGetList,
  } = props;

  const t = useTranslations("ProjectPage");
  const tCommon = useTranslations("Common");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();
  const path = usePathname();

  const [listItem, setListItem] = useState<ITableStructure[]>([]);
  const [listEdit, setListEdit] = useState<IEditItem>({});
  const [selectRecord, setSelectRecord] = useState<ITableStructure | null>(
    null,
  );
  const [messageApi, contextHolder] = message.useMessage();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isModeAdd, setIsModeAdd] = useState<boolean>(false);

  const [newRows, setNewRows] = useState<string[]>([]);

  const isEditing = (record: ITableStructure) => !!listEdit[record.key];

  const onModal = () => {
    if (isOpenModal) {
      setSelectRecord(null);
    }

    setIsOpenModal(!isOpenModal);
  };

  const onAddRow = () => {
    const newRecord: ITableStructure = {
      _id: "new",
      key: `NEW-${listItem.length}`,
      unitId: "",
      floor: "",
      block: "",
      zone: "",
      minted: false,
    };

    const newEdit: IEditItem = {
      ...listEdit,
      [newRecord.key]: { ...newRecord },
    } as IEditItem;

    setListEdit(newEdit);
    setListItem([...listItem, newRecord]);
    setIsModeAdd(true);
    setNewRows([...newRows, newRecord.key]);
  };

  const edit = (record: Partial<ITableStructure> & { key: React.Key }) => {
    const newEdit: IEditItem = {
      ...listEdit,
      [record.key]: { ...record },
    } as IEditItem;
    setListEdit(newEdit);
  };

  const onChangeValue = (
    record: ITableStructure,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const value: string = e.currentTarget.value;
    const name = e.currentTarget.name as keyof ITableStructure;
    const key: string = record.key;
    const newEdit: IEditItem = listEdit;

    newEdit[key][name] = value as never;
    setListEdit({ ...newEdit });
  };

  const onSave = async (record: ITableStructure) => {
    // Extracts the keys of the edited fields for the given record from `listEdit`.
    const keys: string[] = Object.keys(listEdit[record.key]);
    // Iterates over each key to check for empty values in the edited fields.
    for (let key of keys) {
      const valueOfKey =
        listEdit[record.key as keyof IEditItem][key as keyof ITableStructure];

      if (!valueOfKey.toString().trim()) {
        router.push(path + "#" + `${key}-${record.key}`);
        return;
      }
    }

    // Creates a new edit object by copying `listEdit` to preserve immutability.
    const newEdit = { ...listEdit };
    const newListItem = [...listItem];

    if (record._id === "new") {
      try {
        await createUnitOfStructure(projectId, {
          block: listEdit[record.key].block.trim(),
          floor: listEdit[record.key].floor.trim(),
          unitId: listEdit[record.key].unitId.trim(),
          zone: listEdit[record.key].zone.trim(),
        });

        const newListRows = newRows.filter((item) => item !== record.key);

        onGetList();
        setIsModeAdd(false);
        setNewRows(newListRows);

        messageApi.success(tSuccess("ok"));
      } catch (err) {
        const response = hanldeErrorAxios(err);
        messageApi.error(tError(response.message));
        if (response.message === MESSAGE_ERROR.UNIT_IS_EXISTED) {
          messageApi.error(tError(response.message));
        } else {
          messageApi.error(tError("TRY_AGAIN"));
        }

        return;
      }
    }

    if (record._id !== "new") {
      // Finds the index of the current record in the new list of items.
      const indexItem: number = newListItem.findIndex(
        (item: ITableStructure) => item.key === record.key,
      );

      if (indexItem > -1) {
        const newRecord: ITableStructure = listEdit[record.key];

        // Prepares the new data to be saved
        const newData: Omit<IStructure, "_id" | "minted"> = {
          block: newRecord.block.trim(),
          floor: newRecord.floor.trim(),
          unitId: newRecord.unitId.trim(),
          zone: newRecord.zone.trim(),
        };
        try {
          await updateStructureUnit(projectId, record._id, newData);
          messageApi.success(tSuccess("ok"));
        } catch (error) {
          messageApi.error(tError("TRY_AGAIN"));
          return;
        }

        // Updates the item in the list with the new record's data.
        newListItem[indexItem] = newRecord;
        // Sets the updated list of items in the state.
        setListItem([...newListItem]);
      }
    }

    // Removes the record's key from the new edit object, indicating the edit has been saved.
    delete newEdit[record.key];
    // Updates the state with the new edit object.
    setListEdit({ ...newEdit });
  };

  const onCancle = (record: ITableStructure) => {
    const newEdit = listEdit;
    delete listEdit[record.key];
    setListEdit({ ...newEdit });
  };

  const onDelete = async (record: ITableStructure) => {
    try {
      if (record._id !== "new") {
        await deleteStructureUnit(projectId, record._id);
      }

      const newEdit = listEdit;
      delete listEdit[record.key];
      const newListItem = listItem.filter((items) => items.key !== record.key);
      setListItem([...newListItem]);
      setListEdit({ ...newEdit });

      if (isModeAdd) {
        const newRowsTemp = newRows.filter((item) => item !== record.key);
        setNewRows(newRowsTemp);
        setIsModeAdd(false);
      }

      onGetList();
      if (!isModeAdd) messageApi.success(tSuccess("ok"));
    } catch (error) {
      messageApi.error(tError("error"));
    }

    onModal();
  };

  const columnStructure: TableColumnsType<any> = useMemo(
    () => [
      {
        title: "Mã căn",
        dataIndex: "unitId",
        render: (value, record: ITableStructure) => {
          const editable = isEditing(record);
          if (!editable) return value;

          return (
            <div className="mb-2">
              <Input
                name="unitId"
                id={`unitId-${record.key}`}
                value={listEdit[record.key]["unitId"]}
                status={!listEdit[record.key]["unitId"] ? "error" : ""}
                onChange={(e) => onChangeValue(record, e)}
              />
              {!listEdit[record.key]["unitId"] && (
                <p className="absolute text-sm text-red-200 pb-2">
                  Vui lòng nhập
                </p>
              )}
            </div>
          );
        },
      },
      {
        title: "Tầng",
        dataIndex: "floor",
        render: (value, record: ITableStructure) => {
          const editable = isEditing(record);
          if (!editable) return value;

          return (
            <div className="mb-2">
              <Input
                name="floor"
                id={`floor-${record.key}`}
                value={listEdit[record.key]["floor"]}
                status={!listEdit[record.key]["floor"] ? "error" : ""}
                onChange={(e) => onChangeValue(record, e)}
              />
              {!listEdit[record.key]["floor"] && (
                <p className="absolute text-sm text-red-200">Vui lòng nhập</p>
              )}
            </div>
          );
        },
      },
      {
        title: "Tòa",
        dataIndex: "block",
        key: "block",
        render: (value, record: ITableStructure) => {
          const editable = isEditing(record);
          if (!editable) return value;

          return (
            <div className="mb-2">
              <Input
                name="block"
                id={`block-${record.key}`}
                value={listEdit[record.key]["block"]}
                status={!listEdit[record.key]["block"] ? "error" : ""}
                onChange={(e) => onChangeValue(record, e)}
              />
              {!listEdit[record.key]["block"] && (
                <p className="absolute text-sm text-red-200">Vui lòng nhập</p>
              )}
            </div>
          );
        },
      },
      {
        title: "Phân khu",
        dataIndex: "zone",
        key: "zone",
        render: (value, record: ITableStructure) => {
          const editable = isEditing(record);
          if (!editable) return value;

          return (
            <div className="mb-2">
              <Input
                name="zone"
                id={`zone-${record.key}`}
                value={listEdit[record.key]["zone"]}
                status={!listEdit[record.key]["zone"] ? "error" : ""}
                onChange={(e) => onChangeValue(record, e)}
              />
              {!listEdit[record.key]["zone"] && (
                <p className="absolute text-sm text-red-200">Vui lòng nhập</p>
              )}
            </div>
          );
        },
      },
      {
        title: t("table.action"),
        dataIndex: "action",
        render: (_, record: ITableStructure) => {
          const editable = isEditing(record);

          if (!editable) {
            return (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => edit(record)}
                  icon={<GoPencil className="text-lg" />}
                  disabled={record.minted}
                  size="middle"
                />
              </div>
            );
          } else {
            return (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => onSave(record)}
                  icon={<FaCheck className="text-lg" />}
                  size="middle"
                />
                {record._id !== "new" && (
                  <Button
                    onClick={() => onCancle(record)}
                    icon={<FaBan className="text-lg" />}
                    size="middle"
                  />
                )}
                <Button
                  onClick={() => {
                    setSelectRecord(record);
                    onModal();
                  }}
                  icon={<MdDelete className="text-lg" />}
                  size="middle"
                  className="hover:!text-red-500 hover:!border-red-500"
                />
              </div>
            );
          }
        },
      },
    ],

    [listEdit, listItem],
  );

  useEffect(() => {
    setListItem(items);
  }, [items]);

  useEffect(() => {
    if (!newRows.length) return;

    // Scroll to the new record
    const element = document.getElementById(
      `unitId-${newRows[newRows.length - 1]}`,
    );
    element?.scrollIntoView({ behavior: "smooth" });
  }, [newRows]);

  // useEffect(() => {
  //   hanldeTest();
  // }, []);

  return (
    <div className="scrollHidden overflow-x-auto">
      {/* Table show list user */}
      <Table
        columns={columnStructure}
        dataSource={listItem}
        loading={loading}
        pagination={
          isModeAdd
            ? false
            : {
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
              }
        }
      />

      <div className="py-5">
        <Button
          disabled={isModeAdd}
          type="primary"
          icon={<PlusCircleOutlined />}
          size="middle"
          onClick={onAddRow}
        >
          Add
        </Button>
      </div>

      {/* Modal Disable Project */}
      <ModalConfirm
        title="Xóa căn hộ"
        subtitle="Bạn muốn xóa hộ?"
        open={isOpenModal}
        type="error"
        description="*Lưu ý: Hành động này không được khôi phục"
        onCancel={onModal}
        onOk={() => onDelete(selectRecord as ITableStructure)}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        okButtonProps={{
          size: "large",
          className: clsx("md:w-[100px] w-1/2 !bg-red-500"),
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
