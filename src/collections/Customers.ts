import type { CollectionConfig, Access } from 'payload'
import { access } from '../access'

const updateAccess: Access = async ({ req }) => {
  if (access.adminOrManager.collection()({ req })) return true

  return {
    id: {
      equals: req.user?.id,
    },
  }
}

const Customers: CollectionConfig = {
  slug: 'customers',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Shop',
  },
  access: {
    read: access.adminOrManager.collection(),
    create: () => true, // Allow public registration
    delete: access.admin.collection(),
    update: updateAccess,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'addresses',
      type: 'array',
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
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'orders',
      type: 'relationship',
      relationTo: 'orders',
      hasMany: true,
    },
  ],
}

export default Customers
