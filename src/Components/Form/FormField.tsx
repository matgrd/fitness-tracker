import { useField } from "formik";
import TextField from "@mui/material/TextField";

interface FormFieldProp {
  name: string;
  label?: string;
  autoComplete?: string;
  type?: "text" | "number" | "email" | "password";
  formik: any;
  margin?: any;
}

export const FormField = ({
  name,
  label,
  autoComplete,
  type = "text",
  formik,
  margin = "normal",
}: FormFieldProp) => {
  const [field, meta, helpers] = useField(name);

  return (
    <TextField
      variant="outlined"
      margin={margin}
      fullWidth
      name={name}
      label={label ? label : name.slice(0, 1).toUpperCase() + name.slice(1)}
      autoComplete={autoComplete}
      type={type}
      onChange={formik.handleChange}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};
