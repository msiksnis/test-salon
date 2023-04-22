// fetchTreatments.js
export async function fetchTreatments(category, gender, includeOrder = false) {
  const url =
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-treatments?category=${category}` +
    (gender ? `&gender=${gender}` : "");
  console.log("API URL:", url);

  const res = await fetch(url);
  console.log("Response Status:", res.status);

  if (res.ok) {
    const data = await res.json();
    const treatments = data.treatments;

    // Add the order field based on the index in the array if includeOrder is true
    if (includeOrder) {
      treatments.forEach((item, index) => {
        item.order = index;
      });
    }

    console.log("Fetched Data:", treatments);
    return treatments;
  } else {
    console.error("Error fetching treatments:", await res.text());
    return [];
  }
}
