import { useEffect, useRef, useState, useMemo } from "react";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { useGeoLocation } from "./useGeoLocation";
import { useWatchPosition } from "./useWatchPosition";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { containerStyle, options } from "./Settings";
import { Loading } from "../Loading/Loading";
import { supabase } from "src/supabaseClient";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export const Location = () => {
  const location = useGeoLocation();
  const parameters = useWatchPosition();
  const user: any = supabase.auth.user();

  const [currentTrainingId, setCurrentTrainingId] = useState("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  // console.log("latitude", latitude);
  // console.log("longitude", longitude);

  const oldLatitude = useRef();
  const oldLongitude = useRef();
  // console.log("oldLatitude", oldLatitude);
  // console.log("oldLongitude", oldLongitude);

  const checkGeographicalCoordinates = () => {
    if (parameters.loaded) {
      const latitudeToFixed = parameters.data.latitude.toFixed(4);
      const longitudeToFixed = parameters.data.longitude.toFixed(4);

      oldLatitude.current = latitudeToFixed;
      oldLongitude.current = longitudeToFixed;

      if (latitude === 0) {
        setLatitude(latitudeToFixed);
      }
      if (longitude === 0) {
        setLongitude(longitudeToFixed);
      }

      if (latitudeToFixed !== oldLatitude.current) {
        setLatitude(latitudeToFixed);
        oldLatitude.current = latitudeToFixed;
      }

      if (longitudeToFixed !== oldLongitude.current) {
        setLatitude(longitudeToFixed);
        oldLongitude.current = longitudeToFixed;
      }
    }
  };

  const updateTraining = async () => {
    if (currentTrainingId !== "") {
      let { error } = await supabase.from("training").insert(
        {
          training_id: currentTrainingId,
          latitude: latitude,
          longitude: longitude,
          count: new Date(),
        },
        { returning: "minimal" }
      );
    }
  };

  useEffect(() => {
    checkGeographicalCoordinates();
  }, [parameters]);

  useEffect(() => {
    updateTraining();
  }, [latitude, longitude]);

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

  const handleStart = async () => {
    const updates = {
      user: user.id,
      training_name: "name",
      type_of_training: "type",
      start_of_training: new Date(),
    };

    let { data, error } = await supabase
      .from("userTraining")
      .upsert(updates)
      .single();
    setCurrentTrainingId(data.id);
  };

  const handleEnd = async () => {
    const { data, error } = await supabase
      .from("userTraining")
      .update({ end_of_training: new Date() })
      .match({ user: user.id });
    setCurrentTrainingId("");
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
        <Container
          component="div"
          maxWidth="xl"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginBottom: 5,
          }}
        >
          {currentTrainingId === "" ? (
            <Stack spacing={2} direction="row">
              <Button
                style={{ width: 75 }}
                variant="contained"
                color="secondary"
                onClick={handleStart}
                type="submit"
              >
                Start
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2} direction="row">
              <Button
                style={{ width: 75 }}
                variant="contained"
                color="secondary"
                onClick={handleEnd}
                type="submit"
              >
                End
              </Button>
            </Stack>
          )}
        </Container>
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
