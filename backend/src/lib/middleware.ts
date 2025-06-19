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
export const adminProcedure = trpc.procedure.use(hasRole(['admin']))
export const projectManagerProcedure = trpc.procedure.use(hasRole(['project_manager']))
export const warehouseProcedure = trpc.procedure.use(hasRole(['warehouse_manager']))
export const technicianProcedure = trpc.procedure.use(hasRole(['technician']))
