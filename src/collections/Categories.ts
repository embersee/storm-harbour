import type { Access, CollectionConfig } from 'payload'
import { slugify } from '@/utilities/formatters'
import { access } from '@/access'

const readAccess: Access = async ({ req }) => {
  if (access.adminOrManager.collection()({ req })) return true

  return {
    isActive: {
      equals: true,
    },
  }
}

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'isActive'],
  },
  access: {
    read: readAccess,
    create: access.admin.collection(),
    delete: access.admin.collection(),
    update: access.admin.collection(),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the category name',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Auto-generate slug from name if not provided
            if (!value && data?.name) {
              return slugify(data.name)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Brief description of the category',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Category banner or icon',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Controls whether this category is visible on the site',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      admin: {
        description: 'Controls the order of categories in navigation (lower numbers appear first)',
      },
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Meta Keywords',
        },
      ],
    },
  ],
  timestamps: true,
}

export default Categories
