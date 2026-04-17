"use client";

import {AnimatePresence, motion} from "framer-motion";

export interface ReactionItem {
    id: string;
    emoji: string;
    x: number;
}

export function ReactionsOverlay({reactions}: {reactions: ReactionItem[]}) {
    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-30 flex justify-center overflow-visible">
            <AnimatePresence>
                {reactions.map((reaction) => (
                    <motion.div
                        key={reaction.id}
                        initial={{opacity: 0, y: 0, x: 0, scale: 0.7}}
                        animate={{opacity: [0, 1, 1, 0], y: -170, x: reaction.x, scale: [0.7, 1.1, 1]}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.8, ease: "easeOut"}}
                        className="absolute rounded-full bg-background/72 px-3 py-2 text-3xl shadow-lg backdrop-blur"
                    >
                        {reaction.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
