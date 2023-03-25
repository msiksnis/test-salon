import { defineField, defineType } from "sanity";

export default defineType({
  name: "role",
  title: "Role",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "The name of the role, e.g., admin, user, guest",
    }),
  ],
});
