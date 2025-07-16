'use client'
import {
	AnimatePresence,
	motion,
	type Transition,
	type Variants,
} from 'motion/react'
import { useId, useMemo } from 'react'
import { cn } from '~/lib/utils'

export type TextMorphProps = {
	children: string
	as?: React.ElementType
	className?: string
	style?: React.CSSProperties
	variants?: Variants
	transition?: Transition
}

export function TextMorph({
	children,
	as: Component = 'p',
	className,
	style,
	variants,
	transition,
}: TextMorphProps) {
	const uniqueId = useId()

	const characters = useMemo(() => {
		const charCounts: Record<string, number> = {}

		return children.split('').map((char) => {
			const lowerChar = char.toLowerCase()
			charCounts[lowerChar] = (charCounts[lowerChar] || 0) + 1

			return {
				id: `${uniqueId}-${lowerChar}${charCounts[lowerChar]}`,
				label: char === ' ' ? '\u00A0' : char,
			}
		})
	}, [children, uniqueId])

	const defaultVariants: Variants = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	}

	const defaultTransition: Transition = {
		type: 'spring',
		stiffness: 280,
		damping: 18,
		mass: 0.3,
	}

	return (
		<Component aria-label={children} className={cn(className)} style={style}>
			<AnimatePresence initial={false} mode="popLayout">
				{characters.map((character) => (
					<motion.span
						animate="animate"
						aria-hidden="true"
						className="inline-block"
						exit="exit"
						initial="initial"
						key={character.id}
						layoutId={character.id}
						transition={transition || defaultTransition}
						variants={variants || defaultVariants}
					>
						{character.label}
					</motion.span>
				))}
			</AnimatePresence>
		</Component>
	)
}
