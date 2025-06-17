import { z } from 'zod'
import { protectedProcedure, router } from '../../lib/trpc'

export const objectsTrpcRoute = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.constructionObject.findMany()
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        location: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.constructionObject.create({ data: input })
    }),
})
