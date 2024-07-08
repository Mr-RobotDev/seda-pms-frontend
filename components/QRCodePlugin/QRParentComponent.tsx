import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import QRCodeComponent, { QRCodeComponentRef } from './QRCodeComponent';
import { ScanOutlined } from '@ant-design/icons';
import useIsMobile from '@/app/hooks/useMobile';

const QRParentComponent: React.FC = () => {
  const qrCodePluginRef = useRef<QRCodeComponentRef>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isMobile = useIsMobile();

  const handleQRCodeSuccess = (decodedText: string) => {
    console.log('QR Code scanned successfully:', decodedText);
    setIsModalVisible(false);
  };

  const handleQRCodeError = (error: any) => {};

  const startScan = () => {
    setIsModalVisible(true);
  };

  const stopScan = () => {
    if (qrCodePluginRef.current) {
      qrCodePluginRef.current.stopScan();
    }
  };

  useEffect(() => {
    if (isModalVisible && qrCodePluginRef.current) {
      qrCodePluginRef.current.startScan();
    } else if (!isModalVisible && qrCodePluginRef.current) {
      stopScan();
    }
  }, [isModalVisible]);

  return (
    <div>
      <Button icon={<ScanOutlined className='text-lg' />} onClick={startScan}>Scan QR Code</Button>
      <Modal
        title="QR Code Scanner"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="modal-responsive"
        width={`${isMobile ? '90%' : '80%'}`}
      >
        {isModalVisible && (
          <QRCodeComponent
            ref={qrCodePluginRef}
            qrCodeSuccessCallback={handleQRCodeSuccess}
            qrCodeErrorCallback={handleQRCodeError}
            cancelScanning={() => setIsModalVisible(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default QRParentComponent;
