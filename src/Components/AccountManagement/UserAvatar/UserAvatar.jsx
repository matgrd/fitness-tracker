import Avatar from "@mui/material/Avatar";
import { IconButton } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";

export const UserAvatar = ({ name, url, onFileChange }) => {
  return (
    <Avatar
      name={name}
      src={url ? url : ""}
      sx={{
        m: 2,
        bgcolor: "#1b7700",
        height: 250,
        width: 250,
      }}
    >
      <IconButton component="label" sx={{ color: "white" }}>
        <input type="file" accept="image/*" hidden onChange={onFileChange} />
        <AttachFileIcon sx={{ fontSize: 75 }} />
      </IconButton>
    </Avatar>
  );
};
