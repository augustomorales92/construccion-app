import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UseFetchQueryOptions<T>
  extends Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'> {
  queryKey: any[]
}

export default function useFetchQuery<T>(
  queryKey: any[],
  queryFn: () => Promise<T>,
  options: Omit<UseFetchQueryOptions<T>, 'queryKey'> = {},
) {
  const { data, error, isLoading, ...rest } = useQuery<T, Error>({
    queryKey,
    queryFn,
    ...options,
  })

  if (error) {
    toast.error(error.message)
  }

  return { data, isLoading, ...rest }
}
