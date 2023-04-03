import Head from "next/head";
import { fetchTreatments } from "../../utils/fetchTreatments";
import Hudpleie from "../components/Hudpleie";

export default function HudpleiePage({ hudpleie }) {
  return (
    <>
      <Head>
        <title> Test Atelier Beauté | Hudpleie</title>
        <meta name="description" content="Atelier Beauté Oslo. Hudpleie" />
        <meta name="keywords" content="hudpleie, skin care" />
      </Head>
      <Hudpleie hudpleie={hudpleie} />
    </>
  );
}

export async function getStaticProps() {
  const hudpleie = await fetchTreatments("hudpleie");

  return {
    props: {
      hudpleie,
    },
    revalidate: 10,
  };
}
