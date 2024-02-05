import multer from "multer";
import generateUniqueString from "../utils/generateUniqueString.js";
import { allowedExtensions } from "../utils/allowedExtensions.js";

import fs from "fs";
import path from "path";

export const multerMiddle = ({
  extensions = allowedExtensions.image,
  filePath = "general",
}) => {
  const destinationPath = path.resolve(`uploads/${filePath}`);
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      const uniqueFileName = generateUniqueString(6) + "_" + file.originalname;
      cb(null, uniqueFileName);
    },
  });
  const fileFilter = (req, file, cb) => {
    // console.log({ file });
    // console.log(file.mimetype);
    if (extensions.includes(file.mimetype.split("/")[1])) {
      return cb(null, true);
    }
    cb(new Error("Image Format allowed!!"), false);
  };
  const file = multer({ fileFilter, storage });
  return file;
};
