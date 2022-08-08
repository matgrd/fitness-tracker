import * as yup from "yup";

const isRequired = "is required";

export const emailValidation = yup
  .string()
  .required(`Email ${isRequired}`)
  .email("Invalid email address");

export const passwordValidation = yup
  .string()
  .required(`Password ${isRequired}`)
  .min(6, "Must be 6 characters or more");

export const usernameValidation = yup
  .string()
  .required(`Username ${isRequired}`)
  .min(4, "Must be 4 characters or more")
  .max(15, "Must be 15 characters or less");

export const websiteValidation = yup
  .string()
  .required(`Website ${isRequired}`)
  .matches(
    /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
    "Invalid website url"
  );

export const avatarURLValidation = yup.mixed();
