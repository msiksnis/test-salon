import { useState } from "react";

export default function AddTreatmentModal({ onClose }) {
  const [gender, setGender] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission logic here
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen">
        <div
          className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        <div className="modal-container bg-white w-full md:w-3/4 lg:w-1/2 m-auto rounded shadow-lg z-50 overflow-y-auto">
          <div className="modal-header p-4 flex justify-center items-center">
            <h2 className="text-2xl text-slate-900 uppercase">
              Add New Treatment
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-content p-4">
              {/* Add form fields here */}
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex space-x-2 items-center mb-4">
                <input
                  type="text"
                  placeholder="Slug"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <button className="px-4 py-2 bg-slate-900 text-white border border-slate-900 rounded hover:bg-white hover:text-slate-900 transition-all duration-300">
                  Generate
                </button>
              </div>
              <input
                type="number"
                placeholder="Order"
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <input
                type="text"
                placeholder="Direct Booking Link"
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <input
                type="text"
                placeholder="Shord description"
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <textarea
                type="text"
                placeholder="Full description"
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="border p-4 rounded mb-4">
                <p className="mb-2">Gender</p>
                <div className="flex flex-col">
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
                      checked={gender === "fotpleie"}
                      onChange={handleGenderChange}
                    />
                    <span className="ml-2">Fotpleie</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="håndpleie"
                      checked={gender === "håndpleie"}
                      onChange={handleGenderChange}
                    />
                    <span className="ml-2">Håndpleie</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="hudpleie"
                      checked={gender === "hudpleie"}
                      onChange={handleGenderChange}
                    />
                    <span className="ml-2">Hudpleie</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="microblading"
                      checked={gender === "microblading"}
                      onChange={handleGenderChange}
                    />
                    <span className="ml-2">Microblading</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="voksing"
                      checked={gender === "voksing"}
                      onChange={handleGenderChange}
                    />
                    <span className="ml-2">Voksing</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="vippe"
                      checked={gender === "vippe"}
                      onChange={handleGenderChange}
                    />
                    <span className="ml-2">Vippe</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="bryn"
                      checked={gender === "bryn"}
                      onChange={handleGenderChange}
                    />
                    <span className="ml-2">Bryn</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer p-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-10 py-2 bg-slate-900 text-white border border-slate-900 rounded hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
