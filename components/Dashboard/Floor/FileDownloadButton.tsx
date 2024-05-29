'use client'
import React, { useState } from 'react';
import { Button, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axiosInstance';

interface FileDownloadButtonProps {
  from: string;
  to: string;
  oem: string;
}

const FileDownloadButton = ({ from, to, oem }: FileDownloadButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/events/export', {
        params: {
          oem,
          from,
          to,
        },
      });

      if (response.status === 200) {
        setDownloadUrl(response.data.url);
        const link = document.createElement('a');
        link.href = response.data.url;
        link.setAttribute('download', 'Events.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error('Error fetching the download URL');
      }
    } catch (error) {
      toast.error('Error fetching the download URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? <Spin /> : 'Download Events CSV'}
      </Button>
    </div>
  );
};

export default FileDownloadButton;
