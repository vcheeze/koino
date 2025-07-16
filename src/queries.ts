import { useConvexMutation } from '@convex-dev/react-query'
import { useMutation } from '@tanstack/react-query'
import { api } from '../convex/_generated/api'

export function useUpsertDailyLogMutation() {
  const mutationFn = useConvexMutation(api.dailyLog.upsertDailyLog)
  return useMutation({ mutationFn })
}
