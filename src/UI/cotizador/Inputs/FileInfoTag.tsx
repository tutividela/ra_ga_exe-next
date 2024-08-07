import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { IconButton } from "@mui/material";

interface FileInfoTagProps {
  file: File;
  onRemove: (fileName: string) => void;
}

const FileInfoTag = ({ file, onRemove }: FileInfoTagProps) => {
  const handleRemove = () => {
    onRemove(file.name);
  };

  return (
    <div className=" bg-gray-200 max-w-[10rem]  md:w-full p-1 flex flex-row m-1 items-center text-gray-800 rounded-lg">
      <div className="mx-2 truncate ">
        <p>{file.name}</p>
      </div>
      <div>
        <IconButton onClick={handleRemove}>
          <HighlightOffOutlinedIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default FileInfoTag;
