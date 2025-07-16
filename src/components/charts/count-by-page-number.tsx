// import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
// import {
// 	type ChartConfig,
// 	ChartContainer,
// 	ChartLegend,
// 	ChartLegendContent,
// 	ChartTooltip,
// 	ChartTooltipContent,
// } from '~/components/ui/chart'

// const chartConfig = {
// 	count: {
// 		label: 'Count',
// 		color: 'var(--chart-4)',
// 	},
// } satisfies ChartConfig

// export function CountByPageNumber({
// 	data,
// }: {
// 	data: { page: number; count: number }[]
// }) {
// 	return (
// 		<ChartContainer className="min-h-60 w-full font-mono" config={chartConfig}>
// 			<BarChart accessibilityLayer data={data}>
// 				<CartesianGrid vertical={false} />
// 				<XAxis
// 					axisLine={false}
// 					dataKey="page"
// 					tickLine={false}
// 					tickMargin={10}
// 				/>
// 				<ChartTooltip content={<ChartTooltipContent />} />
// 				<ChartLegend content={<ChartLegendContent />} />
// 				<Bar dataKey="count" fill="var(--color-count)" radius={4} />
// 			</BarChart>
// 		</ChartContainer>
// 	)
// }

import { AnimatePresence, motion } from 'motion/react'

export function CountByPageNumber({
	data,
}: {
	data: { page: number; count: number }[]
}) {
	return (
		<div className="font-mono">
			<div className="flex min-h-[200px] items-end justify-center gap-3">
				<AnimatePresence mode="wait">
					{data.map((item) => (
						<motion.div
							animate={{ opacity: 1, scale: 1 }}
							className="flex flex-col items-center"
							exit={{ opacity: 0, scale: 0.8 }}
							initial={{ opacity: 0, scale: 0.8 }}
							key={item.page}
							transition={{ duration: 0.3, delay: item.page * 0.02 }}
						>
							<div className="mb-1 font-semibold text-muted-foreground text-xs lg:text-sm">
								{item.count}
							</div>
							{/* Stack of squares */}
							<div className="mb-2 flex flex-col-reverse gap-1">
								{Array.from({ length: item.count }, (_, index) => (
									<motion.div
										animate={{ opacity: 1, y: 0 }}
										className=" h-6 w-6 rounded-md border border-chart-4 bg-chart-4 hover:bg-chart-4/75"
										initial={{ opacity: 0, y: 10 }}
										key={index}
										transition={{
											duration: 0.25,
											delay: item.page * 0.02 + index * 0.05,
										}}
									/>
								))}
							</div>

							{/* Page number label */}
							<div className="font-medium text-muted-foreground text-xs tracking-tight lg:text-sm">
								p.{item.page}
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{/* Optional title */}
			{/* <div className="mt-4 text-center text-muted-foreground text-sm">
				Page Number Distribution
			</div> */}
		</div>
	)
}
