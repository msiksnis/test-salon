export async function handleDelete(
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
) {
  try {
    const response = await fetch(`/api/delete-treatment/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      toast.success("Treatment deleted successfully");
      // Remove treatment from the order state
      setOrder(order.filter((item) => item._id !== id));
      // Find the gender of the deleted treatment
      const deletedTreatmentGender = order.find(
        (item) => item._id === id
      ).gender;

      // Update itemsDame or itemsHerre based on the deleted treatment's gender
      if (deletedTreatmentGender === "dame") {
        setItemsDame(itemsDame.filter((item) => item._id !== id));
      } else {
        setItemsHerre(itemsHerre.filter((item) => item._id !== id));
      }
    } else {
      toast.error("Error deleting treatment");
    }
  } catch (error) {
    toast.error("Error deleting treatment: " + error.message);
  }

  setIsWarningModalOpen(false);
  setTreatmentToDelete(null);
}

export async function handleSaveChanges(itemsDame, itemsHerre, toast) {
  try {
    const response = await fetch("/api/save-treatment-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        treatmentsDame: itemsDame,
        treatmentsHerre: itemsHerre,
      }),
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
}

export async function handleEditTreatment(
  id,
  newTreatmentData,
  category,
  fetchTreatments,
  setOrder,
  setItemsDame,
  setItemsHerre,
  setIsEditModalOpen,
  toast
) {
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
    const updatedTreatments = await fetchTreatments(category);
    setOrder(updatedTreatments); // Update the order state directly
    setItemsDame(
      updatedTreatments.filter((treatment) => treatment.gender === "dame")
    );
    setItemsHerre(
      updatedTreatments.filter((treatment) => treatment.gender === "herre")
    );

    setIsEditModalOpen(false);
  } catch (error) {
    toast.error(error.message || "Failed to update treatment");
  }
}
