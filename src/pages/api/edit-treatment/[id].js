// pages/api/edit-treatment/[id].js
import { client } from "../../../../lib/sanity.client";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const sanityClient = await client();

  if (method === "PUT") {
    try {
      const {
        title,
        order,
        price,
        directLink,
        shortDescription,
        fullDescription,
        genre,
        category,
      } = req.body;

      if (!title || !price) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }

      const response = await sanityClient
        .patch(id)
        .set({
          title,
          order,
          price,
          directLink,
          shortDescription,
          fullDescription,
          genre,
          category,
        })
        .commit();

      if (!response) {
        return res
          .status(404)
          .json({ success: false, message: "Treatment not found" });
      }

      res.status(200).json({ success: true, data: response });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error updating treatment" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res
      .status(405)
      .json({ success: false, message: `Method ${method} not allowed` });
  }
}
