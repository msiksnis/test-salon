import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTreatments } from "../../../../utils/fetchTreatments";
import PulsingLoader from "../../PulsingLoader";
import { TbDragDrop2 as DragDropIcon } from "react-icons/tb";
import { GoPlus } from "react-icons/go";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/outline";
import { HiOutlineTrash } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import WarningFramerModal from "../../Modals/WarningFramerModal";

const gap = 30;
const clamp = (n, min, max) => Math.max(Math.min(n, max), min);

export default function DraggableFramerHudpleie() {
  const [mouse, setMouse] = useState([0, 0]);
  const [delta, setDelta] = useState([0, 0]);
  const [lastPress, setLastPress] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [containerHeight, setContainerHeight] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] = useState(null);

  const itemRefs = useRef(new Map());

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    async function fetchData() {
      const items = await fetchTreatments("hudpleie");
      setOrder(items);
      setLoading(false);
    }
    fetchData();
  }, []);

  const calculateContainerHeight = () => {
    let totalHeight = 0;
    const itemIds = Array.from(itemRefs.current.keys());
    for (let i = 0; i < itemIds.length; i++) {
      const id = itemIds[i];
      const item = itemRefs.current.get(id);
      if (item) {
        totalHeight += item.offsetHeight + gap;
      }
    }
    return totalHeight;
  };

  useEffect(() => {
    setContainerHeight(calculateContainerHeight());
  }, [order]);

  const getTotalHeight = () => {
    let totalHeight = 0;
    const itemIds = Array.from(itemRefs.current.keys());
    for (let i = 0; i < itemIds.length; i++) {
      const id = itemIds[i];
      const item = itemRefs.current.get(id);
      if (item) {
        totalHeight += item.offsetHeight;
      }
    }
    return totalHeight;
  };

  const handleMouseDown = useCallback(
    (key, [pressX, pressY], { pageX, pageY, target }) => {
      if (target.getAttribute("data-drag-disabled")) {
        return;
      }

      setLastPress(key);
      setIsPressed(true);
      setDelta([pageX - pressX, pageY - pressY]);
      setMouse([pressX, pressY]);
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
    setDelta([0, 0]);
  }, []);

  const handleMouseMove = useCallback(
    ({ pageX, pageY }) => {
      if (isPressed) {
        const newMouse = [pageX - delta[0], pageY - delta[1]];

        let rowTo = -1;
        const draggedItemHeight =
          itemRefs.current.get(lastPress)?.offsetHeight || 0;
        const draggedItemMiddleY = newMouse[1] + draggedItemHeight / 2;
        const itemIds = Array.from(itemRefs.current.keys());
        for (let i = 0; i < itemIds.length; i++) {
          const id = itemIds[i];
          const item = itemRefs.current.get(id);
          if (item && item !== itemRefs.current.get(lastPress)) {
            const itemY = getYPosition(i);
            const nextItemY =
              i < itemIds.length - 1
                ? getYPosition(i + 1)
                : Number.MAX_SAFE_INTEGER;
            if (draggedItemMiddleY > itemY && draggedItemMiddleY <= nextItemY) {
              rowTo = i;
              break;
            }
          }
        }

        rowTo = rowTo === -1 ? order.length - 1 : rowTo;

        const rowFrom = order.findIndex((item) => item._id === lastPress);
        const newRowOrder = reinsert(order, rowFrom, rowTo);

        setMouse(newMouse);
        setOrder(newRowOrder);
      }
    },
    [isPressed, delta, order, lastPress]
  );

  const getYPosition = (index) => {
    let totalHeight = 0;
    for (let i = 0; i < index; i++) {
      const id = order[i]._id;
      const item = itemRefs.current.get(id);
      if (item) {
        totalHeight += item.offsetHeight + gap;
      }
    }
    return totalHeight;
  };

  const reinsert = (array, from, to) => {
    if (from === to) return array;
    const newArray = array.slice(0);
    const val = newArray[from];
    newArray.splice(from, 1);
    newArray.splice(to, 0, val);
    return newArray;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleSaveChanges = async () => {
    try {
      const response = await fetch("/api/save-treatment-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ treatments: order }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Treatments order saved successfully");
      } else {
        toast.error("Error saving treatments order: " + data.message);
      }
    } catch (error) {
      toast.error("Error saving treatments order: " + error.message);
    }
  };

  const handleDeleteIconClick = (id) => {
    setTreatmentToDelete(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/delete-treatment/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Treatment deleted successfully");
        // Remove treatment from the order state
        setOrder(order.filter((item) => item._id !== id));
      } else {
        toast.error("Error deleting treatment");
      }
    } catch (error) {
      toast.error("Error deleting treatment: " + error.message);
    }

    setIsModalOpen(false);
    setTreatmentToDelete(null);
  };

  return (
    <div className="relative md:mx-14 md:mt-32 md:mb-20 shadow-box rounded-md bg-white">
      <div className="flex justify-between items-center mr-10">
        <h1 className="text-2xl p-10 text-gray-700 md:text-4xl">Hudpleie</h1>
        <button
          className="flex items-center uppercase border border-slate-900 rounded px-10 py-2 bg-slate-900 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow"
          onClick={toggleModal}
        >
          <GoPlus className="h-[18px] w-[18px] mr-2" /> Add New
        </button>
      </div>
      <h2 className="text-2xl my-10 mx-10">Hudpleie Dame</h2>
      <div
        className="flex flex-col items-center"
        style={{ minHeight: `${containerHeight}px` }}
      >
        {loading ? (
          <PulsingLoader />
        ) : (
          <AnimatePresence>
            {order
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
                    onMouseDown={handleMouseDown.bind(null, item._id, [0, y])}
                    className={`absolute bg-white group w-full shadow-4 py-2 select-none cursor-grab${
                      isActive ? " cursor-grabbing bg-yellow-400" : ""
                    }`}
                    style={{
                      zIndex: item === lastPress ? 99 : index,
                      width: "calc(100% - 80px)",
                      marginLeft: "40px",
                      marginRight: "40px",
                    }}
                  >
                    <div className="grid grid-cols-[auto,1fr,auto,auto] items-center gap-4 px-4">
                      <DragDropIcon className="h-6 w-6 opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                      <div className="grid grid-rows-[auto,auto] gap-2">
                        <div className="truncate">{item.title}</div>
                        <p className="truncate text-sm opacity-60">
                          {item.shortDescription}
                        </p>
                      </div>
                      <h3 className="whitespace-nowrap font-normal">
                        {item.price} kr
                      </h3>
                      <div className="grid grid-rows-2 gap-2 border-l border-gray-400 pl-2">
                        <CiEdit
                          data-drag-disabled
                          className="h-5 w-5 hover:scale-[1.3] transition-all duration-300 hover:text-yellow-600 cursor-pointer"
                        />
                        <HiOutlineTrash
                          data-drag-disabled
                          onClick={() => handleDeleteIconClick(item._id)}
                          className="h-5 w-5 hover:scale-[1.3] transition-all duration-300 hover:text-red-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        )}
      </div>
      <div className="flex justify-center pb-10">
        <button
          onClick={handleSaveChanges}
          className="bg-slate-900 text-white px-14 py-2 mt-4 rounded uppercase border border-slate-900 hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-pointer"
        >
          Save Changes
        </button>
      </div>
      <WarningFramerModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onDelete={() => handleDelete(treatmentToDelete)}
      />
    </div>
  );
}
