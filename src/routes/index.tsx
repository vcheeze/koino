import { convexQuery } from '@convex-dev/react-query'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { OnSelectHandler } from 'react-day-picker'
import { CountByPageNumber } from '~/components/charts/count-by-page-number'

import { NumberTicker } from '~/components/magicui/number-ticker'
import { TextMorph } from '~/components/motion-primitives/text-morph'
import { Button, buttonVariants } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils'
import { useUpsertDailyLogMutation } from '~/queries'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [date, setDate] = useState(new Date())
  const dailyLogsQuery = useQuery(
    convexQuery(api.dailyLog.getDailyLogsByDate, {
      date: date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
    }),
  )
  const upsertDailyLogMutation = useUpsertDailyLogMutation()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [datepickerOpen, setDatepickerOpen] = useState(false)
  // form values
  const [pageNumber, setPageNumber] = useState(date.getDate())
  const [timeOfDay, setTimeOfDay] = useState('')

  const countByPageNumber = useMemo(() => {
    const pageCounts = dailyLogsQuery.data?.reduce(
      (counts, log) => {
        const pageNum = log.pageNumber
        counts[pageNum] = (counts[pageNum] || 0) + 1
        return counts
      },
      {} as Record<number, number>,
    )

    // Create array with all pages 1-31, filling in 0 for missing pages
    const chartData = Object.entries(pageCounts ?? {})
      .map(([page, count]) => ({
        page: Number.parseInt(page, 10),
        count,
      }))
      .sort((a, b) => a.page - b.page)

    return chartData
  }, [dailyLogsQuery.data])

  const addDay = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() + 1)
      return newDate
    })
  }

  // Subtract a day
  const subtractDay = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() - 1)
      return newDate
    })
  }

  const onSelect: OnSelectHandler<Date | undefined> = (value) => {
    if (value) {
      setDate(value)
    }
    setCalendarOpen(false)
  }

  return (
    <div className="container mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-12 lg:text-xl">
      <div className="mb-12 flex flex-col">
        <h1 className="mb-6 scroll-m-20 text-balance font-extrabold text-4xl tracking-tight lg:text-6xl">
          koinó
        </h1>
        <p className="leading-7">
          <strong>koinónia</strong> (κοινωνία): fellowship, communion,
          participation, sharing
        </p>
        <blockquote className="mt-6 border-l-2 pl-6 text-muted-foreground">
          &quot;And they devoted themselves to the apostles' teaching and the
          fellowship (<strong>koinónia</strong>), to the breaking of bread and
          the prayers.&quot; (Acts 2:42 ESV)
        </blockquote>
        <p className="mt-6 leading-7">
          <span className="font-semibold">koinó</span> helps us live this out,
          one prayer at a time, by encouraging fellow members to pray and by
          reminding them that they are being prayed for.
        </p>
      </div>
      <div className="mb-6 flex justify-end gap-4 font-mono tracking-tighter max-sm:flex-col">
        <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
          <SheetTrigger asChild>
            <Button className="lg:text-base" variant="secondary">
              <Plus className="h-4 w-4" />
              Record Your Prayer
            </Button>
          </SheetTrigger>
          <SheetContent className="w-11/12 font-mono tracking-tight md:max-w-md">
            <SheetHeader>
              <SheetTitle>Record Your Prayer</SheetTitle>
              <SheetDescription>
                Mention what page in the membership directory you prayed for,
                and if you want, what time of the day you prayed.
              </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="grid gap-3">
                <Label>Date</Label>
                <Popover onOpenChange={setDatepickerOpen} open={datepickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                      data-empty={!date}
                      variant="outline"
                    >
                      <CalendarIcon />
                      {date ? (
                        new Intl.DateTimeFormat('en-US', {
                          dateStyle: 'medium',
                        }).format(date)
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 font-mono">
                    <Calendar
                      disabled={{ after: new Date() }}
                      mode="single"
                      onSelect={(value) => {
                        setDate(value)
                        setDatepickerOpen(false)
                      }}
                      required
                      selected={date}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="page-number">Page Number</Label>
                <Input
                  id="page-number"
                  max="31"
                  min="1"
                  onChange={(e) =>
                    setPageNumber(Number.parseInt(e.target.value, 10))
                  }
                  type="number"
                  value={pageNumber}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="time-of-day">Time of Day</Label>
                <RadioGroup onValueChange={setTimeOfDay} value={timeOfDay}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem id="morning" value="morning" />
                    <Label htmlFor="morning">morning</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem id="afternoon" value="afternoon" />
                    <Label htmlFor="afternoon">afternoon</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem id="evening" value="evening" />
                    <Label htmlFor="evening">evening</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <SheetFooter>
              <Button
                className="font-mono tracking-tighter"
                onClick={async () => {
                  // get user's unique fingerprint
                  const fp = await FingerprintJS.load()
                  const { visitorId } = await fp.get()

                  upsertDailyLogMutation.mutate({
                    userId: visitorId,
                    date: date.toISOString().split('T')[0],
                    pageNumber,
                    timeOfDay,
                  })

                  // reset values
                  setSheetOpen(false)
                  setPageNumber(date.getDate())
                  setTimeOfDay('morning')
                }}
                type="submit"
              >
                Save changes
              </Button>
              <SheetClose asChild>
                <Button
                  className="font-mono tracking-tighter"
                  variant="outline"
                >
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <div className="flex items-center justify-between gap-2 rounded-lg border font-medium text-sm lg:max-w-fit">
          <Button onClick={() => subtractDay()} variant="ghost">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover onOpenChange={setCalendarOpen} open={calendarOpen}>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'lg:text-base',
              )}
            >
              <TextMorph>
                {new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'long',
                }).format(date)}
              </TextMorph>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 font-mono">
              <Calendar
                disabled={{ after: new Date() }}
                mode="single"
                onSelect={onSelect}
                required={false}
                selected={date}
              />
            </PopoverContent>
          </Popover>
          <Button
            disabled={date.toDateString() === new Date().toDateString()}
            onClick={() => addDay()}
            variant="ghost"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <section>
        <div className="grid gap-2 md:grid-cols-2 lg:gap-4">
          <div className="p-6 text-center">
            <NumberTicker
              className="font-semibold text-4xl lg:text-5xl"
              value={410}
            />
            <p className="text-muted-foreground leading-7">
              Current ECCD members
            </p>
          </div>
          {/* TODO: show a different message here when count is 0 */}
          <div className="p-6 text-center">
            <div>
              <NumberTicker
                className="font-semibold text-3xl lg:text-4xl"
                value={dailyLogsQuery.data?.length ?? 0}
              />
              <span className="text-sm">+</span>
            </div>
            <p className="text-muted-foreground leading-7">
              prayed today -{' '}
              {countByPageNumber.length > 0 ? 'join them' : 'kick it off'}!
            </p>
          </div>
        </div>
        {/* <p className="leading-7">
          ECCD has{' '}
          <NumberTicker
            className="font-semibold text-3xl lg:text-4xl"
            value={410}
          />{' '}
          members.
        </p>
        <p className="mt-2 leading-7">
          <NumberTicker
            className="font-semibold text-3xl lg:text-4xl"
            value={dailyLogsQuery.data?.length ?? 0}
          />
          + members prayed today - join them!
        </p> */}
        {dailyLogsQuery.isLoading ? (
          <Skeleton className="mt-8 h-60 bg-muted" />
        ) : (
          <Card className="mt-8">
            <CardContent>
              {countByPageNumber.length > 0 ? (
                <CountByPageNumber data={countByPageNumber} />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 p-8">
                  <p className="text-muted-foreground">
                    No prayers recorded yet.
                  </p>
                  <Button
                    className="font-mono"
                    onClick={() => setSheetOpen(true)}
                  >
                    Get others started!
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
