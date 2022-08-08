import { useEffect, useState } from "react";
import { supabase } from "src/supabaseClient";
import { Loading } from "src/Components/Loading/Loading";
import Avatar from "@mui/material/Avatar";
import { IconButton } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";

export const UserAvatar = ({ url, onUpload, name }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from("avatar")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  };

  const uploadUserAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        console.log("We are here", uploadError);
      }
      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    }
    // finally {
    //   setUploading(false);
    // }
  };

  return (
    <Avatar
      name={name}
      src={avatarUrl ? avatarUrl : ""}
      sx={{
        m: 2,
        bgcolor: "#1b7700",
        height: 250,
        width: 250,
      }}
    >
      {uploading ? (
        <Loading />
      ) : (
        <>
          <IconButton component="label" sx={{ color: "white" }}>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={uploadUserAvatar}
              disabled={uploading}
            />
            <AttachFileIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </>
      )}
    </Avatar>
  );
};
