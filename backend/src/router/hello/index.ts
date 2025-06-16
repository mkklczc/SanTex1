import { trpc } from '../../lib/trpc'

export const helloTrpcRoute = trpc.procedure.query(() => {
  return { message: 'Hello from backend!' }
})
