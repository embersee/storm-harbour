import { access } from '@/access'
import type { Access, CollectionConfig } from 'payload'

const readAccess: Access = async ({ req }) => {
  if (access.adminOrManager.collection()({ req })) return true

  return {
    isActive: {
      equals: true,
    },
  }
}

const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: readAccess,
    create: access.admin.collection(),
    delete: access.admin.collection(),
    update: access.admin.collection(),
  },
  upload: {
    staticDir: '../media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'credit',
      type: 'text',
    },
  ],
  timestamps: true,
}

export default Media
