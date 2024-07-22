"use client";

import Transaction from "~/components/Transaction";
import TopNFT from "~/components/TopNFT";
import Statistical from "~/components/Statistical";

export default function HomePage() {
  return (
    <div className="scrollHidden h-full bg-primary-700 dark:bg-slate-800 px-5 lg:py-5 py-10 overflow-x-auto">
      <div className="flex flex-col gap-y-10">
        <Statistical />
        <div className="flex gap-6 flex-col xl:flex-row xl:h-[80vh]">
          <div className="xl:w-8/12 w-full h-full">
            <Transaction />
          </div>

          <div className="xl:w-4/12 w-full h-full rounded-xl overflow-hidden">
            <TopNFT />
          </div>
        </div>
      </div>
    </div>
  );
}
