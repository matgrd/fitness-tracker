import { useState, useEffect } from "react";
import ProtectedRoute from "src/Components/ProtectedRoute/ProtectedRoute";
import { supabase } from "src/supabaseClient";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  usernameValidation,
  websiteValidation,
  avatarURLValidation,
} from "../ValidationAccountManagement/ValidationAccountManagement";
import { useAppDispatch } from "src/Redux/Hooks/Hooks";
import { setSnackbar } from "src/Redux/Slices/snackbarSlice";

import { FormField } from "../../Form/FormField";
import { CommonForm } from "../../Form/CommonForm";
import { UserAvatar } from "../UserAvatar/UserAvatar";

import Button from "@mui/material/Button";

export const Account = ({ session }) => {
  const dispatch = useAppDispatch();
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setProgress(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (data) {
        console.log("data", data);
        formik.setFieldValue("username", data.username);
        formik.setFieldValue("website", data.website);
        formik.setFieldValue("avatar", data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setProgress(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      website: "",
      avatar: null,
    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      username: usernameValidation,
      website: websiteValidation,
      avatar: avatarURLValidation,
    }),
    onSubmit: async (values) => {
      try {
        setProgress(true);
        const user = supabase.auth.user();

        if (values.avatar) {
          const file = values.avatar.name;
          const fileExt = file.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName.slice(2)}`;

          let { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, values.avatar);

          const { signedURL } = await supabase.storage
            .from("avatars")
            .createSignedUrl(filePath, 31556926);

          const updates = {
            id: user.id,
            updated_at: new Date(),
            username: values.username,
            avatar_url: signedURL,
            website: values.website,
          };

          let { error } = await supabase
            .from("profiles")
            .upsert(updates, { returning: "minimal" });

          if (error) {
            throw error;
          }
        } else {
          const updates = {
            id: user.id,
            updated_at: new Date(),
            username: values.username,
            avatar_url: user.avatar_url,
            website: values.website,
          };

          let { error } = await supabase
            .from("profiles")
            .upsert(updates, { returning: "minimal" });

          if (error) {
            throw error;
          }
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setProgress(false);
        dispatch(
          setSnackbar([true, "success", "You have updated your profile"])
        );
      }
    },
  });

  const onFileChange = (event) => {
    if (event.currentTarget.files) {
      formik.setFieldValue("avatar", event.currentTarget.files[0]);
    }
  };

  const handleDelete = async () => {
    if (!formik.values.avatar) {
      return dispatch(setSnackbar([true, "warning", "Add a picture first"]));
    }

    const user = supabase.auth.user();
    const updates = {
      id: user.id,
      updated_at: new Date(),
      username: user.username,
      avatar_url: null,
      website: user.website,
    };
    let { error } = await supabase
      .from("profiles")
      .upsert(updates, { returning: "minimal" });

    const removeFile = formik.values.avatar.split("?").shift().split("/").pop();

    const { data } = await supabase.storage
      .from("avatars")
      .remove([removeFile]);
    dispatch(setSnackbar([true, "success", "The photo has been deleted"]));
  };

  return (
    <ProtectedRoute>
      <CommonForm
        formik={formik}
        progress={progress}
        icon={
          <>
            <UserAvatar
              name={formik.values.avatar}
              url={formik.values.avatar}
              onFileChange={onFileChange}
            />
            <Button variant="outlined" onClick={handleDelete}>
              Delete photo
            </Button>
          </>
        }
        header="Your profile"
        formBody={
          <>
            <FormField
              name="username"
              label={
                formik.values.username ? formik.values.username : "Your Name"
              }
              formik={formik}
            />
            <FormField
              name="website"
              label={
                formik.values.website
                  ? formik.values.website
                  : "your@website.com"
              }
              formik={formik}
            />
          </>
        }
        buttonText="Update Profile"
      />
    </ProtectedRoute>
  );
};
