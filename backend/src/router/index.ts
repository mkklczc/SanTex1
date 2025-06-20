import { trpc } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { authTrpcRoute } from './auth'
import { dashboardTrpcRoute } from './dashboard'
import { equipmentTrpcRoute } from './equipment'
import { helloTrpcRoute } from './hello'
import { materialsTrpcRoute } from './materials'
import { objectsTrpcRoute } from './objects'
import { worksTrpcRoute } from './works'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  auth: authTrpcRoute,
  hello: helloTrpcRoute,
  equipment: equipmentTrpcRoute,
  works: worksTrpcRoute,
  objects: objectsTrpcRoute,
  dashboard: dashboardTrpcRoute,
  materials: materialsTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
