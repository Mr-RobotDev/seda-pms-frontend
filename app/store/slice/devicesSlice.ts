import { DevicesType } from "@/type";
import { createSlice } from "@reduxjs/toolkit";

type SingleDeviceType = {
  devices: DevicesType[]
}

const initialState: SingleDeviceType = {
  devices: []
}

const devicesSlice = createSlice({
  name: 'Devices',
  initialState,
  reducers: {
    setDevicesToGlobal(state, action) {
      state.devices = action.payload;
    }
  }
})

export const { setDevicesToGlobal } = devicesSlice.actions
export default devicesSlice.reducer