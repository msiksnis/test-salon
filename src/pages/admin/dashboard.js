import Head from "next/head";
import Image from "next/image";
import Layout from "../../components/Dashboard/Layout";
import withAuthorization from "../../components/withAuthorization";

function DashboardPage() {
  return (
    <>
      <Head>
        <title> Dashboard </title>
        <meta name="description" content="" />
      </Head>
      <Layout>
        <div className="p-10 min-h-screen flex items-center justify-center">
          <Image
            src="/favicon.ico"
            width={150}
            height={150}
            alt="placeholder"
            className="object-cover mr-10 md:mr-32 mb-32"
          />
        </div>
      </Layout>
    </>
  );
}

export default withAuthorization(DashboardPage, ["admin"]);
