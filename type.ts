export interface DevicesType {
  id: string;
  oem: string;
  name: string;
  type: string;
  temperature: number;
  relativeHumidity: number;
  location: {
    lat: number;
    long: number;
  };
}