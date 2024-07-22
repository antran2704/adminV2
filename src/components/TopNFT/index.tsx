import { useTranslation } from "react-i18next";

const TopNFT = () => {
  const { t } = useTranslation("HomePage");
  const { t: tfavoriteNFT } = useTranslation("favoriteNFT");

  const listNFT = [
    {
      service: "Voucher DHA",
      amount: "100,000",
    },
    {
      service: "Voucher TTC",
      amount: "8,000,000",
    },
    {
      service: "Voucher Vietnam Airlines",
      amount: "500,000",
    },
    {
      service: "Khách sạn TTC",
      amount: "6,000,000",
    },
    {
      service: "Voucher DHA",
      amount: "100,000",
    },
    {
      service: "Voucher TTC",
      amount: "8,000,000",
    },
    {
      service: "Voucher Vietnam Airlines",
      amount: "500,000",
    },
    {
      service: "Khách sạn TTC",
      amount: "6,000,000",
    },
    {
      service: "Voucher DHA",
      amount: "100,000",
    },
    {
      service: "Voucher TTC",
      amount: "8,000,000",
    },
    {
      service: "Voucher Vietnam Airlines",
      amount: "500,000",
    },
    {
      service: "Khách sạn TTC",
      amount: "6,000,000",
    },
    {
      service: "Voucher DHA",
      amount: "100,000",
    },
    {
      service: "Voucher TTC",
      amount: "8,000,000",
    },
    {
      service: "Voucher Vietnam Airlines",
      amount: "500,000",
    },
    {
      service: "Khách sạn TTC",
      amount: "6,000,000",
    },
    {
      service: "Voucher DHA",
      amount: "100,000",
    },
    {
      service: "Voucher TTC",
      amount: "8,000,000",
    },
    {
      service: "Voucher Vietnam Airlines",
      amount: "500,000",
    },
    {
      service: "Khách sạn TTC",
      amount: "6,000,000",
    },
  ];
  return (
    <div className="scroll px-5 pb-10 pt-5 bg-white w-full h-full xl:max-h-none max-h-[600px] dark:bg-black-50 overflow-y-auto">
      <span className="font-semibold text-xl/8 text-primary-1100 mb-[1.063rem] block dark:text-white">
        {t("favorite")}
      </span>
      <div className="flex flex-col gap-[1.063rem]">
        <div className="flex justify-between text-neutral-1000 text-[0.813rem]/4 gap-x-20 dark:text-white">
          <span className="flex-1">STT</span>
          <span className="flex-[4_1]">{tfavoriteNFT("name")}</span>
          <span className="flex-[4_1]">{tfavoriteNFT("quantity")}</span>
        </div>
        {listNFT.map(({ service, amount }, index) => (
          <div
            key={index}
            className="flex justify-between text-primary-1200 text-sm gap-x-20 py-2.5 pl-2.5 dark:text-white"
          >
            <span className="flex-1">{index + 1}</span>
            <span className="flex-[8_1]">{service}</span>
            <span className="flex-[5_1] text-right">{amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopNFT;
