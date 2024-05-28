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


export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}