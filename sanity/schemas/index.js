// index.js from sanity/schemas
import blockContent from "./blockContent";
import category from "./category";
import post from "./post";
import author from "./author";
import role from "./role";
import userRole from "./userRole";
import treatment from "./treatment";
import user from "./user";
import account from "./account";
import verificationToken from "./verificationToken";

export const schemaTypes = [
  post,
  author,
  category,
  blockContent,
  role,
  userRole,
  treatment,
  user,
  account,
  verificationToken,
];
