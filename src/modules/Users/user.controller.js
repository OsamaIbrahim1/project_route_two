import User from "../../../DB/models/user.model.js";
import { findDocument, createDocument } from "../../../DB/dbMethods.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generateUniqueString.js";

//=============================== Sign Up ============================//
/**
 * destructuring data from req.body
 * check username is already exists
 * if exists return error
 * check email is already exists
 * if exists return error
 * hash password
 * if not hashed password return error
 * create new user
 * if not create new user return error
 * return success response
 */
export const SignUp = async (req, res, next) => {
  const { username, email, password, age, gender, phone } = req.body;
  const isUserExist = await findDocument(User, { username });
  if (isUserExist.success) {
    return next(new Error(isUserExist.mes, { cause: isUserExist.status }));
  }
  const isEmailExist = await findDocument(User, { email });
  if (isEmailExist.success) {
    return next(new Error(isEmailExist.mes, { cause: isEmailExist.status }));
  }
  const passwordHash = bcryptjs.hashSync(password, +process.env.SALTS_NUMPER);
  if (!passwordHash) {
    return next(new Error("Hashed password Failed", 400));
  }

  const createUser = await createDocument(User, {
    username,
    email,
    password: passwordHash,
    age,
    gender,
    phone,
  });

  if (!createUser.success) {
    return next(new Error(createUser.mes, { cause: createUser.status }));
  }
  res.status(201).json({ message: createUser.mes });
};

//=============================== Sign In ============================//
/**
 * destructuring data from req.body
 * check is user (email or username) exists
 * if user not exists return error
 * check is user isDeleted
 * check password is match
 * if password not matched return error
 * generate userToken ( id, username, email, age, gender, isdeleted )
 * return success response
 */
export const signIn = async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await findDocument(User, { $or: [{ username }, { email }] });
  if (!user.success) {
    return next(new Error(user.mes, { cause: user.status }));
  }
  if (user.isDocumentExists.isDeleted) {
    return next(new Error("This Account Deleted", { cause: 400 }));
  }
  const checkedPassword = bcryptjs.compareSync(
    password,
    user.isDocumentExists.password
  );
  if (!checkedPassword) {
    return next(new Error("Enter Correct Password", { cause: 400 }));
  }
  const token = jwt.sign(
    {
      id: user.isDocumentExists._id,
      username: user.isDocumentExists.username,
      email: user.isDocumentExists.email,
      age: user.isDocumentExists.age,
      gender: user.isDocumentExists.gender,
      isdeleted: user.isDocumentExists.isDeleted,
    },
    process.env.PRIVATE_KEY,
    { expiresIn: "1d" }
  );
  return res.status(200).json({ message: user.mes, user, token });
};

//=============================== Change Password ============================//
/**
 * destructuring data from req.body
 * destructuring data from req.authUser (loggedInUser)
 * if user wont to change password we need to if email or username already exists
 * compare old password
 * if password not match old password return error
 * hash new password
 * update password
 * return success response
 */
export const changePassword = async (req, res, next) => {
  const { password, newPassword } = req.body;
  const { _id, username, email } = req.authUser;
  if (email || username) {
    const user = await findDocument(User, {
      $or: [{ username }, { email }],
    });
    const checkedPassword = bcryptjs.compareSync(
      password,
      user.isDocumentExists.password
    );
    if (!checkedPassword) {
      return next(new Error("Password mismatch", 400));
    }
  }
  const hashNewPassword = bcryptjs.hashSync(
    newPassword,
    +process.env.SALTS_NUMPER
  );
  const updatePassword = await User.findByIdAndUpdate(
    { _id },
    { password: hashNewPassword }
  );
  // console.log(updatePassword)
  res.status(201).json({ message: "Update password", updatePassword });
};

//=============================== Update User ============================//
/**
 *destructuring data from req.body
 * destructuring data from req.authUser (loggedInUser)
 * if user wont to update his data { username, email, age, gender, phone } we need to if (email or username) already exists
 * if(email or username) exists return error
 * update user data
 * if user data not updated return error
 * return success response
 */
export const updateUser = async (req, res, next) => {
  const { username, email, age, gender, phone } = req.body;
  const { _id } = req.authUser;
  const isUserExist = await findDocument(User, { username });
  if (isUserExist.success) {
    return next(new Error(isUserExist.mes, { cause: isUserExist.status }));
  }
  const isEmailExist = await findDocument(User, { email });
  if (isEmailExist.success) {
    return next(new Error(isEmailExist.mes, { cause: isEmailExist.status }));
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      username,
      email,
      age,
      phone,
      phone,
    },
    { new: true }
  );
  if (!updatedUser) {
    return next(new Error("update fail", { cause: 400 }));
  }
  res.status(200).json({ message: "done", updatedUser });
};

//=============================== Delete User ============================//
/**
 * destructuring data from req.authUser (loggedInUser)
 * find user and delete
 * if user not deleted return error
 * return success response
 */
export const deleteUser = async (req, res, next) => {
  const { _id } = req.authUser;
  const userDeleted = await User.findByIdAndDelete(_id);
  if (!userDeleted) {
    return next(new Error("delete fail", { cause: 400 }));
  }
  res.status(200).json({ message: "User deleted", userDeleted });
};

//=============================== Soft Delete User ============================//
/**
 * destructuring data from req.authUser (loggedInUser)
 * find user and update feild (isDeleted => true)
 * if feild (isDeleted => true) return error
 * return success response
 */
export const softDelete = async (req, res, next) => {
  const { _id } = req.authUser;
  const user = await User.findByIdAndUpdate({ _id }, { isDeleted: true });
  if (!user) {
    return next(new Error("User not Updated", { cause: 400 }));
  }
  res.status(200).json({ message: "User Deleted successfully" });
};

/**
 * destructuring data from req.authUser (loggedInUser)
 * find user by Id
 * return success response
 */
export const imageUser = async (req, res, next) => {
  const { _id } = req.authUser;
  const user = await User.findById(_id);
  res.status(200).json({
    message: "Image User Uploaded successfully",
    image_Data: req.file,
    user_Data: user,
  });
};
