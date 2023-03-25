import { defineField, defineType } from "sanity";

export default defineType({
  name: "userRole",
  title: "User Role",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "The email address of the user associated with the role",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "reference",
      to: [{ type: "role" }],
      description: "The role associated with the user",
    }),
  ],
});
