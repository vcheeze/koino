import { defineSchema, defineTable } from 'convex/server'
import { type Infer, v } from 'convex/values'

const schema = defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
  }),

  dailyLogs: defineTable({
    userId: v.string(),
    date: v.string(), // 'YYYY-MM-DD'
    timeOfDay: v.optional(v.string()), // 'morning' | 'afternoon' | 'evening'
    pageNumber: v.number(), // 1 to 31
  })
    .index('by_user_date', ['userId', 'date'])
    .index('by_date', ['date']),
})
export default schema

const user = schema.tables.users.validator
const dailyLog = schema.tables.dailyLogs.validator

export const upsertDailyLogSchema = v.object({
  userId: dailyLog.fields.userId,
  date: dailyLog.fields.date,
  pageNumber: dailyLog.fields.pageNumber,
  timeOfDay: v.optional(dailyLog.fields.timeOfDay),
})

export const deleteDailyLogSchema = v.object({
  userId: dailyLog.fields.userId,
  date: dailyLog.fields.date,
})

export type User = Infer<typeof user>
export type DailyLog = Infer<typeof dailyLog>
