import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SensorSelectComponent from "./SensorSelectComponent";

interface SensorSelectorProps {
  selectedSensors: string[];
  setSelectedSensors: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRowKeys: React.Key[];
}

const SensorSelector = ({
  selectedRowKeys,
  selectedSensors,
  setSelectedSensors,
}: SensorSelectorProps) => {
  const handleClick = (field: string) => {
    if (
      selectedRowKeys.length > 1 &&
      selectedSensors.length === 1 &&
      !selectedSensors.includes(field)
    ) {
      toast.error("Cannot select Multiple Sensors for more than one devices");
      return; 
    }

    setSelectedSensors((prevSensors) => {
      if (prevSensors.includes(field)) {
        return prevSensors.filter((sensor) => sensor !== field);
      } else {
        return [...prevSensors, field];
      }
    });
  };

  useEffect(() => {
    setSelectedSensors([]);
  }, [selectedRowKeys, setSelectedSensors]);

  return (
    <div className="flex flex-col gap-4 mt-6">
      <SensorSelectComponent title="Temperature" sensorType="temperature" handleClick={handleClick} selectedSensors={selectedSensors} />
      <SensorSelectComponent title="Relative Humidity" sensorType="relativeHumidity" handleClick={handleClick} selectedSensors={selectedSensors} />
      <SensorSelectComponent title="Pressue" sensorType="pressure" handleClick={handleClick} selectedSensors={selectedSensors} />
    </div>
  );
};

export default SensorSelector;
