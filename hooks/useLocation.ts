import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export type LocationData = {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
};

const DEFAULT_LOCATION: LocationData = {
  latitude: 23.8103,
  longitude: 90.4125,
  city: 'Dhaka',
  country: 'Bangladesh',
};

export function useLocation() {
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (mounted) {
            setError('Location permission denied');
            setLoading(false);
          }
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        let city = DEFAULT_LOCATION.city;
        let country = DEFAULT_LOCATION.country;

        try {
          const [geo] = await Location.reverseGeocodeAsync({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          if (geo) {
            city = geo.city ?? geo.subregion ?? city;
            country = geo.country ?? country;
          }
        } catch {
          // reverse geocode optional
        }

        if (mounted) {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            city,
            country,
          });
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setError('Could not get location');
          setLoading(false);
        }
      }
    }

    fetchLocation();
    return () => {
      mounted = false;
    };
  }, []);

  return { location, loading, error };
}
