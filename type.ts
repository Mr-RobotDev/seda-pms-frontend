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
  signalStrength: number;
  lastUpdated: string;
  isOffline: boolean;
}


export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  organization: string;
}


export interface DashboardType {
  name: string;
  cardsCount: number;
  devicesCount: number;
  id: string;
}

export interface DashboardCardType {
  name: string;
  x: number;
  y: number;
  rows: number;
  cols: number;
  devices: Device[];
  field: string;
  id: string;
}

interface Device {
  oem: string;
  name: string;
  id: string;
}

export interface EventType {
  oem: string;
  eventType: string;
  relativeHumidity: number;
  createdAt: string;
  id: string;
}

export interface DataPoint {
  oem: string;
  eventType: string;
  temperature: number;
  relativeHumidity: number;
  createdAt: string;
  id: string;
}

export interface Event {
  oem: string;
  eventType: string;
  temperature: number;
  relativeHumidity: number;
  createdAt: string;
  id: string;
}

export interface DeviceData {
  data: Event[];
  name: string;
}

export type EventsMap = Record<string, DeviceData>;


export interface CardLayoutType {
  key: string;
  rows: number;
  cols: number;
}

export type CardOptionsType = {
  [key: string]: CardLayoutType;
};

export interface TimeFrameType {
  startDate: string
  endDate: string
  key: string
  title: string;
}

export type SeriesType = {
  name: string;
  data: Array<{
    x: Date;
    y: number;
  }>;
};