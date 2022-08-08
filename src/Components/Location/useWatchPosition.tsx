import { useEffect, useState } from "react";

interface OptionsState {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}

const options: OptionsState = {
  enableHighAccuracy: true,
  timeout: 1000,
  maximumAge: 0,
};

export const useWatchPosition = () => {
  const [parameters, setParameters] = useState<object | any>({
    recount: 0,
    loaded: false,
    data: {
      accuracy: "",
      latitude: "",
      longitude: "",
      altitude: "",
      heading: "",
      speed: "",
    },
  });

  const onSuccess = (location: any) => {
    console.log("location", location);
    setParameters((prev: any) => ({
      recount: prev.recount++,
      loaded: true,
      data: {
        accuracy: location.coords.accuracy,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        heading: location.coords.heading,
        speed: location.coords.speed,
      },
    }));
  };

  const onError = (error: any) => {
    setParameters({
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
    let id = navigator.geolocation.watchPosition(onSuccess, onError, options);
    return () => {
      navigator.geolocation.clearWatch(id);
    };
  }, []);

  // setTimeout(
  //   () => navigator.geolocation.watchPosition(onSuccess, onError, options),
  //   5000
  // );

  return parameters;
};
