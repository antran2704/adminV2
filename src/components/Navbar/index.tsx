"use client";

import { useParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import clsx from "clsx";

// Antd
import { Avatar, Badge, Dropdown, Switch, message } from "antd";
import type { MenuProps } from "antd";
import type { ItemType } from "antd/es/breadcrumb/Breadcrumb";

// React icon
import { AiOutlineGlobal } from "react-icons/ai";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoMoonOutline } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { FaRegUser, FaRegHandshake } from "react-icons/fa6";
import { GoBell } from "react-icons/go";
import { PiMagnifyingGlassLight } from "react-icons/pi";
import { HiMenuAlt2 } from "react-icons/hi";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdOutlineRemoveRedEye,
  MdOutlineClose,
  MdLogout,
} from "react-icons/md";
import { LuPencilRuler } from "react-icons/lu";

import { Link, usePathname, useRouter } from "~/navigation";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { handleChangeMode } from "~/helper/darkmode";

// style navbar
import "./Navbar.scss";
import { useTranslations } from "next-intl";
import { getAuthToken, removeAuthToken } from "~/helper/auth";
import { logout } from "~/api-client/auth";
import { NO_IMAGE } from "~/commons/image";
import { logoutUser } from "~/store/slice/user";

interface INavbarMobile {
  key: string;
  label: string;
  path?: string;
  locale?: string;
  icon?: JSX.Element;
  children?: INavbarMobile[];
}

let timmerNavbarMobile: NodeJS.Timeout;

