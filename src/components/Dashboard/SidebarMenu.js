import { Bars3Icon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { BeakerIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const menuItems = [
  { text: "Handpleie", icon: BeakerIcon },
  { text: "Futpleie", icon: BeakerIcon },
  { text: "Hudpleie", icon: BeakerIcon },
  { text: "Vipper & Bryn", icon: BeakerIcon },
  { text: "Gavekort", icon: BeakerIcon },
  { text: "Klippekort", icon: BeakerIcon },
];

export default function SidebarMenu({
  isExpanded,
  toggleMenu,
  onMenuItemClick,
}) {
  return (
    <div
      className={`h-screen fixed left-0 py-24 bg-white text-slate-900 border-r border-slate-900 px-4 transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
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
      <div
        className={`flex flex-col mt-20 space-y-1 text-lg uppercase ${
          isExpanded ? "" : "items-center"
        }`}
      >
        {menuItems.map(({ text, icon: Icon }) => (
          <div
            key={text}
            onClick={() => onMenuItemClick(text)}
            className={`flex items-center space-x-2 px-4 py-2 cursor-pointer hover:bg-slate-100 transition-all duration-200 ${
              isExpanded ? "pl-8" : ""
            }`}
          >
            <Icon className="h-6" />
            <div className={isExpanded ? "" : "hidden"}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
