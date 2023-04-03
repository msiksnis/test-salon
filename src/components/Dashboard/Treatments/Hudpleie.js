// components/Dashboard/Treatments/Hudpleie.js
import { useState } from "react";
import { TbDragDrop2 as DragDropIcon } from "react-icons/tb";
import { GoPlus } from "react-icons/go";
import DraggableTreatment from "./DraggableTreatment";
import DroppableContainer from "./DroppableContainer";
import AddTreatmentModal from "../../AddTreatmentModal";

export default function Hudpleie({ hudpleie }) {
  const [treatments, setTreatments] = useState(hudpleie);
  const [draggedTreatmentIndex, setDraggedTreatmentIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleDrop = (droppedTreatmentId, droppedIndex) => {
    const draggedTreatmentIndex = treatments.findIndex(
      (treatment) => treatment._id === droppedTreatmentId
    );

    if (draggedTreatmentIndex !== droppedIndex) {
      const updatedTreatments = [...treatments];
      const [draggedTreatment] = updatedTreatments.splice(
        draggedTreatmentIndex,
        1
      );

      const insertIndex = Math.min(droppedIndex, updatedTreatments.length);
      updatedTreatments.splice(insertIndex, 0, draggedTreatment);
      setTreatments(updatedTreatments);
    }
  };

  const handleSaveChanges = async () => {
    const treatmentsWithUpdatedOrder = treatments.map((treatment, index) => ({
      ...treatment,
      order: index,
    }));

    const response = await fetch("/api/save-treatment-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ treatments: treatmentsWithUpdatedOrder }),
    });

    if (response.ok) {
      alert("Changes saved successfully");
    } else {
      alert("Error saving changes");
    }
  };

  return (
    <>
      {showModal ? <AddTreatmentModal onClose={toggleModal} /> : null}
      <div className="mx-10 mt-32 shadow-box rounded-md">
        <div className="flex justify-between items-center mr-10">
          <h1 className="text-2xl p-10 text-gray-700 md:text-4xl">Hudpleie</h1>
          <button
            className="flex items-center uppercase border border-slate-900 rounded px-10 py-2 bg-slate-900 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow"
            onClick={toggleModal}
          >
            <GoPlus className="h-[18px] w-[18px] mr-2" /> Add New
          </button>
        </div>
        <div className="flex flex-col">
          <h2 className="p-8 text-xl md:px-10 md:text-2xl">Hudpleie Dame</h2>
          <div className="w-full">
            {treatments.map((treatment, index) => {
              const { title, price, _id, shortDescription, directLink } =
                treatment;
              return (
                <DroppableContainer
                  key={treatment._id}
                  index={index}
                  onDrop={handleDrop}
                >
                  <DraggableTreatment
                    id={treatment._id}
                    treatment={treatment}
                    index={index}
                    setDraggedTreatmentIndex={setDraggedTreatmentIndex}
                    className="mb-5"
                  >
                    <div className="group transition-all duration-200 hover:bg-slate-50">
                      <div className="shadow-4 pt-5 pb-2 px-10 pl-2">
                        <div className="flex justify-between">
                          <div className="flex items-center transition-opacity duration-200">
                            <DragDropIcon className="mr-2 h-5 w-5 opacity-0 group-hover:opacity-80 transition-opacity duration-200" />
                            {`${index + 1}. ${title}`}
                          </div>
                          <h3 className="whitespace-nowrap pl-6 font-normal opacity-75">
                            {price} kr
                          </h3>
                        </div>
                        <p className="py-1 text-sm opacity-60">
                          {shortDescription}
                        </p>
                      </div>
                    </div>
                  </DraggableTreatment>
                </DroppableContainer>
              );
            })}
          </div>
        </div>
      </div>
      <div className="px-10 flex justify-center pt-10">
        <button
          onClick={handleSaveChanges}
          className="bg-slate-900 text-white px-14 py-2 mt-4 rounded uppercase border border-slate-900 hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </>
  );
}
