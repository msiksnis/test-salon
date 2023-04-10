// pages/api/create-treatment.js
import { client as createSanityClient } from "../../../lib/sanity.client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const treatmentData = req.body;

  try {
    const sanityClient = await createSanityClient();
    const newTreatment = await sanityClient.create({
      _type: "treatment",
      ...treatmentData,
    });

    res
      .status(200)
      .json({ message: "Treatment created successfully", newTreatment });
  } catch (error) {
    console.error("Error creating treatment:", error);
    res.status(500).json({ message: "Error creating treatment" });
  }
}
