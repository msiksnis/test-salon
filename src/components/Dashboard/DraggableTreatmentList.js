import { useState, useEffect, useCallback, useRef } from "react";
import { fetchTreatments } from "../../../utils/fetchTreatments";
import { GoPlus } from "react-icons/go";
import { toast } from "react-toastify";
import WarningFramerModal from "../Modals/WarningFramerModal";
import AddTreatmentFramerModal from "../Modals/AddTreatmentFramerModal";
import EditTreatmentFramerModal from "../Modals/EditTreatmentFramerModal";
import TreatmentList from "./TreatmentList";
import {
  handleDelete,
  handleSaveChanges,
  handleEditTreatment,
} from "./treatmentHandlers";
import { convertCategoryText } from "./textConversion";

const gap = 10;

export default function DraggableTreatmentList({ category }) {
  const [mouse, setMouse] = useState([]);
  const [delta, setDelta] = useState([]);
  const [lastPress, setLastPress] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isAddTreatmentModalOpen, setIsAddTreatmentModalOpen] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [itemsDame, setItemsDame] = useState([]);
  const [itemsHerre, setItemsHerre] = useState([]);
  const [containerHeightDame, setContainerHeightDame] = useState();
  const [containerHeightHerre, setContainerHeightHerre] = useState();

  useEffect(() => {
    async function fetchData() {
      const items = await fetchTreatments(category, null, true);
      setOrder(items);
      setLoading(false);
      const itemsDame = items.filter(
        (treatment) => treatment.gender === "dame"
      );
      const itemsHerre = items.filter(
        (treatment) => treatment.gender === "herre"
      );
      setItemsDame(itemsDame);
      setItemsHerre(itemsHerre);
    }

    fetchData();
  }, []);

  const itemRefs = useRef(new Map());

  const treatmentListRefDame = useRef(null);
  const treatmentListRefHerre = useRef(null);

  const calculateContainerHeight = () => {
    const itemHeight = 90;
    const itemMargin = 10;

    // Calculate the total height of items for each gender, including the margin
    const totalHeightDame = itemsDame.length * (itemHeight + itemMargin);
    const totalHeightHerre = itemsHerre.length * (itemHeight + itemMargin);

    // Set the container heights
    setContainerHeightDame(totalHeightDame);
    setContainerHeightHerre(totalHeightHerre);
  };

  useEffect(() => {
    calculateContainerHeight();
  }, [itemsDame, itemsHerre]);

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

        const draggedItemGender = order.find(
          (item) => item._id === lastPress
        ).gender;
        const genderItems =
          draggedItemGender === "dame" ? itemsDame : itemsHerre;

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

        // Condition to move the last item to the first position
        if (draggedItemMiddleY < getYPosition(0)) {
          rowTo = 0;
        } else {
          rowTo = rowTo === -1 ? genderItems.length - 1 : rowTo;
        }

        const rowFrom = genderItems.findIndex((item) => item._id === lastPress);
        const newRowOrder = reinsert(genderItems, rowFrom, rowTo);

        setMouse(newMouse);
        if (draggedItemGender === "dame") {
          setItemsDame(newRowOrder);
        } else {
          setItemsHerre(newRowOrder);
        }
      }
    },
    [isPressed, delta, order, lastPress, itemsDame, itemsHerre]
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

  const onSaveChanges = async () => {
    await handleSaveChanges(itemsDame, itemsHerre, toast);
  };

  const handleDeleteIconClick = (id) => {
    setTreatmentToDelete(id);
    setIsWarningModalOpen(true);
  };

  const onDelete = async (id) => {
    await handleDelete(
      id,
      order,
      itemsDame,
      itemsHerre,
      setOrder,
      setItemsDame,
      setItemsHerre,
      setIsWarningModalOpen,
      setTreatmentToDelete,
      toast
    );
  };

  const openEditModal = (treatment) => {
    setIsEditModalOpen(true);
    setSelectedTreatment(treatment);
  };

  const onEditTreatment = async (id, newTreatmentData) => {
    await handleEditTreatment(
      id,
      newTreatmentData,
      category,
      fetchTreatments,
      setOrder,
      setItemsDame,
      setItemsHerre,
      setIsEditModalOpen,
      toast
    );
  };

  return (
    <div className="relative md:mr-6 md:ml-14 md:mb-10 shadow-box rounded-md bg-white flex flex-col">
      <div className="flex justify-between items-center mr-10">
        <h1 className="text-2xl p-10 text-gray-700 md:text-4xl capitalize">
          {convertCategoryText(category)}
        </h1>
        <button
          className="flex items-center uppercase border border-slate-900 rounded px-10 py-2 bg-slate-900 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow focus:outline-none"
          onClick={() => setIsAddTreatmentModalOpen(true)}
        >
          <GoPlus className="h-[18px] w-[18px] mr-2" /> Add New
        </button>
      </div>

      <h2 className="text-2xl m-10 capitalize">
        {convertCategoryText(category)} Dame
      </h2>
      <div className="mb-10" style={{ height: `${containerHeightDame}px` }}>
        <TreatmentList
          ref={treatmentListRefDame}
          treatments={itemsDame}
          onEdit={openEditModal}
          onDelete={handleDeleteIconClick}
          onMouseDown={handleMouseDown}
          containerHeight={containerHeightDame}
          loading={loading}
          lastPress={lastPress}
          isPressed={isPressed}
          mouse={mouse}
          itemRefs={itemRefs}
          getYPosition={getYPosition}
        />
      </div>

      <h2 className="text-2xl mb-10 ml-10 capitalize">
        {convertCategoryText(category)} Herre
      </h2>
      <div
        className="herre-treatment-container"
        style={{ height: `${containerHeightHerre}px` }}
      >
        <TreatmentList
          ref={treatmentListRefHerre}
          treatments={itemsHerre}
          onEdit={openEditModal}
          onDelete={handleDeleteIconClick}
          containerHeight={containerHeightHerre}
          onMouseDown={handleMouseDown}
          loading={loading}
          lastPress={lastPress}
          isPressed={isPressed}
          mouse={mouse}
          itemRefs={itemRefs}
          getYPosition={getYPosition}
        />
      </div>

      <div className="flex justify-center items-stretch pb-10">
        <button
          onClick={onSaveChanges}
          className="bg-slate-900 text-white px-14 py-2 mt-4 rounded uppercase border border-slate-900 hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-pointer focus:outline-none"
        >
          Save Order Changes
        </button>
      </div>

      <WarningFramerModal
        isOpen={isWarningModalOpen}
        setIsOpen={setIsWarningModalOpen}
        onDelete={() => onDelete(treatmentToDelete)}
      />
      <AddTreatmentFramerModal
        isOpen={isAddTreatmentModalOpen}
        setIsOpen={setIsAddTreatmentModalOpen}
        onSubmit={async () => {
          const updatedTreatments = await fetchTreatments(category);
          setOrder(updatedTreatments);
          const updatedItemsDame = updatedTreatments.filter(
            (treatment) => treatment.gender === "dame"
          );
          const updatedItemsHerre = updatedTreatments.filter(
            (treatment) => treatment.gender === "herre"
          );
          setItemsDame(updatedItemsDame);
          setItemsHerre(updatedItemsHerre);
          setIsAddTreatmentModalOpen(false);
        }}
      />
      <EditTreatmentFramerModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        onSubmit={onEditTreatment}
        treatment={selectedTreatment}
      />
    </div>
  );
}
