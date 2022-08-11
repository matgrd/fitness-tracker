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

  const [avatar, setAvatar] = useState(null);
  const onFileChange = (event) => {
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      setAvatar(file);
    }
  };

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

        if (avatar) {
          const file = avatar.name;
          const fileExt = file.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName.slice(2)}`;

          let { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, avatar);

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
        }

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
            name={avatar_url}
            url={avatar_url}
            onFileChange={onFileChange}
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
            {/* <input
              name="avatar_url"
              label="Your image"
              type="file"
              formik={formik}
              onChange={onFileChange}
            /> */}
          </>
        }
        buttonText="Update Profile"
      />
    </ProtectedRoute>
  );
};
