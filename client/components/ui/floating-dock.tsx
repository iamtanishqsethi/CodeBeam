"use client";
/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
  }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
  }[];
  className?: string;
}) => {
  return (
    <div className={cn("flex h-12 items-center gap-2 px-3 md:hidden", className)}>
      {items.map((item) => (
        <div key={item.title}>
            {item.href ? (
                <a
                href={item.href}
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/10 backdrop-blur-md",
                    item.className
                )}
                >
                <div className="flex h-4 w-4 items-center justify-center">{item.icon}</div>
                </a>
            ) : item.onClick ? (
                <button
                onClick={item.onClick}
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/10 backdrop-blur-md",
                    item.className
                )}
                >
                <div className="flex h-4 w-4 items-center justify-center">{item.icon}</div>
                </button>
            ) : (
                <div
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/10 backdrop-blur-md",
                    item.className
                )}
                >
                <div className="flex h-4 w-4 items-center justify-center">{item.icon}</div>
                </div>
            )}
        </div>
      ))}
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
  }[];
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-end gap-4 rounded-full px-4 pb-3 md:flex",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
  className,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 52, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 52, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 26, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 26, 20],
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const content = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-full bg-white/10 border border-white/10 backdrop-blur-md transition-colors hover:bg-white/20",
        className,
      )}
    >
      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className="flex items-center justify-center"
      >
        {icon}
      </motion.div>
    </motion.div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="focus:outline-none">
        {content}
      </button>
    );
  }

  return content;
}
