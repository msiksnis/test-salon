import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTreatments } from "../../../../utils/fetchTreatments";
import { TbDragDrop2 as DragDropIcon } from "react-icons/tb";
import { GoPlus } from "react-icons/go";
import { toast } from "react-toastify";
import { HiOutlineTrash as Delete } from "react-icons/hi";
import { FiEdit as Edit } from "react-icons/fi";
import WarningFramerModal from "../../Modals/WarningFramerModal";
import AddTreatmentFramerModal from "../../Modals/AddTreatmentFramerModal";
import EditTreatmentFramerModal from "../../Modals/EditTreatmentFramerModal";
import BarLoading from "../../Loaders/BarLoading";

const gap = 30;
const clamp = (n, min, max) => Math.max(Math.min(n, max), min);

export default function DraggableFramerFotpleie() {
  const [mouse, setMouse] = useState([0, 0]);
  const [delta, setDelta] = useState([0, 0]);
  const [lastPress, setLastPress] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isAddTreatmentModalOpen, setIsAddTreatmentModalOpen] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [containerHeightDame, setContainerHeightDame] = useState(0);
  const [containerHeightHerre, setContainerHeightHerre] = useState(0);

  const itemRefs = useRef(new Map());

  useEffect(() => {
    async function fetchData(onFetched) {
      const items = await fetchTreatments("fotpleie");
      setOrder(items);
      setLoading(false);
      if (onFetched) {
        onFetched(items);
      }
    }

    fetchData();
  }, []);

  const calculateContainerHeight = (gender) => {
    let totalHeight = 0;
    const itemIds = Array.from(itemRefs.current.keys());
    for (let i = 0; i < itemIds.length; i++) {
      const id = itemIds[i];
      const item = itemRefs.current.get(id);
      if (item && order[i]?.gender === gender) {
        totalHeight += item.offsetHeight + gap;
      }
    }
    return totalHeight;
  };

  useEffect(() => {
    setContainerHeightDame(calculateContainerHeight("dame"));
    setContainerHeightHerre(calculateContainerHeight("herre"));
  }, [order]);

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

  const getYPosition = (index, filteredOrder) => {
    let totalHeight = 0;
    for (let i = 0; i < index; i++) {
      try {
        const id = filteredOrder[i]._id;
        const item = itemRefs.current.get(id);
        if (item) {
          totalHeight += item.offsetHeight;
        }
      } catch (error) {
        // If an error occurs, we can just continue to the next iteration
        continue;
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
    setIsWarningModalOpen(true);
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

    setIsWarningModalOpen(false);
    setTreatmentToDelete(null);
  };

  useEffect(() => {
    console.log("Treatments state:", treatments);
  }, [treatments]);

  const openEditModal = (treatment) => {
    setIsEditModalOpen(true);
    setSelectedTreatment(treatment);
  };

  const handleEditTreatment = async (id, newTreatmentData) => {
    try {
      const response = await fetch(`/api/edit-treatment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTreatmentData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // Fetch updated treatments after successful edit
      const updatedTreatments = await fetchTreatments("fotpleie");
      setTreatments(updatedTreatments);
      setOrder(updatedTreatments);

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error editing treatment:", error);
    }
  };

  const dameTreatments = order.filter((item) => item.gender === "dame");
  const herreTreatments = order.filter((item) => item.gender === "herre");

  const renderTreatments = (treatments, gender) => {
    return (
      <>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <BarLoading />
          </div>
        ) : (
          <AnimatePresence>
            {order.map((item, index) => {
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
                  className={`absolute bg-white rounded group w-full shadow-4 transition-colors duration-300 py-1 select-none cursor-grab${
                    isActive ? "cursor-grabbing bg-[#f3f3f2]" : ""
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
                    <div className="grid grid-rows-[auto,auto]">
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
                        onClick={() => openEditModal(item)}
                        className="h-9 w-9 p-1.5 scale-[0.9] hover:scale-[1.2] transition-all duration-300 hover:text-yellow-600 cursor-pointer"
                      />
                      <Delete
                        data-drag-disabled
                        onClick={() => handleDeleteIconClick(item._id)}
                        className="h-9 w-9 p-1.5 hover:scale-[1.3] transition-all duration-300 hover:text-red-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </>
    );
  };

  return (
    <div className="relative md:mx-14 md:mb-20 shadow-box rounded-md bg-white">
      <div className="flex justify-between items-center mr-10">
        <h1 className="text-2xl p-10 text-gray-700 md:text-4xl">Fotpleie</h1>
        <button
          className="flex items-center uppercase border border-slate-900 rounded px-10 py-2 bg-slate-900 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow focus:outline-none"
          onClick={() => setIsAddTreatmentModalOpen(true)}
        >
          <GoPlus className="h-[18px] w-[18px] mr-2" /> Add New
        </button>
      </div>
      {dameTreatments.length > 0 ? (
        <>
          <h2 className="text-2xl m-10">Fotpleie Dame</h2>
          <div
            className="flex flex-col items-center"
            style={{ minHeight: `${containerHeightDame}px` }}
          >
            {renderTreatments(dameTreatments)}
          </div>
        </>
      ) : null}
      {herreTreatments.length > 0 ? (
        <>
          <h2 className="text-2xl m-10">Fotpleie Herre</h2>
          <div
            className="flex flex-col items-center"
            style={{ minHeight: `${containerHeightHerre}px` }}
          >
            {renderTreatments(dameTreatments)}
          </div>
        </>
      ) : null}

      <div className="flex justify-center items-stretch pb-10">
        <button
          onClick={handleSaveChanges}
          className="bg-slate-900 text-white px-14 py-2 mt-4 rounded uppercase border border-slate-900 hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-pointer focus:outline-none"
        >
          Save Changes
        </button>
      </div>
      <WarningFramerModal
        isOpen={isWarningModalOpen}
        setIsOpen={setIsWarningModalOpen}
        onDelete={() => handleDelete(treatmentToDelete)}
      />
      <AddTreatmentFramerModal
        isOpen={isAddTreatmentModalOpen}
        setIsOpen={setIsAddTreatmentModalOpen}
        onSubmit={async () => {
          const updatedTreatments = await fetchTreatments("fotpleie");
          setTreatments(updatedTreatments);
          setOrder(updatedTreatments);
          setIsAddTreatmentModalOpen(false);
        }}
      />
      <EditTreatmentFramerModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        onSubmit={handleEditTreatment}
        treatment={selectedTreatment}
      />
    </div>
  );
}
