export async function fetchHudpleie() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-hudpleie`
  );

  const data = await res.json();
  const hudpleie = data.hudpleie;

  return hudpleie;
}
