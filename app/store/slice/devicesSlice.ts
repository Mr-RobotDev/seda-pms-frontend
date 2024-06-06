import { createSlice } from "@reduxjs/toolkit";

type DevicesType = {
  devices: DevicesType[]
}

const initialState: DevicesType = {
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