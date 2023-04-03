import { createClient } from "next-sanity";
import { getSanityToken } from "../utils/sanityAuth";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

export const client = async (user = null) => {
  const token = user
    ? await getSanityToken(user)
    : process.env.SANITY_API_TOKEN;

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
  });
};
