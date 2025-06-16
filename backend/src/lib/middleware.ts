import { TRPCError } from '@trpc/server'
import { trpc } from './trpc'

export const hasRole = (roles: ('admin' | 'project_manager' | 'warehouse_manager' | 'technician' | 'user')[]) =>
  trpc.middleware(({ ctx, next }) => {
    if (!ctx.user || !roles.includes(ctx.user.role)) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }
    return next({ ctx })
  })

export const userProcedure = trpc.procedure.use(hasRole(['user']))
export const operatorProcedure = trpc.procedure.use(hasRole(['admin' | 'project_manager']))
export const chiefProcedure = trpc.procedure.use(hasRole(['chief']))
