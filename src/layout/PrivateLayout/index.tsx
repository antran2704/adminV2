import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";

import LeftMenu from "~/components/LeftMenu";
import Navbar from "~/components/Navbar";
import {
  injectNavigate,
  injectStore,
  injectTranslate,
} from "~/config/axiosClient";
import { checkDarkMode } from "~/helper/darkmode";
import { useAppDispatch } from "~/store/hooks";

const PrivateLayout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("Error");

  useEffect(() => {
    checkDarkMode();
    injectStore(dispatch);
    injectNavigate(navigate as any);
    injectTranslate(t);
  }, []);

  return (
    <Fragment>
      <Navbar />
      <div className="flex">
        <LeftMenu />
        <div className="w-full min-h-screen overflow-x-clip">
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

export default PrivateLayout;
