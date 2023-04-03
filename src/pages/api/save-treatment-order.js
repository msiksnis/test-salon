// save-treatment-order.js
import { client as createSanityClient } from "../../../lib/sanity.client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { treatments } = req.body;

  try {
    const sanityClient = await createSanityClient();
    const transaction = sanityClient.transaction();

    treatments.forEach((treatment, index) => {
      transaction.patch(treatment._id, { set: { order: index } });
    });

    await transaction.commit();
    res.status(200).json({ message: "Treatments order saved successfully" });
  } catch (error) {
    console.error("Error saving treatments order:", error);
    res.status(500).json({ message: "Error saving treatments order" });
  }
}
