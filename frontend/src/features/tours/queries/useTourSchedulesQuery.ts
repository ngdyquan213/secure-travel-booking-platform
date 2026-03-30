import { useQuery } from '@tanstack/react-query'
import {
  createTourDetailQueryOptions,
  type TourDetail,
  type TourPriceRule,
  type TourSchedule,
} from '@/features/tours/queries/useTourDetailQuery'

export interface TourSchedulesSummary {
  schedules: TourSchedule[]
  departureCount: number
  nextDeparture: TourSchedule | null
  lowestPriceRule: TourPriceRule | null
}

function buildLowestPriceRule(schedules: TourSchedule[]) {
  return schedules.flatMap((schedule) => schedule.price_rules ?? []).reduce<TourPriceRule | null>(
    (lowest, rule) => {
      if (!lowest || rule.price < lowest.price) {
        return rule
      }

      return lowest
    },
    null
  )
}

function buildSchedulesSummary(tour: TourDetail): TourSchedulesSummary {
  return {
    schedules: tour.schedules,
    departureCount: tour.schedules.length,
    nextDeparture: tour.schedules[0] ?? null,
    lowestPriceRule: buildLowestPriceRule(tour.schedules),
  }
}

export function useTourSchedulesQuery(id?: string) {
  return useQuery<TourDetail, Error, TourSchedulesSummary>({
    ...createTourDetailQueryOptions(id),
    select: buildSchedulesSummary,
  })
}
