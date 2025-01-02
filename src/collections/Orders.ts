import payload from 'payload'
import type { Access, CollectionConfig } from 'payload'
import { access } from '@/access'

const readAccess: Access = async ({ req }) => {
  if (access.adminOrManager.collection()({ req })) {
    return true
  }

  if (req.user?.collection === 'customers') {
    // Check if the order belongs to the customer
    return {
      customer: {
        equals: req.user.id,
      },
    }
  }

  return false
}

const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer.email', 'status', 'totalAmount', 'createdAt'],
    group: 'Shop',
  },
  access: {
    read: readAccess,
    create: () => true, // Allow customers to create orders
    update: access.adminOrManager.collection(),
    delete: access.admin.collection(),
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique order identifier',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              const date = new Date()
              const random = Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, '0')
              return `ORD-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${random}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'products',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'priceAtTime',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: { en: 'Pending', ru: 'В ожидании' },
          value: 'pending',
        },
        {
          label: { en: 'Paid', ru: 'Оплачено' },
          value: 'paid',
        },
        {
          label: { en: 'Processing', ru: 'В обработке' },
          value: 'processing',
        },
        {
          label: { en: 'Shipped', ru: 'Отправлен' },
          value: 'shipped',
        },
        {
          label: { en: 'Delivered', ru: 'Доставлен' },
          value: 'delivered',
        },
        {
          label: { en: 'Cancelled', ru: 'Отменен' },
          value: 'cancelled',
        },
      ],
    },
    {
      name: 'statusHistory',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'status',
          type: 'text',
          required: true,
        },
        {
          name: 'date',
          type: 'date',
          required: true,
        },
        {
          name: 'note',
          type: 'text',
        },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      min: 0,
    },
  ],
  hooks: {
    beforeChange: [
      // Status History Hook
      ({ operation, originalDoc, data }) => {
        if (operation === 'update' && originalDoc.status !== data.status) {
          const statusHistory = data.statusHistory || []
          statusHistory.push({
            status: data.status,
            date: new Date(),
            note: `Status changed from ${originalDoc.status} to ${data.status}`,
          })
          data.statusHistory = statusHistory
        }
        return data
      },

      // Quantity Management Hook
      async ({ operation, data }) => {
        if (operation === 'create') {
          for (const item of data.items) {
            const product = await payload.findByID({
              collection: 'products',
              id: item.product,
            })

            if (!product) throw new Error(`Product ${item.product} not found`)
            if (product.quantity < item.quantity) {
              throw new Error(`Insufficient quantity for product ${product.title}`)
            }

            await payload.update({
              collection: 'products',
              id: item.product,
              data: {
                quantity: product.quantity - item.quantity,
              },
            })
          }
        }
        return data
      },
    ],
  },
  timestamps: true,
}

export default Orders
