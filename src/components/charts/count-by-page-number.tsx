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
      <div className="mt-4 text-center text-muted-foreground text-sm">
        <span className="font-semibold">Number of people</span> and the{' '}
        <span className="font-semibold">page number</span> they prayed for
      </div>
    </div>
  )
}
