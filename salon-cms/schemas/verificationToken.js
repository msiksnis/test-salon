// verificationToken.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "verification-token",
  title: "Verification Token",
  type: "document",
  fields: [
    defineField({
      name: "identifier",
      title: "Identifier",
      type: "string",
    }),
    defineField({
      name: "token",
      title: "Token",
      type: "string",
    }),
    defineField({
      name: "expires",
      title: "Expires",
      type: "date",
    }),
  ],
});
