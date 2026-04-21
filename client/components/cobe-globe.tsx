"use client";

import { useTheme } from "next-themes";
import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function CobeGlobe({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const pointerInteracting = useRef<number | null>(null);
	const pointerInteractionStart = useRef<number | null>(null);
	const [r, setR] = useState(0);
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted || !canvasRef.current) return;

		let phi = 0;
		const width = 600;

		const globe = createGlobe(canvasRef.current, {
			devicePixelRatio: 2,
			width: width * 2,
			height: width * 2,
			phi: 0,
			theta: 0,
			dark: theme === "dark" ? 1 : 0,
			diffuse: 1.2,
			mapSamples: 16_000,
			mapBrightness: 6,
			baseColor: theme === "dark" ? [0.3, 0.3, 0.3] : [0.9, 0.9, 0.9],
			markerColor: [0.1, 0.8, 1],
			glowColor: theme === "dark" ? [1, 1, 1] : [0.5, 0.5, 0.5],
			markers: [
				{ location: [37.7595, -122.4367], size: 0.03 },
				{ location: [40.7128, -74.006], size: 0.1 },
			],
			onRender: (state: { phi: number }) => {
				if (!pointerInteracting.current) {
					phi += 0.005;
				}
				state.phi = phi + r;
			},
		} as never);

		requestAnimationFrame(() => {
			if (canvasRef.current) {
				canvasRef.current.style.opacity = "1";
			}
		});

		return () => {
			globe.destroy();
		};
	}, [mounted, theme, r]);

	if (!mounted) return null;

	return (
		<div className={cn("relative mx-auto aspect-square w-full max-w-[600px]", className)}>
			<canvas
				ref={canvasRef}
				onPointerDown={(e) => {
					pointerInteracting.current = e.clientX - pointerInteractionStart.current!;
					canvasRef.current!.style.cursor = "grabbing";
				}}
				onPointerUp={() => {
					pointerInteracting.current = null;
					canvasRef.current!.style.cursor = "grab";
				}}
				onPointerOut={() => {
					pointerInteracting.current = null;
					canvasRef.current!.style.cursor = "grab";
				}}
				onMouseMove={(e) => {
					if (pointerInteracting.current !== null) {
						const delta = e.clientX - pointerInteracting.current;
						pointerInteractionStart.current = delta;
						setR(delta / 200);
					}
				}}
				className="h-full w-full opacity-0 transition-opacity duration-500 cursor-grab"
				style={{ 
                    width: "100%", 
                    height: "100%", 
                    maxWidth: "100%", 
                    aspectRatio: "1 / 1"
                }}
			/>
		</div>
	);
}
