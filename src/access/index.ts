import type { Access, FieldAccess } from 'payload'

export const access = {
  public: {
    collection: (): Access => () => {
      return {
        _status: {
          equals: 'published',
        },
      }
      // return true
    },
  },
  admin: {
    collection:
      (): Access =>
      ({ req: { user } }) => {
        if (user?.collection === 'staff') {
          return user?.role === 'admin'
        }

        return false
      },
    field:
      (): FieldAccess =>
      ({ req: { user } }) => {
        if (user?.collection === 'staff') {
          return user?.role === 'admin'
        }

        return false
      },
  },
  manager: {
    collection:
      (): Access =>
      ({ req: { user } }) => {
        if (user?.collection === 'staff') {
          return user?.role === 'manager'
        }

        return false
      },
    field:
      (): FieldAccess =>
      ({ req: { user } }) => {
        if (user?.collection === 'staff') {
          return user?.role === 'manager'
        }

        return false
      },
  },
  adminOrManager: {
    collection:
      (): Access =>
      ({ req: { user } }) => {
        if (user?.collection === 'staff') {
          return ['admin', 'manager'].includes(user?.role ?? '')
        }

        return false
      },
    field:
      (): FieldAccess =>
      ({ req: { user } }) => {
        if (user?.collection === 'staff') {
          return ['admin', 'manager'].includes(user?.role ?? '')
        }

        return false
      },
  },
}
