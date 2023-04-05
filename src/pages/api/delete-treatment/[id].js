import { client } from "../../../../lib/sanity.client";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const id = req.query.id;

    try {
      const sanityClient = await client();
      const response = await sanityClient.delete(id);

      if (response) {
        res
          .status(200)
          .json({ success: true, message: "Treatment deleted successfully." });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Error deleting treatment." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error deleting treatment: " + error.message,
      });
    }
  } else {
    res.setHeader("Allow", "DELETE");
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed.` });
  }
}
