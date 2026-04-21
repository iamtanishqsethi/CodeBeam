'use client';

import { type JSX, useState } from 'react';
import { motion, type Transition } from 'motion/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import GlassSurface from '../GlassSurface';

const SPRING: Transition = {
    type: 'spring',
    bounce: 0.55,
    duration: 1,
};

export interface SplitAction {
    label: string;
    onClick?: () => void;
}

export interface SplitButtonProps {
    label?: string;
    actions?: SplitAction[];
}

export default function SplitButton({
                                        label = 'New Project',
                                        actions = [
                                            { label: 'iOS', onClick: () => {} },
                                            { label: 'macOS', onClick: () => {} },
                                            { label: 'tvOS', onClick: () => {} },
                                        ],
                                    }: SplitButtonProps = {}): JSX.Element {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className="relative flex min-h-[40px] w-full items-center justify-center font-bold">
            {/* MAIN BUTTON */}
            <motion.button
                layout
                transition={SPRING}
                onClick={() => setOpen(true)}
                className="absolute z-10 rounded-full whitespace-nowrap tracking-tight"
                initial={false}
                animate={{
                    scaleX: open ? 1.5 : 1,
                    scaleY: open ? 0.9 : 1,
                    opacity: open ? 0 : 1,
                    filter: open ? 'blur(8px)' : 'blur(0px)',
                    pointerEvents: open ? 'none' : 'auto',
                }}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 1.15 }}
            >
                <GlassSurface 
                    width="auto" 
                    height="auto" 
                    borderRadius={999}
                    className="px-5 py-2"
                    backgroundOpacity={0.1}
                >
                    <span className="text-neutral-700 dark:text-neutral-200 text-base font-semibold">
                        {label}
                    </span>
                </GlassSurface>
            </motion.button>

            {/* SPLIT ROW */}
            <motion.div
                layout
                transition={SPRING}
                className="absolute z-0 flex items-center justify-center gap-1.5"
                initial={false}
                animate={{
                    scaleX: open ? 1 : 0.2,
                    scaleY: open ? 1 : 0.9,
                    opacity: open ? 1 : 0,
                    filter: open ? 'blur(0px)' : 'blur(8px)',
                    pointerEvents: open ? 'auto' : 'none',
                }}
            >
                {/* BACK BUTTON */}
                <motion.button
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-full tracking-tight"
                    whileHover={{ scale: 1 }}
                    whileTap={{ scale: 1.15 }}
                >
                    <GlassSurface 
                        width="auto" 
                        height="auto" 
                        borderRadius={999}
                        className="p-2"
                        backgroundOpacity={0.1}
                    >
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} className="text-neutral-700 dark:text-neutral-200 " />
                    </GlassSurface>
                </motion.button>

                {actions.map((action, index) => {
                    return (
                        <motion.button
                            key={index}
                            onClick={() => {
                                action.onClick?.();
                                setOpen(false);
                            }}
                            className="rounded-full tracking-tight"
                            whileHover={{ scale: 1 }}
                            whileTap={{ scale: 1.05 }}
                        >
                            <GlassSurface 
                                width="auto" 
                                height="auto" 
                                borderRadius={999}
                                className="px-4 py-2"
                                backgroundOpacity={0.1}
                            >
                                <span className="text-neutral-700 dark:text-neutral-200 text-base font-semibold">
                                    {action.label}
                                </span>
                            </GlassSurface>
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
}
