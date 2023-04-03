import {createClient} from '@sanity/client'
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {Card, Text} from '@sanity/ui'
import {DashboardIcon} from '@sanity/icons'
import {schemaTypes} from './schemas'

const myCustomTool = () => {
  return {
    title: 'My Custom Tool',
    name: 'studio', // localhost:3333/my-custom-tool
    icon: DashboardIcon,
    component: (props) => (
      <Card padding={4}>
        <Text>My custom tool</Text>
      </Card>
    ),
  }
}

export default {
  name: 'default',
  title: 'Studio with custom tool',
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_API_DATASET,
  apiVersion: '2021-03-25',
  useCdn: false,
  plugins: [deskTool()],
  tools: [myCustomTool()],
  schema: {
    types: schemaTypes,
  },
  client: createClient({
    projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_API_DATASET,
    apiVersion: '2021-03-25',
    useCdn: false,
  }),
}
