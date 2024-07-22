import { Table, TableColumnsType } from "antd";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { initPagination } from "~/commons/pagination";
import { IPagination } from "~/interface";

interface Props {
  items: any;
  pagination?: IPagination;
  loading?: boolean;
}

const TransactionTable = (props: Props) => {
  const { items, pagination = initPagination, loading = false } = props;

  const tCommon = useTranslations("Common");

  const columns: TableColumnsType<any> = useMemo(() => {
    return [
      {
        title: "ID",
        dataIndex: "_id",
        render: (transactionId: string) => (
          <span className="whitespace-nowrap">{transactionId}</span>
        ),
      },
      {
        title: "Price",
        dataIndex: "price",
        render: (price: number) => (
          <span className="whitespace-nowrap">{price}</span>
        ),
      },
      {
        title: "Seller",
        dataIndex: "sellerName",
        render: (sellerName: string) => (
          <span className="whitespace-nowrap">{sellerName}</span>
        ),
      },
      {
        title: "Buyer",
        dataIndex: "buyerName",
        render: (buyerName: string) => (
          <span className="whitespace-nowrap">{buyerName}</span>
        ),
      },
      {
        title: "Date",
        dataIndex: "date",
        render: (date: string) => (
          <span className="whitespace-nowrap">{date}</span>
        ),
      },
    ];
  }, []);

  return (
    <div className="scrollHidden overflow-x-auto">
      <Table
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={{
          total: pagination.total,
          pageSize: pagination.take,
          current: pagination.page,
          showSizeChanger: true,
          position: ["bottomLeft"],
          locale: {
            items_per_page: `/ ${tCommon("pagination.page") as string}`,
          },
        }}
      />
    </div>
  );
};

export default TransactionTable;
