import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import Cookies from "js-cookie";

type AuthState = {
  isAuthenticated: boolean;
  user: any;
  token: string;
  isAdmin: boolean;
  version: string;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: "",
  isAdmin: false,
  version: '',
};

const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<any>) {
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      state.isAdmin = user.role === 'Admin'

      localStorage.setItem("seda_token", token);
      axiosInstance.defaults.headers.Authorization = "Bearer " + token;
      Cookies.set("seda_token", token, { expires: 7 });
    },
    logout(state) {
      Cookies.remove("seda_token");
      localStorage.removeItem("seda_token");
      sessionStorage.setItem("didLogout", "true");

      if (axiosInstance.defaults.headers) {
        axiosInstance.defaults.headers.Authorization = "";
      }

      state.isAuthenticated = false;
      state.user = null;
      state.token = "";
    },
    updateUserDetails(state, action: PayloadAction<any>) {
      const { user } = action.payload;
      state.user = user;
    },
    updateProfileImage: (state, action) => {
      const { profile } = action.payload;
      state.user.profile = profile;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLatestVersionNumber.fulfilled, (state, action) => {
      state.version = action.payload
    });
    builder.addCase(getLatestVersionNumber.rejected, (state, action) => {
      state.version = 'X.X.X'
    });
  },
});

export const getLatestVersionNumber = createAsyncThunk('changeLogs/lastest-version', async() => {
  const response = await axiosInstance.get('/changelogs/latest-version')
  return response.data.version
})

export const { login, logout, updateUserDetails, updateProfileImage } =
  authSlice.actions;
export default authSlice.reducer;
