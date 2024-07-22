import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMe } from "~/api-client/user";
import { IAdmin } from "~/interface";

interface IInforUserSlice {
  infoUser: IAdmin;
  loadingUser: boolean;
}

const initInfoUser: IAdmin = {
  _id: null,
  idCard: "",
  imageProfile: { fileName: "", url: "" },
  dateOfBirth: "",
  email: "",
  fullName: "",
  phoneNumber: "",
  gender: true,
  roles: "",
  username: "",
  address: "",
};

const userInfo: IInforUserSlice = {
  infoUser: initInfoUser,
  loadingUser: false,
};

const fetchUser = createAsyncThunk("user/fetchUserInfo", async () => {
  return await getMe();
});

const userSlice = createSlice({
  name: "user",
  initialState: userInfo,
  reducers: {
    setInforUser: (state, action: PayloadAction<IAdmin>) => {
      state.infoUser = action.payload;
    },
    logoutUser: (state) => {
      state.infoUser = initInfoUser;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      fetchUser.fulfilled,
      (state, action: PayloadAction<IAdmin>) => {
        state.infoUser = action.payload;

        state.loadingUser = false;
      },
    );
    builder.addCase(fetchUser.pending, (state, action) => {
      state.loadingUser = true;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loadingUser = false;
    });
  },
});

export const { setInforUser, logoutUser } = userSlice.actions;
export { fetchUser };
export default userSlice.reducer;
