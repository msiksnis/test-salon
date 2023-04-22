import Head from "next/head";
import Layout from "../../components/Dashboard/Layout";
import withAuthorization from "../../components/withAuthorization";
import dynamic from "next/dynamic";
import { useState } from "react";
import SidebarMenu from "../../components/Dashboard/SidebarMenu";
import BarLoading from "../../components/Loaders/BarLoading";

function DashboardPage() {
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleMenuItemClick = (menuItem) => {
    const componentName = menuItem.replace(/\s+/g, ""); // Removes spaces from the menuItem
    setSelectedMenuItem(componentName);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const TreatmentComponent = dynamic(
    () => import("../../components/Dashboard/DraggableTreatmentList"),
    {
      loading: () => (
        <div className="flex justify-center items-center">
          <BarLoading />
        </div>
      ),
      ssr: false,
    }
  );

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="" />
      </Head>
      <div className="md:pt-[6.5rem] bg-[#f3f3f2] pb-10">
        <Layout>
          <SidebarMenu
            isExpanded={isSidebarExpanded}
            toggleMenu={toggleSidebar}
            onMenuItemClick={handleMenuItemClick}
          />
          <div
            className={`transition-all duration-300 ${
              isSidebarExpanded ? "ml-[15.5rem]" : "ml-16"
            }`}
          >
            {selectedMenuItem ? (
              <TreatmentComponent category={selectedMenuItem.toLowerCase()} />
            ) : (
              <div className="">
                {/* <Image
                  src="/favicon.ico"
                  width={150}
                  height={150}
                  alt="placeholder"
                  className="object-cover mr-10 md:mr-32 mb-32"
                /> */}
              </div>
            )}
          </div>
        </Layout>
      </div>
    </>
  );
}

export default withAuthorization(DashboardPage, ["admin"]);
