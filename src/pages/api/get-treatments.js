// get-treatments.js
import { client as createSanityClient } from "../../../lib/sanity.client";
import { groq } from "next-sanity";

export default async function handler(req, res) {
  try {
    const category = req.query.category;
    const gender = req.query.gender;
    const client = await createSanityClient();

    console.log("Request category:", category);
    console.log("Request gender:", gender);

    const treatmentsQuery = groq`
      *[_type == "treatment" && category == $category ${
        gender ? "&& gender == $gender" : ""
      }] | order(order asc) {
        _id,
        title,
        price,
        order,
        gender,
        ...
      }
    `;

    const queryParams = { category };
    if (gender) {
      queryParams.gender = gender;
    }

    const treatments = await client.fetch(treatmentsQuery, queryParams);

    console.log("Fetched treatments:", treatments);

    res.status(200).json({ treatments });
  } catch (error) {
    console.error("Error fetching treatments:", error);
    res.status(500).json({ error: "Error fetching treatments from Sanity" });
  }
}
