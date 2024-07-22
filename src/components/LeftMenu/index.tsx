import { Button, Menu, MenuProps } from "antd";
import { Fragment, useMemo, useState } from "react";
import clsx from "clsx";
import {
  BiSolidChevronLeftCircle,
  BiSolidChevronRightCircle,
  BiSolidCircleThreeQuarter,
  BiSolidUserVoice,
} from "react-icons/bi";
import { BsFillTicketFill } from "react-icons/bs";
import { RiShieldUserFill, RiCalendarScheduleLine } from "react-icons/ri";
import { GrLayer } from "react-icons/gr";
import { AiOutlineProduct } from "react-icons/ai";
import { HiMiniUserGroup } from "react-icons/hi2";
import { LiaHandsHelpingSolid } from "react-icons/lia";
import { MdOutlineAttachMoney, MdOutlineSettings } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";

import { usePathname, useRouter } from "~/navigation";
import useWindowDimensions from "~/hooks/useWindowDimensions";

import "./SideBar.scss";
import { useTranslations } from "next-intl";

type MenuItem = Required<MenuProps>["items"][number];

const LeftMenu = () => {
  const t = useTranslations("Sidebar");

  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const { width } = useWindowDimensions();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onClickItem = (path: string): void => {
    if (width && width < 768 && !collapsed) {
      toggleCollapsed();
    }

    router.push(path);
  };

  const items: MenuItem[] = useMemo(() => {
    return [
      {
        key: "/",
        icon: (
          <GrLayer
            className={"menu__icon transition-all ease-linear duration-1000"}
          />
        ),
        label: t("overview"),
        onClick: () => onClickItem("/"),
      },
      {
        key: "/permission",
        icon: (
          <RiShieldUserFill
            className={"menu__icon transition-all ease-linear duration-1000"}
          />
        ),
        label: t("permission"),
        onClick: () => onClickItem("/permission"),
      },
      {
        key: "/product",
        icon: (
          <AiOutlineProduct
            className={"menu__icon transition-all ease-linear duration-1000"}
          />
        ),
        label: t("product"),
        children: [
          {
            key: "/product/projects",
            label: t("project"),
            onClick: () => onClickItem("/product/projects"),
          },
          {
            key: "/product/collections",
            label: t("collection"),
            onClick: () => onClickItem("/product/collections"),
          },
          {
            key: "/product/NFT",
            label: t("nft"),
            onClick: () => onClickItem("/product/NFT"),
          },
        ],
      },
      {
        key: "4",
        icon: (
          <HiMiniUserGroup
            className={"menu__icon transition-all ease-linear duration-1000"}
          />
        ),
        label: t("investor"),
      },
      {
        key: "5",
        icon: (
          <LiaHandsHelpingSolid
            className={"menu__icon transition-all ease-linear duration-1000"}
          />
        ),
        label: t("merchant"),
      },
      {
        key: "/wallets",
        icon: (
          <MdOutlineAttachMoney
            className={"menu__icon transition-all ease-linear duration-1000"}
          />
        ),
        label: t("wallet"),
        onClick: () => onClickItem("/wallets"),
      },
      {
        key: "7",
        icon: (
          <BsFillTicketFill
            className={"menu__icon transition-all ease-linear duration-1000"}
          />
        ),
        label: t("cost"),
      },
      {
        key: "/ratings",
        icon: (
          <BiSolidUserVoice
            className={"menu__icon transition-all ease-linear duration-1000"}
          />
        ),
        label: "FAQs",
        onClick: () => onClickItem("/ratings"),
      },
      {
        key: "9",
        icon: (
          <FaBoxArchive
            className={"menu__icon transition-all ease-linear duration-1000"}
          />
        ),
        label: "Ticket",
      },
      {
        key: "/news",
        icon: (
          <RiCalendarScheduleLine
            className={"menu__icon transition-all ease-linear duration-1000"}
          />
        ),
        label: t("news"),
        children: [
          {
            key: "/news/external",
            label: "Gắn link",
            onClick: () => onClickItem("/news/external"),
          },
          {
            key: "/news/internal",
            label: "Nội bộ",
            onClick: () => onClickItem("/news/internal"),
          },
        ],
      },
      {
        key: "11",
        icon: (
          <BiSolidCircleThreeQuarter
            className={"menu__icon transition-all ease-linear duration-1000"}
          />
        ),
        label: t("report"),
      },
      {
        key: "12",
        icon: (
          <MdOutlineSettings
            className={"menu__icon transition-all ease-linear duration-1000"}
          />
        ),
        label: t("setting"),
      },
      {
        key: "13",
        icon: (
          <FaBell
            className={"menu__icon transition-all ease-linear duration-1000"}
          />
        ),
        label: t("announce"),
      },
    ];
  }, [pathname, width, collapsed]);

  return (
    <Fragment>
      <div
        style={{ height: "calc(100vh - 76px)" }}
        className={clsx(
          "xl:min-w-[80px] cus__menu xl:sticky xl:top-[76px] fixed dark:bg-black-50 shadow-xl transition-all ease-linear duration-150 z-50",
          collapsed ? "xl:w-[5.2%] w-0" : "collapsed xl:w-1/5 md:w-4/12 w-8/12",
        )}
      >
        <Button
          type="primary"
          onClick={toggleCollapsed}
          className={clsx(
            "!absolute top-2 !rounded-full !shadow-none !p-0 !h-auto !bg-transparent !w-fit z-10",
            collapsed ? "xl:-right-2 -right-8" : "right-0",
          )}
        >
          {collapsed ? (
            <BiSolidChevronRightCircle
              className="text-primary-600 dark:text-white"
              size={30}
            />
          ) : (
            <BiSolidChevronLeftCircle
              className="text-primary-600 dark:text-white"
              size={30}
            />
          )}
        </Button>
        <Menu
          defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={items}
          className="scroll h-full md:min-w-none xl:min-w-[80px] overflow-y-auto dark:bg-black-50 !pb-5"
        />
      </div>
      <div
        onClick={toggleCollapsed}
        className={clsx(
          "xl:hidden block fixed left-0 right-0 top-0 bottom-0 bg-black/50 transition-all ease-linear duration-100 z-40",
          [collapsed ? "opacity-0 pointer-events-none" : "opacity-100"],
        )}
      ></div>
    </Fragment>
  );
};

export default LeftMenu;
