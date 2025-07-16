import { v } from 'convex/values'
import invariant from 'tiny-invariant'
import type { Doc, Id } from './_generated/dataModel'
import { mutation, type QueryCtx, query } from './_generated/server'
import { deleteDailyLogSchema, upsertDailyLogSchema } from './schema'

function withoutSystemFields<T extends { _creationTime: number; _id: Id<any> }>(
	doc: T,
) {
	const { _id, _creationTime, ...rest } = doc
	return rest
}

export const getDailyLogsByDate = query({
	args: { date: v.string() },
	handler: async (ctx, { date }) => {
		const dailyLogs = await ctx.db
			.query('dailyLogs')
			.withIndex('by_date', (q) => q.eq('date', date))
			.collect()

		return await Promise.all(dailyLogs.map((dl) => withoutSystemFields(dl)))
	},
})

async function ensureDailyLogExists(
	ctx: QueryCtx,
	userId: string,
	date: string,
): Promise<Doc<'dailyLogs'>> {
	const dailyLog = await ctx.db
		.query('dailyLogs')
		.withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', date))
		.unique()

	invariant(dailyLog, `missing daily log of user ${userId} on ${date}`)
	return dailyLog
}

export const upsertDailyLog = mutation({
	args: upsertDailyLogSchema,
	handler: async (ctx, dailyLogUpsert) => {
		const existing = await ctx.db
			.query('dailyLogs')
			.withIndex('by_user_date', (q) =>
				q.eq('userId', dailyLogUpsert.userId).eq('date', dailyLogUpsert.date),
			)
			.unique()

		if (existing) {
			await ctx.db.patch(existing._id, dailyLogUpsert)
			return existing._id
		}
		return await ctx.db.insert('dailyLogs', dailyLogUpsert)
	},
})

export const deleteDailyLog = mutation({
	args: deleteDailyLogSchema,
	handler: async (ctx, { userId, date }) => {
		const dailyLog = await ensureDailyLogExists(ctx, userId, date)
		await ctx.db.delete(dailyLog._id)
	},
})
