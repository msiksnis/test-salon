// /salon-cms/getMaxOrder.js
export async function getMaxOrder() {
  const query = `*[_type == "treatment"] | order(order desc)[0] { "maxOrder": order }`
  const res = await fetch('/api/treatments/getMaxOrder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query}),
  })

  const data = await res.json()
  return data.maxOrder
}
