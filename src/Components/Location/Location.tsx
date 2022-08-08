import { useRef } from "react";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { useGeoLocation } from "./useGeoLocation";
import { useWatchPosition } from "./useWatchPosition";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { containerStyle, options } from "./Settings";
import { Loading } from "../Loading/Loading";

export const Location = () => {
  const location = useGeoLocation();
  const parameters = useWatchPosition();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY!,
  });

  // <google.maps.Map<Element> | null>
  const mapRef = useRef<any | null>(null);

  // google.maps.Map<Element>
  const onLoad = (map: any): void => {
    mapRef.current = map;
  };

  const unMount = (): void => {
    mapRef.current = null;
  };

  const center = {
    lat: parameters.data.latitude,
    lng: parameters.data.longitude,
  };

  return (
    <ProtectedRoute>
      <>
        <div style={{ textAlign: "center" }}>
          <h1>Location</h1>
          <p>
            {location.loaded
              ? JSON.stringify(location)
              : "Location data not available yet"}
          </p>
          <p>
            {parameters.loaded
              ? JSON.stringify(parameters)
              : "Parameters data not available yet"}
          </p>
        </div>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            options={options as google.maps.MapOptions}
            center={center}
            zoom={18}
            onLoad={onLoad}
            onUnmount={unMount}
          />
        ) : (
          <Loading />
        )}
      </>
    </ProtectedRoute>
  );
};
