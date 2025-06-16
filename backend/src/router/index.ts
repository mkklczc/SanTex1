import { trpc } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { authTrpcRoute } from './auth'
import { helloTrpcRoute } from './hello'
import { materialsTrpcRoute } from './materials'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  auth: authTrpcRoute,
  hello: helloTrpcRoute,
  materials: materialsTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
