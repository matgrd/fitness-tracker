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

import { FormField } from "../../Form/FormField";
import { CommonForm } from "../../Form/CommonForm";
import { UserAvatar } from "../UserAvatar/UserAvatar";

export const Account = ({ session }) => {
  const [progress, setProgress] = useState(false);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

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
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
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
      avatar_url: null,
    },
    validationSchema: yup.object().shape({
      username: usernameValidation,
      website: websiteValidation,
      avatar_url: avatarURLValidation,
    }),
    onSubmit: async (values) => {
      try {
        setProgress(true);
        const user = supabase.auth.user();

        //await na upload image i get url
        const updates = {
          id: user.id,
          ...values,
          updated_at: new Date(),
        };
        //drugi await na insert do bazy
        let { error } = await supabase
          .from("profiles")
          .upsert(updates, { returning: "minimal" });

        if (error) {
          throw error;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setProgress(false);
      }
    },
  });

  return (
    <ProtectedRoute>
      <CommonForm
        formik={formik}
        progress={progress}
        icon={
          <UserAvatar
            url={avatar_url}
            onUpload={(url) => {
              setAvatarUrl(url);
              formik.onSubmit({ username, website, avatar_url: url });
            }}
            name={avatar_url}
            formik={formik}
          />
        }
        header="Your profile"
        formBody={
          <>
            <FormField
              name="username"
              label={username ? username : "Your Name"}
              formik={formik}
            />
            <FormField
              name="website"
              label={website ? website : "your@website.com"}
              formik={formik}
            />
            <FormField
              name="avatar_url"
              label="Your image"
              type="file"
              formik={formik}
            />
          </>
        }
        buttonText="Update Profile"
      />
    </ProtectedRoute>
  );
};
