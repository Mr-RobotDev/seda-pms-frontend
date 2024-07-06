import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button, Spin, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import SelectDefault from '../ui/Select/SelectDefault';
import DeviceDetail from './DeviceDetail';

interface QRCodeComponentProps {
  qrCodeSuccessCallback?: (decodedText: string) => void;
  qrCodeErrorCallback?: (error: any) => void;
  cancelScanning: () => void;
}

export interface QRCodeComponentRef {
  startScan: () => void;
  stopScan: () => void;
}

interface Camera {
  id: string;
  label: string;
}

const QRCodeComponent = forwardRef<QRCodeComponentRef, QRCodeComponentProps>(
  ({ qrCodeSuccessCallback, qrCodeErrorCallback, cancelScanning }, ref) => {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const cameraOptions = cameras.map((camera) => ({ label: camera.label, value: camera.id }));
    const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
    const [loadingCameras, setLoadingCameras] = useState(true);
    const [scanning, setScanning] = useState(false);
    const [qrContent, setQrContent] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isQRContentModalVisible, setIsQRContentModalVisible] = useState(false);
    const scannerRef = useRef<HTMLDivElement>(null);
    const html5QrcodeRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
      const fetchCameras = async () => {
        try {
          const devices = await Html5Qrcode.getCameras();
          setCameras(devices as Camera[]);
          if (devices.length) {
            const backCamera = devices.find((device) => device.label.toLowerCase().includes('back'));
            setSelectedCamera(backCamera ? backCamera.id : devices[0].id);
          }
          setLoadingCameras(false);
        } catch (error) {
          console.error('Error fetching cameras:', error);
          setLoadingCameras(false);
        }
      };

      fetchCameras();
    }, []);

    const calculateConfig = () => {
      const width = window.innerWidth;

      const config = {
        fps: 30,
        qrbox: 180,
        aspectRatio: 1.9,
      };

      if (width <= 370) {
        config.aspectRatio = 0.9;
        config.qrbox = 140;
      } else if (width > 370 && width <= 580) {
        config.aspectRatio = 1.3;
        config.qrbox = 160;
      } else if (width > 580 && width <= 768) {
        config.aspectRatio = 1.7;
        config.qrbox = 180;
      } else if (width > 768) {
        config.aspectRatio = 2;
        config.qrbox = 200;
      }

      return config;
    };

    const stopScan = useCallback(async () => {
      if (html5QrcodeRef.current) {
        console.log('Stopping scan...');
        try {
          await html5QrcodeRef.current.stop();
          html5QrcodeRef.current.clear();
        } catch (error) {
          console.error('Error stopping scan:', error);
        }
        setScanning(false);
        cancelScanning();
      }
    }, [cancelScanning]);

    const startScan = useCallback(async (selectedCamera: string) => {
      if (scannerRef.current && selectedCamera && !isModalVisible) {
        console.log('Starting scan...');
        setScanning(true);

        const config = calculateConfig();

        if(!html5QrcodeRef.current){
          html5QrcodeRef.current = new Html5Qrcode(scannerRef.current.id);
        }
        try {
          await html5QrcodeRef.current.start(
            selectedCamera,
            config,
            (decodedText) => {
              setQrContent(decodedText);
              setIsQRContentModalVisible(true);
              stopScan();
            },
            (error) => {
              if (qrCodeErrorCallback) qrCodeErrorCallback(error);
            }
          );
        } catch (err) {
          console.error('Error starting scan:', err);
          setScanning(false);
        }
      }
    }, [qrCodeErrorCallback, stopScan, isModalVisible]);

    useEffect(() => {
      if (selectedCamera) {
        startScan(selectedCamera);
      }
    }, [startScan, selectedCamera]);

    useEffect(() => {
      if (isModalVisible && scannerRef.current) {
        const width = scannerRef.current.offsetWidth;
        if (width > 0 && !scanning) {
          startScan(selectedCamera!);
        }
      }
    }, [isModalVisible, startScan, selectedCamera, scanning]);

    useImperativeHandle(ref, () => ({
      startScan: () => {
        if (selectedCamera) startScan(selectedCamera);
      },
      stopScan: stopScan,
    }));

    return (
      <div className="relative">
        <div
          id="qr-code-full-region"
          ref={scannerRef}
          className={`border-4 border-gray-500 dark:border-gray-300 w-full overflow-hidden`}
        />
        {loadingCameras && (
          <div className="w-full h-[400px] flex flex-col justify-center align-middle">
            <Spin size="large" />
            <div className="flex flex-col mt-3 text-center">
              <span className="text-secondary-300">Loading camera...</span>
              <span>Make sure camera is given access.</span>
            </div>
          </div>
        )}
        <SelectDefault
          className="mt-4 absolute top-0 left-3"
          options={cameraOptions}
          value={selectedCamera}
          onChange={(value) => setSelectedCamera(value)}
          disabled={loadingCameras}
        />
        <Button
          icon={<FontAwesomeIcon icon={faCircleXmark} />}
          onClick={stopScan}
          className="absolute right-3 bottom-4"
        >
          Cancel Scanning
        </Button>
        {isQRContentModalVisible && (
          <Modal
            title="Device Detail"
            open={isQRContentModalVisible}
            footer={[
              <Button key="back" onClick={() => setIsQRContentModalVisible(false)}>
                Cancel
              </Button>,
            ]}
          >
            {qrContent && <DeviceDetail deviceOem={qrContent} />}
          </Modal>
        )}
      </div>
    );
  }
);

QRCodeComponent.displayName = 'QRCodeComponent';
export default QRCodeComponent;
