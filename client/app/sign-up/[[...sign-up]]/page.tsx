'use client'

import {SignUp} from "@clerk/nextjs";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import {motion} from "framer-motion";

const fadeUp = {
    hidden: {opacity: 0, y: 24},
    show: {opacity: 1, y: 0, transition: {duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const}},
};

export default function Page() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <FlickeringGrid
                    className="absolute inset-0 z-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_80%)]"
                    squareSize={4}
                    gridGap={6}
                    color="#ffffff"
                    maxOpacity={0.4}
                    flickerChance={0.1}
                />
            </div>

            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20"
            >
                <SignUp />
            </motion.div>
        </div>
    )
}