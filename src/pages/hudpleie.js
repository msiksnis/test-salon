import Head from "next/head";
import { fetchHudpleie } from "../../utils/fetchHudpleie";
import Hudpleie from "../components/Hudpleie";

export default function HudpleiePage({ hudpleie }) {
  return (
    <>
      <Head>
        <title> Test Atelier Beauté | Hudpleie</title>
        <meta name="description" content="Atelier Beauté Oslo. Hudpleie" />
        <meta name="keywords" content="hudpleie" />
      </Head>
      <Hudpleie hudpleie={hudpleie} />
    </>
  );
}

export async function getStaticProps() {
  const hudpleie = await fetchHudpleie();

  return {
    props: {
      hudpleie,
    },
    revalidate: 10,
  };
}
