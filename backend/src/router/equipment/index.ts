import { z } from 'zod'
import { protectedProcedure, router } from '../../lib/trpc'

export const equipmentTrpcRoute = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.equipment.findMany()
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        manufacturer: z.string(),
        unit: z.string(),
        unitPrice: z.number(),
        tags: z.array(z.string()),
        status: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.equipment.create({ data: input })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        manufacturer: z.string(),
        unit: z.string(),
        unitPrice: z.number(),
        tags: z.array(z.string()),
        status: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.equipment.update({ where: { id }, data })
    }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.equipment.delete({ where: { id: input.id } })
    return { success: true }
  }),
})
