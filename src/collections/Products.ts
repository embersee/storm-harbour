import type { CollectionConfig } from 'payload'
import { access } from '@/access'

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price_usd', 'availability', 'status', 'updatedAt'],
  },

  access: {
    read: access.public.collection(),
    create: access.admin.collection(),
    delete: access.admin.collection(),
    update: access.admin.collection(),
  },

  versions: {
    drafts: true,
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
      localized: true,
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'altText',
          type: 'text',
          required: true,
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          label: 'Set as primary image?',
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
      required: true,
      localized: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          localized: true,
        },
      ],
      admin: {
        initCollapsed: false,
      },
    },
    {
      name: 'price_usd',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'price_eur',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'availability',
      type: 'select',
      required: true,
      options: [
        {
          label: {
            en: 'In Stock',
            ru: 'В наличии',
          },
          value: 'in_stock',
        },
        {
          label: {
            en: 'Out of Stock',
            ru: 'Нет в наличии',
          },
          value: 'out_of_stock',
        },
        {
          label: {
            en: 'Pre-order',
            ru: 'Предзаказ',
          },
          value: 'pre_order',
        },
        {
          label: {
            en: 'Discontinued',
            ru: 'Снят с производства',
          },
          value: 'discontinued',
        },
      ],
      defaultValue: 'in_stock',
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: {
          en: 'Unique product identifier',
          ru: 'Уникальный идентификатор товара',
        },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'specifications',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: {
        en: 'Featured product?',
        ru: 'Рекомендуемый товар?',
      },
      defaultValue: false,
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      access: {
        read: access.adminOrManager.field(),
        update: access.adminOrManager.field(),
      },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ operation, data }) => {
        if (operation === 'create' && data.quantity > 0) {
          data.availability = 'in_stock'
        }
        if (data.quantity === 0) {
          data.availability = 'out_of_stock'
        }
        return data
      },
    ],
  },

  timestamps: true,
}

export default Products
