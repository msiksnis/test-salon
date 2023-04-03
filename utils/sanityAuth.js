// utils/sanityAuth.js
import { createClient } from "@sanity/client";

export const sanityClientWithToken = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
});

export async function getSanityToken(user) {
  const query = `*[_type == "user" && email == $email][0]{
    "token": apiToken,
  }`;

  const params = {
    email: user.email,
  };

  try {
    const sanityUser = await client.fetch(query, params);
    console.log("Sanity user:", sanityUser);

    if (sanityUser && sanityUser.token) {
      console.log("Sanity token:", sanityUser.token);
      return sanityUser.token;
    } else {
      console.log("No Sanity token found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Sanity token:", error);
    return null;
  }
}
