import SupportLayout from '../../components/Layout/Layout'
import { trpc } from '../../lib/trpc'

export const HelloPage = () => {
  const { data, isLoading, isError, error } = trpc.hello.useQuery()

  if (isLoading) {
    return (
      <SupportLayout>
        <p>Loading...</p>
      </SupportLayout>
    )
  }

  if (isError) {
    return (
      <SupportLayout>
        <p>Error: {error.message}</p>
      </SupportLayout>
    )
  }

  return (
    <SupportLayout>
      <h1>{data?.message}</h1>
    </SupportLayout>
  )
}
