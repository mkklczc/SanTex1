import { z } from 'zod'
import { protectedProcedure, router } from '../../lib/trpc'

export const materialsTrpcRoute = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.material.findMany()
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
        notes: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.material.create({ data: input })
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
        notes: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.material.update({ where: { id }, data })
    }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.material.delete({ where: { id: input.id } })
    return { success: true }
  }),
})