const Navbar = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const tError = useTranslations("Error");

  const { darkMode } = useAppSelector((state) => state.setting);
  const { infoUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [itemsShowMobile, setItemsShowMobile] = useState<INavbarMobile[][]>([]);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showLanguage, setShowLanguage] = useState<boolean>(false);
  const [showNavbarMobile, setShowNavbarMobile] = useState<boolean>(false);

  const onClickItemMobile = (item: INavbarMobile) => {
    if (item.children && item.children.length) {
      setItemsShowMobile([...itemsShowMobile, item.children]);
      return;
    }
    if (item.key.includes("language") && item.path) {
      router.replace(pathname, { locale: item.locale });
      onShowNavbarMobile();
      return;
    }

    if (item.path && item.locale) {
      router.replace(item.path, { locale: item.locale });
      onShowNavbarMobile();
      return;
    }

    if (item.path) {
      router.replace(item.path as string);
      onShowNavbarMobile();
    }
  };

  const onBackItemMobile = () => {
    if (itemsShowMobile.length <= 1) return;

    itemsShowMobile.splice(itemsShowMobile.length - 1, 1);

    setItemsShowMobile([...itemsShowMobile]);
  };

  const onShowNavbarMobile = () => {
    if (timmerNavbarMobile) {
      clearTimeout(timmerNavbarMobile);
    }

    if (showNavbarMobile) {
      timmerNavbarMobile = setTimeout(() => {
        setItemsShowMobile([itemsShowMobile[0]]);
      }, 300);
    }

    setShowNavbarMobile(!showNavbarMobile);
  };

  const onLogout = async () => {
    const accessToken: string = getAuthToken("accessToken") as string;

    if (!accessToken) {
      message.error("Vui lòng thử lại");
      return;
    }

    try {
      await logout();
    } catch (err) {
      message.error(tError("TRY_AGAIN"));
    }

    removeAuthToken();
    dispatch(logoutUser());
  };

  const onShowLanguage = () => {
    setShowLanguage(!showLanguage);
  };

  const onShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const items: MenuProps["items"] = useMemo(() => {
    return [
      {
        key: "/account",
        label: (
          <Link
            href="/account"
            className="min-w-[240px] flex items-center px-4 py-1 gap-2"
          >
            <FaRegUser className="w-6 min-w-6 h-6 dark:text-white" />
            <p className="text-base font-semibold capitalize dark:text-white">
              {t("account")}
            </p>
          </Link>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "language",
        label: (
          <div className="min-w-[240px] flex items-center justify-between px-4 py-1 gap-2">
            <div className="flex items-center gap-2">
              <AiOutlineGlobal className="w-6 min-w-6 h-6" />
              <p className="text-base font-semibold capitalize">
                {t("language")}
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-sm">{params.locale}</span>
              <MdOutlineKeyboardArrowRight className="w-6 min-w-6 h-6" />
            </div>
          </div>
        ),
      },
      {
        key: "authen",
        label: (
          <Link
            href="/"
            className="min-w-[240px] flex items-center dark:text-white px-4 py-1 gap-2"
          >
            <MdOutlineRemoveRedEye className="w-6 min-w-6 h-6" />
            <p className="text-base font-semibold capitalize">{t("auth")}</p>
          </Link>
        ),
      },
      {
        key: "4",
        label: (
          <Link
            href="/"
            className="min-w-[240px] flex items-center dark:text-white px-4 py-1 gap-2"
          >
            <FaRegHandshake className="w-6 min-w-6 h-6" />
            <p className="text-base font-semibold capitalize">
              {t("investment")}
            </p>
          </Link>
        ),
      },
      {
        key: "5",
        label: (
          <Link
            href="/"
            className="min-w-[240px] flex items-center dark:text-white px-4 py-1 gap-2"
          >
            <LuPencilRuler className="w-6 min-w-6 h-6" />
            <p className="text-base font-semibold capitalize">
              {t("interests")}
            </p>
          </Link>
        ),
      },
      {
        key: "darkMode",
        label: (
          <div className="min-w-[240px] flex items-center justify-between  px-4 py-1 gap-2">
            <div className="flex items-center gap-2">
              <IoMoonOutline className="w-6 min-w-6 h-6" />
              <p className="text-base font-semibold capitalize">
                {t("darkMode")}
              </p>
            </div>
            <Switch
              checked={darkMode}
              defaultChecked={darkMode}
              onClick={() => handleChangeMode(darkMode, dispatch)}
            />
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "auth",
        label: infoUser._id ? (
          <button
            onClick={onLogout}
            className="min-w-[240px] flex items-center dark:text-white px-4 py-1 gap-2"
          >
            <MdLogout className="w-6 min-w-6 h-6" />
            <p className="text-base font-semibold capitalize">{t("logout")}</p>
          </button>
        ) : (
          <Link
            href="/login"
            className="min-w-[240px] flex items-center dark:text-white px-4 py-1 gap-2"
          >
            <MdLogout className="w-6 min-w-6 h-6" />
            <p className="text-base font-semibold capitalize">{t("login")}</p>
          </Link>
        ),
      },
    ];
  }, [darkMode, infoUser]);

  const itemsLanguage: MenuProps["items"] = useMemo(() => {
    return [
      {
        key: "back",
        label: (
          <button className="min-w-[240px] flex items-center dark:text-white py-1 gap-2">
            <MdOutlineKeyboardArrowLeft className="w-6 min-w-6 h-6" />
            <p className="text-base font-semibold capitalize">
              {t("language")}
            </p>
          </button>
        ),
        onClick: () => setShowLanguage(false),
      },
      {
        key: "en",
        label: (
          <Link
            href={pathname}
            locale="en"
            className="min-w-[240px] flex items-center px-4 py-1 gap-2"
          >
            <p className="text-base font-semibold capitalize">English</p>
          </Link>
        ),
      },
      {
        key: "vi",
        label: (
          <Link
            href={pathname}
            locale="vi"
            className="min-w-[240px] flex items-center px-4 py-1 gap-2"
          >
            <p className="text-base font-semibold capitalize">Vietnamese</p>
          </Link>
        ),
      },
    ];
  }, [pathname]);

  const getItemsMobile = (): INavbarMobile[] => {
    return [
      {
        key: "account",
        label: t("account"),
        icon: <FaRegUser className="w-6 min-w-6 h-6" />,
        path: "/account",
      },
      {
        key: "language",
        label: t("language"),
        icon: <AiOutlineGlobal className="w-6 min-w-6 h-6" />,
        path: "/",
        children: [
          {
            key: "language - en",
            label: "English",
            path: pathname,
            locale: "en",
          },
          {
            key: "language - vi",
            label: "Vietnamese",
            path: pathname,
            locale: "vi",
          },
        ],
      },
      {
        key: "auth",
        label: t("auth"),
        icon: <MdOutlineRemoveRedEye className="w-6 min-w-6 h-6" />,
        path: "/",
      },
      {
        key: "3",
        label: t("investment"),
        icon: <FaRegHandshake className="w-6 min-w-6 h-6" />,
        path: "/",
      },
      {
        key: "4",
        label: t("interests"),
        icon: <LuPencilRuler className="w-6 min-w-6 h-6" />,
        path: "/",
      },
    ];
  };

  const onClickDropDown = (info: ItemType): void => {
    switch (info.key) {
      case "language":
        onShowDropdown();
        onShowLanguage();
        break;

      case "darkMode":
        break;
    }
  };

  useEffect(() => {
    const itemsMobile: INavbarMobile[] = getItemsMobile();
    setItemsShowMobile([itemsMobile]);

    return () => {
      if (timmerNavbarMobile) {
        clearTimeout(timmerNavbarMobile);
      }
    };
  }, []);

  return (
    <div
      className={clsx(
        "sticky top-0 left-0 right-0 transition-all ease-linear duration-100 z-[99]",
        "bg-white dark:bg-[#121212] shadow-xl",
      )}
    >
      <nav className="container__cus flex items-center justify-between py-2">
        <div className="lg:w-3/12 w-fit flex items-center h-[60px]">
          <Link href={"/"} className="flex items-center justify-center gap-2">
            <img
              src="https://opensea.io/static/images/logos/opensea-logo.svg"
              alt="logo"
              className="min-w-[40px] w-[40px] h-full"
            />
            <img
              src="/main/NFT_Trade.png"
              alt="logo"
              className="xl:block hidden min-w-[100px] w-[100px] h-full"
            />
          </Link>
          <span className="xl:block hidden shrink-0 bg-[#fff3] h-1/2 min-w-[1px] w-[1px] ml-4"></span>
        </div>
        {/* <div className="lg:w-5/12 lg:flex hidden items-center">
          <InputSearch placeholder={t("search")} name="search" />
        </div> */}
        <div className="lg:w-3/12 w-4/12 flex items-center justify-end gap-5">
          <div className="flex items-center gap-5">
            <PiMagnifyingGlassLight className="lg:hidden block text-2xl text-[#ADB5BD] dark:text-white hover:text-primary-300 cursor-pointer" />
            <IoIosInformationCircleOutline className="md:block hidden text-2xl text-[#ADB5BD] dark:text-white hover:text-primary-300 cursor-pointer" />
            <Badge count={2}>
              <GoBell className="text-2xl text-[#ADB5BD] dark:text-white hover:text-primary-300 cursor-pointer" />
            </Badge>
            <div className="md:hidden block">
              {!infoUser.imageProfile && <Avatar icon={<FaUserAlt />} />}
              {infoUser.imageProfile && (
                <Link href={"/account"}>
                  <img
                    onError={(e) => (e.currentTarget.src = NO_IMAGE)}
                    src={infoUser.imageProfile.url}
                    className="min-w-8 w-8 h-8 rounded-full object-cover object-center"
                    alt="avartar"
                  />
                </Link>
              )}
            </div>
            <button className="md:hidden block " onClick={onShowNavbarMobile}>
              {!showNavbarMobile && (
                <HiMenuAlt2 className="text-3xl text-[#ADB5BD] dark:text-white hover:text-primary-300 cursor-pointer" />
              )}
              {showNavbarMobile && (
                <MdOutlineClose className="text-3xl text-[#ADB5BD] dark:text-white hover:text-primary-300 cursor-pointer" />
              )}
            </button>

            {/* Drop down menu */}
            <Dropdown
              menu={{
                items,
                selectable: true,
                defaultSelectedKeys: [pathname],
                selectedKeys: [pathname],
                onClick: onClickDropDown,
                onMouseLeave: onShowDropdown,
              }}
              open={showDropdown}
              placement="bottomLeft"
              overlayClassName="menu"
            >
              <div
                onMouseEnter={onShowDropdown}
                className="md:flex hidden items-center cursor-pointer hover:text-primary-300"
              >
                {!infoUser.imageProfile && <Avatar icon={<FaUserAlt />} />}
                {infoUser.imageProfile && (
                  <Link href={"/account"}>
                    <img
                      onError={(e) => (e.currentTarget.src = NO_IMAGE)}
                      src={infoUser.imageProfile.url}
                      className="min-w-8 w-8 h-8 rounded-full object-cover object-center"
                      alt="avartar"
                    />
                  </Link>
                )}
              </div>
            </Dropdown>

            {/* Drop down select language */}
            <Dropdown
              menu={{
                items: itemsLanguage,
                selectable: true,
                selectedKeys: [params.locale as string],
                onClick: (info: ItemType): void => {
                  if (info.key === "back") {
                    onShowLanguage();
                    onShowDropdown();
                  }
                },
                onMouseLeave: onShowLanguage,
              }}
              open={showLanguage}
              placement="bottomLeft"
              overlayClassName="menu"
            >
              <div className="absolute right-5 top-3/4"></div>
            </Dropdown>
          </div>
        </div>
      </nav>

      {/* Navbar on mobile */}
      <div
        className={clsx(
          "md:hidden block absolute top-full w-full overflow-x-hidden z-[99]",
          [showNavbarMobile ? "pointer-events-auto" : "pointer-events-none"],
        )}
      >
        <div
          className={clsx(
            "relative w-full max-h-[90vh] h-[90vh] bg-slate-100 dark:bg-[#252525] pb-10 transition-all ease-linear duration-200 overflow-y-auto",
            [
              showNavbarMobile
                ? "right-0 opacity-100"
                : "-right-full opacity-0 pointer-events-none",
            ],
          )}
        >
          {itemsShowMobile.length > 1 && (
            <button
              onClick={onBackItemMobile}
              className="flex items-center w-full text-base font-semibold hover:bg-gray-200 dark:hover:bg-[#ffffff0a] dark:text-white capitalize p-5 border-b-2 dark:border-b-neutral-400 gap-2"
            >
              <MdOutlineKeyboardArrowLeft className="w-6 min-w-6 h-6" />
              Back
            </button>
          )}
          <ul className="w-full">
            {itemsShowMobile.length > 0 &&
              itemsShowMobile[itemsShowMobile.length - 1].map(
                (item: INavbarMobile) => (
                  <li
                    key={item.key}
                    onClick={() => onClickItemMobile(item)}
                    className={clsx(
                      "flex items-center justify-between w-full p-5 cursor-pointer  gap-2",
                      [
                        pathname === item.key || params.locale === item.locale
                          ? "bg-[#1677ff] text-white"
                          : "hover:bg-gray-200 dark:hover:bg-[#ffffff0a] dark:text-white",
                      ],
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && item.icon}
                      <p className="text-base font-semibold capitalize">
                        {item.label}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {item.children && item.children?.length > 0 && (
                        <MdOutlineKeyboardArrowRight className="w-6 min-w-6 h-6" />
                      )}
                    </div>
                  </li>
                ),
              )}

            {itemsShowMobile.length === 1 && (
              <Fragment>
                <li className="flex items-center justify-between w-full p-5 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#ffffff0a] dark:text-white gap-2">
                  <div className="flex items-center gap-2">
                    <IoMoonOutline className="w-6 min-w-6 h-6" />
                    <p className="text-base font-semibold capitalize">
                      {t("darkMode")}
                    </p>
                  </div>
                  <Switch
                    checked={darkMode}
                    defaultChecked={darkMode}
                    onClick={() => handleChangeMode(darkMode, dispatch)}
                  />
                </li>
                {infoUser._id && (
                  <li
                    onClick={() => {
                      onLogout();
                      onShowNavbarMobile();
                    }}
                    className="flex items-center justify-between w-full p-5 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#ffffff0a] dark:text-white border-t-2 dark:border-t-neutral-400 gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <MdLogout className="w-6 min-w-6 h-6" />
                      <p className="text-base font-semibold capitalize">
                        {t("logout")}
                      </p>
                    </div>
                  </li>
                )}
                {!infoUser._id && (
                  <li>
                    <Link
                      href={"/login"}
                      className="flex items-center w-full p-5 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#ffffff0a] dark:text-white border-t-2 dark:border-t-neutral-400 gap-2"
                    >
                      <MdLogout className="w-6 min-w-6 h-6" />
                      <p className="text-base font-semibold capitalize">
                        {t("login")}
                      </p>
                    </Link>
                  </li>
                )}
              </Fragment>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
