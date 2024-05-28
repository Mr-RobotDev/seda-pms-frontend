import { useEffect, useState } from 'react';

const useBrowserDetect = () => {
  const [browser, setBrowser] = useState('');

  useEffect(() => {
    const userAgent = navigator.userAgent;

    if (userAgent.includes('Firefox')) {
      setBrowser('Firefox');
    } else if (userAgent.includes('SamsungBrowser')) {
      setBrowser('Samsung Internet');
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
      setBrowser('Opera');
    } else if (userAgent.includes('Trident')) {
      setBrowser('Internet Explorer');
    } else if (userAgent.includes('Edge')) {
      setBrowser('Edge');
    } else if (userAgent.includes('Chrome')) {
      setBrowser('Chrome');
    } else if (userAgent.includes('Safari')) {
      setBrowser('Safari');
    } else {
      setBrowser('Unknown');
    }
  }, []);

  return browser;
};

export default useBrowserDetect;