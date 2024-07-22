import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMe } from "~/api-client/user";

import { getAuthToken } from "~/helper/auth";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setInforUser } from "~/store/slice/user";
import SpinnerLoading from "../Loading/Spinner";

const AuthenGuard = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const { infoUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(!infoUser._id);

  const chechAuth = async () => {
    setLoading(true);

    const accessToken = getAuthToken("accessToken");
    const refreshToken = getAuthToken("refreshToken");

    if (!accessToken || !refreshToken) {
      navigate("/login");
      return;
    }

    try {
      const user = await getMe();

      if (user) {
        dispatch(setInforUser(user));
      }
      setLoading(false);
    } catch (error) {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!infoUser._id) {
      chechAuth();
    }
  }, [infoUser]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white z-[9999]">
        <SpinnerLoading size="L" />
      </div>
    );
  }

  return children;
};

export default AuthenGuard;
