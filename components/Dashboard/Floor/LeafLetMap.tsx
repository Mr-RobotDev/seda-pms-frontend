"use client";
import React from "react";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
  FeatureGroup,
  Circle,
} from "react-leaflet";
import { Icon } from "leaflet";
import { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import { EditControl } from "react-leaflet-draw";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface LeafLetMapProps {
  diagram?: string;
}

const LeafLetMap = ({ diagram }: LeafLetMapProps) => {
  const imageUrl = diagram || "/seda-ground-floor.jpg";

  const bounds: LatLngBoundsExpression = [
    [51.5008, -0.0839],
    [51.5019, -0.082],
  ];

  const _onCreate = (e: any) => console.log(e);
  const _onEditPath = (e: any) => console.log(e);
  const _onDeleted = (e: any) => console.log(e);

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
        <FeatureGroup>
          <EditControl
            position="topright"
            onEdited={_onEditPath}
            onCreated={_onCreate}
            onDeleted={_onDeleted}
            draw={{
              rectangle: false,
              polygon: false,
              polyline: false,
              circle: false,
              circlemarker: true,
              marker: false,
            }}
          />
        </FeatureGroup>

        {/* {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={customIcon}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))} */}
      </MapContainer>
    </div>
  );
};

export default LeafLetMap;
