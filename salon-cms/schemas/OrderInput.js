// OrderInput.js
import {useEffect, useState} from 'react'
import {TextInput} from '@sanity/ui'
import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_API_DATASET,
  useCdn: false,
})

const OrderInput = React.forwardRef((props, ref) => {
  const {type, value, onChange} = props
  const [initialValueLoaded, setInitialValueLoaded] = useState(false)

  useEffect(() => {
    if (!value && !initialValueLoaded) {
      sanityClient
        .fetch(`*[_type == "treatment"] | order(order desc)[0] { "maxOrder": order }`)
        .then((res) => {
          const newOrder = res.maxOrder ? res.maxOrder + 1 : 1
          onChange({...props, value: newOrder})
          setInitialValueLoaded(true)
        })
    }
  }, [value, initialValueLoaded, onChange, props])

  return (
    <TextInput
      ref={ref}
      type="number"
      value={value}
      onChange={(event) => {
        onChange({...props, value: parseInt(event.target.value, 10)})
      }}
    />
  )
})

export default OrderInput
