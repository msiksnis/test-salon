// get-treatments.js
import { client as createSanityClient } from "../../../lib/sanity.client";
import { groq } from "next-sanity";

export default async function handler(req, res) {
  const category = req.query.category;
  const client = await createSanityClient(); // Initialize client with the token

  const treatmentsQuery = groq`
    *[_type == "treatment" && category == $category] | order(order asc) {
      _id,
      title,
      price,
      order,
      ...
    }
  `;

  const treatments = await client.fetch(treatmentsQuery, { category });

  res.status(200).json({ treatments });
}
