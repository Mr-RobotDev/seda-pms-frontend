"use client";
import React, { useEffect } from "react";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
} from "react-leaflet";
import { Icon } from "leaflet";
import { LatLngBoundsExpression } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import axiosInstance from "@/lib/axiosInstance";
import DeviceDetailsComp from "../DeviceDetailsComp";

interface LeafLetMapProps {
  diagram?: string;
}

interface DevicesType {
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

const LeafLetMap = ({ diagram }: LeafLetMapProps) => {

  const [devices, setDevices] = React.useState<DevicesType[]>([]);

  useEffect(() => {
    (
      async () => {
        try {
          const response = await axiosInstance.get('/devices?page=1&limit=20')
          if (response.status === 200) {
            setDevices(response.data.results)
          }
        } catch (error) {
          console.log(error)
        }
      }
    )()
  }, [])
  const imageUrl = diagram || "/seda-ground-floor.jpg";

  const bounds: LatLngBoundsExpression = [
    [51.5008, -0.0839],
    [51.5019, -0.082],
  ];

  const customThermometerIcon = new Icon({
    iconUrl: "/thermometer.png",
    iconSize: [35, 35],
  });

  const customColdStorageIcon = new Icon({
    iconUrl: "/snowflake.png",
    iconSize: [30, 30],
  });

  return (
    <div
      style={{ width: "100%" }}
      className="w-full h-[350px] md:max-h-[600px] 2xl:h-[800px]"
    >
      <MapContainer
        center={[51.5014, -0.083]}
        zoom={20}
        minZoom={19}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%", backgroundColor: "white" }}
      >
        <ImageOverlay url={imageUrl} bounds={bounds} />

        {devices.map(device => (
          <Marker
            key={device.oem}
            position={[device.location.lat, device.location.long]}
            icon={device.type === 'cold' ? customColdStorageIcon: customThermometerIcon }
          >
            <Popup>
              <DeviceDetailsComp device={device} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafLetMap;
