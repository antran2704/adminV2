import LocaleSwitcher from "~/components/LocaleSwitcher";
import { ReactNode, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthToken } from "~/helper/auth";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { fetchUser } from "~/store/slice/user";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { infoUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const chechAuth = async () => {
    const accessToken = getAuthToken("accessToken");
    const refreshToken = getAuthToken("refreshToken");

    if (!accessToken || !refreshToken) return;

    dispatch(fetchUser());
  };

  useEffect(() => {
    if (!infoUser._id) {
      chechAuth();
    } else {
      navigate("/");
    }
  }, [infoUser]);

  return (
    <div className="w-full h-screen">
      {/* form */}
      <div className="h-[90%] w-full flex items-center justify-center ">
        <div className="xl:w-[500px] lg:w-1/2 sm:w-10/12 w-11/12 bg-white lg:p-3 p-5 rounded-3xl border border-[#B5B5B5] gap-5">
          {children}
        </div>
      </div>

      <div className="w-full h-10% flex items-center justify-center gap-5">
        <LocaleSwitcher />
        <Link
          to={"/"}
          className="md:text-sm sm:text-sm text-xs text-[#202020] hover:underline hover:text-[#0459DD]"
        >
          Cookie
        </Link>
        <Link
          to={"/"}
          className="md:text-sm sm:text-sm text-xs text-[#202020] hover:underline hover:text-[#0459DD]"
        >
          Điều khoản
        </Link>
        <Link
          to={"/"}
          className="md:text-sm sm:text-sm text-xs text-[#202020] hover:underline hover:text-[#0459DD]"
        >
          Riêng tư
        </Link>
      </div>
    </div>
  );
};

export default PublicLayout;
