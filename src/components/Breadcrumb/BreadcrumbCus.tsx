import { Breadcrumb } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { GoHome } from "react-icons/go";
import { Link } from "~/navigation";

interface Props {
  data: ItemType[];
  separator?: string;
}

const BreadcrumbCus = (props: Props) => {
  const { data, separator = "/" } = props;

  return (
    <Breadcrumb
      items={[
        {
          title: (
            <Link href={"/"} className="!flex items-center justify-center">
              <GoHome className="w-5 h-5 dark:text-white dark:hover:text-primary-200" />
            </Link>
          ),
        },
        ...data.map((item: ItemType) => ({
          ...item,
          title: item.href ? (
            <Link
              href={item.href}
              className="block font-semibold dark:text-white"
            >
              {item.title}
            </Link>
          ) : (
            <span className="font-semibold dark:text-white">{item.title}</span>
          ),
          href: undefined,
        })),
      ]}
      separator={<span className="dark:text-white">{separator}</span>}
    />
  );
};

export default BreadcrumbCus;
