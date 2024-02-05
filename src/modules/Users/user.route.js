import { Router } from "express";
import EAH from "express-async-handler";
import * as uc from "./user.controller.js";
import { auth } from "../../middlewares/authmiddleware.js";
import { validationMiddleWare } from "../../middlewares/validation.middleware.js";
import {
  chPassSchema,
  deleteUserSchema,
  signInSchema,
  signUpSchema,
  softDeleteUserSchema,
  updateUserSchema,
} from "./user.validationSchemas.js";
import { multerMiddle } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";

const router = Router();

router.post("/signup", validationMiddleWare(signUpSchema), EAH(uc.SignUp));

router.post("/signin", validationMiddleWare(signInSchema), EAH(uc.signIn));

router.patch(
  "/changePassword",
  auth(),
  validationMiddleWare(chPassSchema),
  EAH(uc.changePassword)
);

router.put(
  "/updateUser",
  auth(),
  validationMiddleWare(updateUserSchema),
  EAH(uc.updateUser)
);

router.delete(
  "/deleteUser",
  auth(),
  validationMiddleWare(deleteUserSchema),
  EAH(uc.deleteUser)
);

router.patch(
  "/softDelete",
  auth(),
  validationMiddleWare(softDeleteUserSchema),
  EAH(uc.softDelete)
);

router.post(
  "/imageUser",
  auth(),
  multerMiddle({
    extensions: allowedExtensions.image,
    filePath: "customers/profiles",
  }).single("picture"),
  EAH(uc.imageUser)
);

export default router;
