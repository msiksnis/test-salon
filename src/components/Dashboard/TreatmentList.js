import { motion, AnimatePresence } from "framer-motion";
import { TbDragDrop2 as DragDropIcon } from "react-icons/tb";
import { HiOutlineTrash as Delete } from "react-icons/hi";
import { FiEdit as Edit } from "react-icons/fi";
import BarLoading from "../Loaders/BarLoading";

export default function TreatmentList({
  treatments,
  onEdit,
  onDelete,
  onMouseDown,
  itemRefs,
  containerHeight,
  loading,
  lastPress,
  isPressed,
  mouse,
}) {
  const getYPosition = (index) => {
    return index * 0;
  };

  return (
    <div
      className="flex flex-col items-center"
      style={{ minHeight: `${containerHeight}px` }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <BarLoading />
        </div>
      ) : (
        <AnimatePresence>
          {treatments
            .filter((item) => item && item._id)
            .map((item, index) => {
              let style;
              let y;
              const isActive =
                item &&
                item._id &&
                lastPress &&
                item._id === lastPress &&
                isPressed;

              if (isActive) {
                [, y] = mouse;
                style = {
                  y: y,
                  scale: 1.02,
                };
              } else {
                y = getYPosition(index);
                style = {
                  y: y,
                  scale: 1,
                };
              }

              return (
                <motion.div
                  ref={(el) => {
                    if (el) {
                      itemRefs.current.set(item._id, el);
                    } else {
                      itemRefs.current.delete(item._id);
                    }
                  }}
                  key={item._id}
                  initial={{ y: y, scale: 1 }}
                  animate={style}
                  onMouseDown={onMouseDown.bind(null, item._id, [0, y])}
                  className={`mb-4 bg-white rounded group w-full shadow-4 hover:bg-[#f3f3f2] transition-colors duration-300 py-1 select-none cursor-grab${
                    isActive ? "cursor-grabbing" : ""
                  }`}
                  style={{
                    zIndex: item === lastPress ? 99 : index,
                    width: "calc(100% - 80px)",
                    marginLeft: "40px",
                    marginRight: "40px",
                  }}
                >
                  <div className="grid grid-cols-[auto,1fr,auto,auto] items-center gap-x-4 pl-4 pr-1">
                    <DragDropIcon className="h-6 w-6 opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="grid grid-rows-[auto,auto] gap-0">
                      <div className="truncate">{item.title}</div>
                      <p className="truncate text-sm opacity-60">
                        {item.shortDescription}
                      </p>
                    </div>
                    <h3 className="whitespace-nowrap font-normal">
                      {item.price} kr
                    </h3>
                    <div className="grid grid-rows-2 border-l border-gray-400 ">
                      <Edit
                        data-drag-disabled
                        onClick={() => onEdit(item)}
                        className="h-9 w-9 p-1.5 ml-1 scale-[0.9] hover:scale-[1.2] transition-all duration-300 hover:text-yellow-500 cursor-pointer"
                      />
                      <Delete
                        data-drag-disabled
                        onClick={() => onDelete(item._id)}
                        className="h-9 w-9 p-1.5 ml-1 hover:scale-[1.3] transition-all duration-300 hover:text-red-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      )}
    </div>
  );
}
