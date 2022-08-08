import { mapStyles } from "./MapStyles";

export const containerStyle = {
  width: "100%",
  height: "100vh",
};

export const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
