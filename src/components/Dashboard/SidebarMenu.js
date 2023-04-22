import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

const menuItems = [
  { text: "Handpleie", icon: "/icons/handpleie.svg" },
  { text: "Fotpleie", icon: "/icons/fotpleie.svg" },
  { text: "Hudpleie", icon: "/icons/hudpleie.svg" },
  { text: "Vipper & Bryn", icon: "/icons/vippe-bryn.svg" },
  { text: "Gavekort", icon: "/icons/gavekort.svg" },
  { text: "Klippekort", icon: "/icons/klippekort.svg" },
];

export default function SidebarMenu({
  isExpanded,
  toggleMenu,
  onMenuItemClick,
}) {
  return (
    <div
      className={`fixed m-6 mt-[6.5rem] px-2 py-4 left-0 top-0 bottom-0 bg-white rounded-md text-slate-900 shadow-box transition-width duration-300 overflow-hidden ${
        isExpanded ? "w-64" : "w-[4.5rem]"
      }`}
    >
      <div className="flex justify-between">
        {!isExpanded && (
          <Image
            src="/icons/grid_dots.svg"
            alt="menu icon"
            width={20}
            height={20}
            onClick={toggleMenu}
            className="flex justify-center w-full h-9 cursor-pointer transition-opacity duration-300"
          />
        )}
        {isExpanded && (
          <>
            <Image
              src="/icons/grid_dots.svg"
              alt="menu icon"
              width={20}
              height={20}
              onClick={toggleMenu}
              className="opacity-0 flex justify-center w-full h-9 cursor-pointer transition-opacity duration-300"
            />
            <ArrowLeftIcon
              onClick={toggleMenu}
              className="h-9 cursor-pointer"
            />
          </>
        )}
      </div>
      <div className="flex flex-col mt-20 space-y-4 text-lg whitespace-nowrap uppercase">
        {menuItems.map(({ text, icon }) => (
          <div
            key={text}
            onClick={() => onMenuItemClick(text)}
            className="flex items-center cursor-pointer hover:bg-slate-100 transition-all duration-300"
          >
            <div className="relative flex items-center space-x-4 ml-1">
              <Image
                src={icon}
                alt={text}
                width={50}
                height={50}
                className="bg-slate-100 rounded-full p-1.5"
              />
              <div className="absolute left-12 w-48 overflow-hidden">
                {text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
