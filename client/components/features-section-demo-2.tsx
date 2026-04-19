import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import React, { useState } from "react";
import {CastIcon} from "@/components/ui/cast";
import {UsersIcon} from "@/components/ui/users";
import {ShieldCheckIcon} from "@/components/ui/shield-check";
import {CogIcon} from "@/components/ui/cog";
import {CalendarDaysIcon} from "@/components/ui/calendar-days";
import {TerminalIcon} from "@/components/ui/terminal";
import {WebhookIcon} from "@/components/ui/webhook";
import {FolderCodeIcon} from "@/components/ui/folder-code";

export default function FeaturesSectionDemo() {
  const features = [
    {
      title: "HD Video Calls",
      description:
        "Crystal-clear video powered by LiveKit with adaptive bitrate and noise cancellation.",
      icon: <CastIcon/>,
      upcoming: false,
    },
    {
      title: "Real-time Collaboration",
      description:
        "Chat, react, and share screens in a single, fluid interface designed for teams.",
      icon: <UsersIcon/>,
      upcoming: false,
    },
    {
      title: "Secure by Default",
      description:
        "End-to-end encrypted rooms with waiting room approval and host controls.",
      icon:<ShieldCheckIcon/> ,
      upcoming: false,
    },
    {
      title: "Host Controls",
      description:
        "Complete control over participants, screen sharing permissions, and room locking.",
      icon: <CogIcon/>,
      upcoming: false,
    },
    {
      title: "Google Calendar Sync",
      description:
        "Schedule and manage your meetings directly from your Google Calendar.",
      icon: <CalendarDaysIcon/>,
      upcoming: true,
    },
    {
      title: "Integrated Terminal",
      description:
        "Collaborative terminal for real-time debugging and command execution in-meeting.",
      icon:<TerminalIcon/> ,
      upcoming: true,
    },
    {
      title: "API Testing Tools",
      description:
        "Test and share API endpoints with a built-in Postman-like interface.",
      icon: <WebhookIcon/>,
      upcoming: true,
    },
    {
      title: "Live Code Sandbox",
      description:
        "Build, preview, and collaborate on code projects with a shared sandbox.",
      icon: <FolderCodeIcon/>,
      upcoming: true,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
  upcoming,
}: {
  title: string;
  description: string;
  icon:  React.ReactNode;
  index: number;
  upcoming: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        <div className="w-fit h-fit -m-2">
          {icon}
        </div>
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10 flex items-center gap-2">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-primary dark:group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
        {upcoming && (
          <Badge 
            className="text-[10px] h-4 px-1.5 py-0 uppercase bg-primary text-primary-foreground shadow-[0_0_15px_color-mix(in_oklch,var(--primary)_40%,transparent)]"
          >
            Upcoming
          </Badge>
        )}
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
