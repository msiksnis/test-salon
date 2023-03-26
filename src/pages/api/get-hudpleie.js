import { groq } from "next-sanity";
import { client } from "../../../lib/sanity.client";

const hudpleieQuery = groq`
*[_type == "treatment" && category == "hudpleie"] {
    _id,
    ...
  }
`;

export default async function handler(req, res) {
  const hudpleie = await client.fetch(hudpleieQuery);

  res.status(200).json({ hudpleie });
}
