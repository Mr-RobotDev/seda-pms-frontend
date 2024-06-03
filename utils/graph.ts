import { ApexOptions } from "apexcharts";

export const humidityColors = [
  "#43A6C6",
  "#6EC5DC",
  "#70C3D2",
  "#74C4CC",
  "#77C5CA",
  "#82C7C8",
  "#8BCBC6",
  "#94CDC4",
  "#9DCFC2",
  "#A6D1C0",
  "#B0D3BE",
];

export const temperatureColors = [
  "#FF6666",
  // "#FF1A1A",
  "#FF0000",
  "#E60000",
  "#CC0000",
  "#B30000",
  "#990000",
  "#800000" 
];

export const commonApexOptions: ApexOptions = {
  chart:{
    toolbar: {
      show: false,
      tools: {
        download: false,
        selection: false,
        zoom: false,
        zoomin: true,
        zoomout: false,
        pan: false,
        reset: true,
      },
    },
  },
  stroke: {
    width: 2,
    curve: "smooth",
  },
  markers: {
    size: 3,
    strokeWidth: 2,
    hover: {
      size: 4,
    },
  }
}



