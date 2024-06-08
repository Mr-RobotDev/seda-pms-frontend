import { Button } from 'antd';
import React, { useState } from 'react';
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

const FullScreenButton: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const handleFullScreen = () => {
    if (!isFullScreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Button onClick={handleFullScreen}>
      {isFullScreen ?
        <div className=' w-full h-full flex flex-row items-center gap-2'>
          <p className=' !mb-0'>Exit Full Screen</p>
          <MdFullscreenExit className=' w-6 h-6' />
        </div>
        :
        <div className=' w-full h-full flex flex-row items-center gap-2'>
          <p className=' !mb-0'>Enter Full Screen</p>
          <MdFullscreen className=' w-6 h-6' />
        </div>
      }
    </Button>
  );
};

export default FullScreenButton;
