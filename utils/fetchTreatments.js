// fetchTreatments.js
export async function fetchTreatments(category) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-treatments?category=${category}`
  );

  const data = await res.json();
  const treatments = data.treatments;

  return treatments;
}
