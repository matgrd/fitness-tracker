import { useEffect, useState } from "react";

interface ILocationData {
  loaded: boolean;
  coordinates?: {
    lat: string;
    lng: string;
  };
  error?: Error;
}

export const useGeoLocation = () => {
  const [location, setLocation] = useState<ILocationData>({
    loaded: false,
    coordinates: { lat: "", lng: "" },
  });

  const onSuccess = (location: any) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    });
  };

  const onError = (error: any) => {
    setLocation({
      loaded: true,
      error,
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      onError({
        error: {
          code: 0,
          message: "Geolocation not supported",
        },
      });
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
};
