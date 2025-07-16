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

	boards: defineTable({
		id: v.string(),
		name: v.string(),
		color: v.string(),
	}).index('id', ['id']),

	columns: defineTable({
		id: v.string(),
		boardId: v.string(),
		name: v.string(),
		order: v.number(),
	})
		.index('id', ['id'])
		.index('board', ['boardId']),

	items: defineTable({
		id: v.string(),
		title: v.string(),
		content: v.optional(v.string()),
		order: v.number(),
		columnId: v.string(),
		boardId: v.string(),
	})
		.index('id', ['id'])
		.index('column', ['columnId'])
		.index('board', ['boardId']),
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

const board = schema.tables.boards.validator
const column = schema.tables.columns.validator
const item = schema.tables.items.validator

export const updateBoardSchema = v.object({
	id: board.fields.id,
	name: v.optional(board.fields.name),
	color: v.optional(v.string()),
})

export const updateColumnSchema = v.object({
	id: column.fields.id,
	boardId: column.fields.boardId,
	name: v.optional(column.fields.name),
	order: v.optional(column.fields.order),
})

export const deleteItemSchema = v.object({
	id: item.fields.id,
	boardId: item.fields.boardId,
})
const { order, id, ...rest } = column.fields
export const newColumnsSchema = v.object(rest)
export const deleteColumnSchema = v.object({
	boardId: column.fields.boardId,
	id: column.fields.id,
})

export type Board = Infer<typeof board>
export type Column = Infer<typeof column>
export type Item = Infer<typeof item>
