// pages/admin/dashboard.js
import Head from "next/head";
import Image from "next/image";
import Layout from "../../components/Dashboard/Layout";
import withAuthorization from "../../components/withAuthorization";
import { fetchTreatments } from "../../../utils/fetchTreatments";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import SidebarMenu from "../../components/Dashboard/SidebarMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BarLoading from "../../components/Loaders/BarLoading";

function DashboardPage() {
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [hudpleieData, setHudpleieData] = useState([]);
  const [fotpleieData, setFotpleieData] = useState([]);

  const handleMenuItemClick = (menuItem) => {
    const componentName = menuItem.replace(/\s+/g, ""); // Removes spaces from the menuItem
    setSelectedMenuItem(componentName);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    const fetchHudpleieData = async () => {
      const data = await fetchTreatments("hudpleie");
      console.log("Hudpleie data:", data);

      setHudpleieData(data);
    };

    fetchHudpleieData();
  }, []);

  useEffect(() => {
    const fetchFotpleieData = async () => {
      const data = await fetchTreatments("fotpleie");
      console.log("Fotpleie data:", data);

      setFotpleieData(data);
    };

    fetchFotpleieData();
  }, []);

  const TreatmentComponent = dynamic(
    () =>
      import(`../../components/Dashboard/Treatments/${selectedMenuItem}`).then(
        (module) => {
          const Component = module.default;
          Component.displayName = selectedMenuItem;
          return function WrappedComponent(props) {
            WrappedComponent.displayName = `Wrapped${selectedMenuItem}`;
            return (
              <Component
                {...props}
                hudpleie={hudpleieData}
                fotpleie={fotpleieData}
              />
            );
          };
        }
      ),
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
      <DndProvider backend={HTML5Backend}>
        <div className="md:pt-32 bg-[#f3f3f2]">
          <Layout>
            <SidebarMenu
              isExpanded={isSidebarExpanded}
              toggleMenu={toggleSidebar}
              onMenuItemClick={handleMenuItemClick}
            />
            <div
              className={`transition-all duration-300 ${
                isSidebarExpanded ? "ml-64" : "ml-20"
              }`}
            >
              {selectedMenuItem ? (
                <TreatmentComponent hudpleie={hudpleieData} />
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
      </DndProvider>
    </>
  );
}

export default withAuthorization(DashboardPage, ["admin"]);
