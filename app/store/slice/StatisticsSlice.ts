import { createSlice, configureStore } from "@reduxjs/toolkit";

type DevicesStats = {
  totalDevices: number;
  highestTemperature: number;
  highestRelativeHumidity: number;
}

const initialState: DevicesStats = {
  totalDevices: 0,
  highestTemperature: 0,
  highestRelativeHumidity: 0,
}

const statisticsSlice = createSlice({
  name: 'Statistics',
  initialState,
  reducers: {
    setDevicesStats(state, action) {
      const { totalDevices, highestTemperature, highestRelativeHumidity } = action.payload;
      state.totalDevices = totalDevices;
      state.highestTemperature = highestTemperature;
      state.highestRelativeHumidity = highestRelativeHumidity;
    }
  }
})

export const { setDevicesStats } = statisticsSlice.actions
export default statisticsSlice.reducer