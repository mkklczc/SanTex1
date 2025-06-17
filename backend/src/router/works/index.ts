import { z } from 'zod'
import { protectedProcedure, router } from '../../lib/trpc'

export const worksTrpcRoute = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.work.findMany({
      include: { constructionObject: true, user: true },
    })
  }),
  create: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        status: z.string(),
        userId: z.string(),
        constructionObjectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.work.create({
        data: {
          ...input,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
        },
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        status: z.string(),
        userId: z.string(),
        constructionObjectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.work.update({
        where: { id },
        data: {
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
        },
      })
    }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.work.delete({ where: { id: input.id } })
    return { success: true }
  }),
})
