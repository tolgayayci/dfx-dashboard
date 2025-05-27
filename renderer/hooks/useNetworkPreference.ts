import { useState, useEffect } from 'react';

export default function useNetworkPreference() {
  const [networkPreference, setNetworkPreference] = useState<string>('local');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNetworkPreference = async () => {
      try {
        const preference = await window.awesomeApi.getNetworkPreference();
        setNetworkPreference(preference || 'local');
      } catch (error) {
        console.error('Error fetching network preference:', error);
        setNetworkPreference('local');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNetworkPreference();
  }, []);

  const updateNetworkPreference = async (newPreference: string) => {
    try {
      await window.awesomeApi.setNetworkPreference(newPreference);
      setNetworkPreference(newPreference);
    } catch (error) {
      console.error('Error updating network preference:', error);
    }
  };

  return {
    networkPreference,
    setNetworkPreference: updateNetworkPreference,
    isLoading
  };
} 