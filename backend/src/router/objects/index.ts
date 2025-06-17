import { z } from 'zod'
import { protectedProcedure, router } from '../../lib/trpc'

export const objectsTrpcRoute = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.constructionObject.findMany({ where: { isArchived: false } })
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        location: z.string(),
        foreman: z.string(),
        status: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.constructionObject.create({
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
        name: z.string(),
        location: z.string(),
        foreman: z.string(),
        status: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.constructionObject.update({
        where: { id },
        data: {
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
        },
      })
    }),
  archive: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return ctx.prisma.constructionObject.update({
      where: { id: input.id },
      data: { isArchived: true },
    })
  }),
})
