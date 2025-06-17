import { protectedProcedure, router } from '../../lib/trpc'

export const dashboardTrpcRoute = router({
  summary: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date()
    const [objectsCount, materialsCount, worksTodayCount] = await Promise.all([
      ctx.prisma.constructionObject.count({ where: { isArchived: false } }),
      ctx.prisma.material.count(),
      ctx.prisma.work.count({
        where: {
          startDate: { lte: today },
          endDate: { gte: today },
        },
      }),
    ])

    const upcomingWorks = await ctx.prisma.work.findMany({
      where: {
        endDate: { lte: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) },
      },
      include: { constructionObject: true },
    })

    return {
      objectsCount,
      materialsCount,
      worksTodayCount,
      upcomingWorks,
    }
  }),
})
