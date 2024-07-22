import Image from "next/image";
import React from "react";
import { Kodchasan } from "next/font/google";
import Logo from "@/main/logo-new.png";
import AppleStoreLogo from "@/main/apple-store.png";
import clsx from "clsx";
import QrCode from "@/form/qr-code.png";
import Link from "next/link";

const kodchasan = Kodchasan({
  subsets: ["latin"],
  weight: "700",
});

const Footer = () => {
  const inforList = [
    {
      title: "Thị trường",
      children: ["Bất động sản", "Tài chính số"],
    },
    {
      title: "Về chúng tôi",
      children: ["Thông tin", "Trung tâm hỗ trợ"],
    },
    {
      title: "FAQs",
      children: [
        "Xem thông tin dự án",
        "Quản lý Ví tiền",
        "Xem thông tin NFT",
        "Giao dịch NFT",
      ],
    },
  ];

  return (
    <div className="w-full bg-primary-500 py-16">
      <div
        className={clsx(
          " container__cus flex sm:flex-row flex-col justify-between gap-10",
        )}
      >
        <Link
          href={"/"}
          className={clsx(
            kodchasan.className,
            "sm:w-2/12 w-full flex flex-col items-center",
          )}
        >
          <Image
            src={Logo}
            alt={"Picture of logo"}
            className="lg:max-w-[100px]"
          />
          <span className="xl:text-2xl md:text-xl text-lg text-primary-200 text-center whitespace-nowrap">
            NFT Trade
          </span>
        </Link>

        <div className="sm:w-9/12 w-full flex lg:flex-nowrap flex-wrap items-start justify-between">
          {inforList.map((item, index) => (
            <div key={index} className="lg:w-1/6 sm:w-2/4 w-full lg:pb-0 pb-5">
              <span className="block font-semibold text-xl mb-2">
                {item.title}
              </span>
              <div className=" flex flex-col text-base">
                {item.children.map((child, index) => (
                  <span
                    key={index}
                    className="hover:text-primary-200 cursor-pointer"
                  >
                    {child}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="lg:w-2/6 sm:w-2/4 w-full flex flex-col justify-between lg:pb-0 pb-5 gap-5">
            <span className="font-semibold text-xl">Tải NFT app</span>

            <div className="flex items-start xl:flex-row flex-col-reverse gap-5">
              <div className="w-full flex items-center sm:justify-start justify-center">
                <div className="flex flex-col items-center gap-[9px]">
                  <Image src={QrCode} alt="qr-code" className="max-w-[160px]" />
                  <span className="text-sm text-center">Quét mã để tải</span>
                </div>
              </div>
              <div className="w-full flex sm:flex-col flex-row xl:items-center items-start justify-center gap-5">
                <Link
                  href={"/"}
                  className="block min-w-[140px] lg:w-[140px] w-[200px] lg:h-12 h-14"
                >
                  <Image
                    title="apple-store"
                    alt="apple-store"
                    src={AppleStoreLogo}
                    className="w-full h-full object-contain"
                  />
                </Link>
                <Link
                  href={"/"}
                  className="block min-w-[140px] lg:w-[140px] w-[200px] lg:h-12 h-14"
                >
                  <Image
                    title="apple-store"
                    alt="apple-store"
                    src={AppleStoreLogo}
                    className="w-full h-full object-contain"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
