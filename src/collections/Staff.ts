import type { CollectionConfig } from 'payload'
import { access } from '../access'

const Staff: CollectionConfig = {
  slug: 'staff',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Staff',
  },
  access: {
    read: access.admin.collection(),
    create: access.admin.collection(),
    delete: access.admin.collection(),
    update: access.admin.collection(),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
      ],
    },
  ],
}

export default Staff
