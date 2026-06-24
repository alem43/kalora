import { useQuery } from '@tanstack/react-query'
import { api } from '#/lib/api'

export function useAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: api.auth.me,
    retry: false,
  })
}
