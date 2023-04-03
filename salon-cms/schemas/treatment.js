import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'treatment',
  title: 'Treatment',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().warning('Required field'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().warning('Required field'),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      hidden: false,
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().warning('Required field'),
    }),
    defineField({
      name: 'directLink',
      title: 'Direct Booking Link',
      type: 'string',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'string',
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full description',
      type: 'text',
    }),
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          {title: 'Dame', value: 'dame'},
          {title: 'Herre', value: 'herre'},
          {title: 'Unisex', value: 'unisex'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().warning('Required field'),
    }),
    defineField({
      name: 'promotedTreatment',
      title: 'Promoted Treatment',
      description: 'Toggle to promote this treatment',
      type: 'boolean',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Fotpleie', value: 'fotpleie'},
          {title: 'Håndpleie', value: 'handpleie'},
          {title: 'Hudpleie', value: 'hudpleie'},
          {title: 'Microblading', value: 'microblading'},
          {title: 'Voksing', value: 'voksing'},
          {title: 'Vippe', value: 'vippe'},
          {title: 'Bryn', value: 'bryn'},
        ], // <-- predefined values
        layout: 'radio', // <-- defaults to 'dropdown'
      },
      validation: (Rule) => Rule.required().warning('Required field'),
    }),
  ],
})
