// /pages/api/getMaxOrder.js
import { client } from "../../../lib/sanity.client";

export default async function handler(req, res) {
  const { query } = req.body;

  try {
    const maxOrder = await client.fetch(query);
    res.status(200).json(maxOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
