import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

const menuItems = [
  { text: "Handpleie", shortText: "HA..." },
  { text: "Fotpleie", shortText: "FO..." },
  { text: "Hudpleie", shortText: "HU..." },
  { text: "Vipper & Bryn", shortText: "VB..." },
  { text: "Gavekort", shortText: "GK..." },
  { text: "Klippekort", shortText: "KK..." },
];

export default function SidebarMenu({
  isExpanded,
  toggleMenu,
  onMenuItemClick,
}) {
  return (
    <div
      className={`h-screen fixed pt-24 left-0 top-0 bottom-0 bg-[#f3f3f2] text-slate-900 border-r border-slate-900 transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      <div className="flex justify-between border-b border-slate-900 pb-4">
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
              className="h-9 cursor-pointer px-4"
            />
          </>
        )}
      </div>
      <div
        className={`flex flex-col mt-20 space-y-1 text-lg uppercase ${
          isExpanded ? "" : "items-center"
        }`}
      >
        {menuItems.map(({ text, shortText }) => (
          <div
            key={text}
            onClick={() => onMenuItemClick(text)}
            className={`flex items-center space-x-2 px-4 py-2 cursor-pointer hover:bg-slate-100 transition-all duration-200 ${
              isExpanded ? "pl-8" : ""
            }`}
          >
            <div>{isExpanded ? text : shortText}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
