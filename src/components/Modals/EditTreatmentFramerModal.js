import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditTreatmentFramerModal({
  isOpen,
  setIsOpen,
  onSubmit,
  treatment,
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState("");
  const [price, setPrice] = useState("");
  const [directLink, setDirectLink] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (treatment && isOpen) {
      setTitle(treatment.title || "");
      setSlug(treatment.slug.current || "");
      setOrder(treatment.order || "");
      setPrice(treatment.price || "");
      setDirectLink(treatment.directLink || "");
      setShortDescription(treatment.shortDescription || "");
      setFullDescription(treatment.fullDescription || "");
      setGender(treatment.gender || "");
      setCategory(treatment.category || "");
    }
  }, [treatment, isOpen]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    const newSlug = e.target.value
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
    setSlug(newSlug);
  };

  const handleOrderChange = (e) => {
    const value = e.target.value;
    setOrder(value === "" ? "" : parseInt(value, 10));
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleDirectLinkChange = (e) => {
    setDirectLink(e.target.value);
  };

  const handleShortDescriptionChange = (e) => {
    setShortDescription(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setOrder("");
    setPrice("");
    setDirectLink("");
    setShortDescription("");
    setFullDescription("");
    setGender("");
    setCategory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const treatmentData = {
      title,
      slug: { current: slug },
      order: parseInt(order, 10),
      price: parseFloat(price),
      directLink,
      shortDescription,
      fullDescription,
      gender,
      category,
    };

    try {
      // Pass the treatment data to the parent component
      console.log("Treatment Data:", treatmentData);
      onSubmit(treatment._id, treatmentData);

      // Treatment edited successfully
      // Show a success toast and close the modal
      toast.success("Treatment edited successfully");
      resetForm();
    } catch (error) {
      console.error("Error editing treatment:", error);
      // Show an error toast
      toast.error("Error editing treatment: " + error.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={setIsOpen}
          as="div"
          className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
        >
          <Dialog.Overlay />
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div
              className="absolute inset-0 bg-gray-500 opacity-75"
              onClick={() => setIsOpen(false)}
            ></div>
          </div>

          <motion.div
            className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            initial={{
              opacity: 0,
              scale: 0.75,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                ease: "easeOut",
                duration: 0.15,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.75,
              transition: {
                ease: "easeIn",
                duration: 0.15,
              },
            }}
          >
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom rounded bg-white text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <Dialog.Title
                as="h3"
                className="text-lg leading-6 font-medium text-gray-900 pt-4 text-center uppercase"
                id="modal-headline"
              >
                Edit treatment
              </Dialog.Title>

              <form onSubmit={handleSubmit}>
                <div className="p-4">
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={title}
                    onChange={handleTitleChange}
                  />
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Order"
                      className="w-full p-2 border border-gray-300 rounded mb-4"
                      value={order}
                      onChange={handleOrderChange}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      className="w-full p-2 border border-gray-300 rounded mb-4"
                      value={price}
                      onChange={handlePriceChange}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Direct Booking Link"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={directLink}
                    onChange={handleDirectLinkChange}
                  />
                  <input
                    type="text"
                    placeholder="Short description"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={shortDescription}
                    onChange={handleShortDescriptionChange}
                  />
                  <div className="border p-4 rounded mb-4">
                    <div className="flex flex-row justify-between">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="dame"
                          checked={gender === "dame"}
                          onChange={handleGenderChange}
                        />
                        <span className="ml-2">Dame</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="herre"
                          checked={gender === "herre"}
                          onChange={handleGenderChange}
                        />
                        <span className="ml-2">Herre</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="unisex"
                          checked={gender === "unisex"}
                          onChange={handleGenderChange}
                        />
                        <span className="ml-2">Unisex</span>
                      </label>
                    </div>
                  </div>
                  <div className="border p-4 rounded">
                    <p className="mb-2">Category</p>
                    <div className="flex flex-col">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="fotpleie"
                          checked={category === "fotpleie"}
                          onChange={handleCategoryChange}
                        />
                        <span className="ml-2">Fotpleie</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="handpleie"
                          checked={category === "handpleie"}
                          onChange={handleCategoryChange}
                        />
                        <span className="ml-2">Håndpleie</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="hudpleie"
                          checked={category === "hudpleie"}
                          onChange={handleCategoryChange}
                        />
                        <span className="ml-2">Hudpleie</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="vippe"
                          checked={category === "vippe"}
                          onChange={handleCategoryChange}
                        />
                        <span className="ml-2">Vippe</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="bryn"
                          checked={category === "bryn"}
                          onChange={handleCategoryChange}
                        />
                        <span className="ml-2">Bryn</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 space-x-2 flex">
                  <button
                    tabIndex={0}
                    className="w-full inline-flex justify-center rounded border border-gray-300 shadow-sm px-4 py-2 bg-white text-slate-900 hover:bg-gray-50 focus:outline-none transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 w-full bg-slate-900 text-white border border-slate-900 rounded hover:bg-white hover:text-slate-900 transition-all duration-300 focus:outline-none"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
