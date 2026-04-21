"use client";

import {AnimatePresence, motion} from "framer-motion";
import {MessageCircle, Users, X} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Sheet, SheetContent, SheetDescription, SheetTitle} from "@/components/ui/sheet";
import {useEffect, useState} from "react";
import ChatTab from "@/components/ui-meet/ChatTab";
import ParticipantsTab from "@/components/ui-meet/ParticipantsTab";

interface TabbedSidebarProps {
    meetingId: string;
    activePanel: "chat" | "participants" | null;
    onClose: () => void;
    onTabChange: (tab: "chat" | "participants") => void;
    unreadCount: number;
}

export default function TabbedSidebar({
    meetingId,
    activePanel,
    onClose,
    onTabChange,
    unreadCount,
}: TabbedSidebarProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const update = () => setIsMobile(mediaQuery.matches);
        update();
        mediaQuery.addEventListener("change", update);
        return () => mediaQuery.removeEventListener("change", update);
    }, []);

    const isOpen = activePanel !== null;
    const currentTab = activePanel ?? "chat";

    const sidebarContent = (
        <Tabs
            value={currentTab}
            onValueChange={(v) => onTabChange(v as "chat" | "participants")}
            className="flex h-full flex-col"
        >
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                <TabsList className="h-9 w-full bg-white/5 border border-white/10 p-1">
                    <TabsTrigger value="chat" className="flex-1 gap-1.5 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                        <MessageCircle size={16} />
                        Chat
                        {unreadCount > 0 && (
                            <Badge className="ml-1 min-w-5 px-1 text-[10px] bg-primary text-white border-none">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="participants" className="flex-1 gap-1.5 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                        <Users size={16} />
                        People
                    </TabsTrigger>
                </TabsList>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Close panel"
                    onClick={onClose}
                    className="interactive-lift ml-2 size-8 shrink-0 hover:bg-white/10 text-white/70"
                >
                    <X className="size-4" />
                </Button>
            </div>

            <TabsContent value="chat" className="mt-0 min-h-0 flex-1">
                <ChatTab meetingId={meetingId} />
            </TabsContent>
            <TabsContent value="participants" className="mt-0 min-h-0 flex-1">
                <ParticipantsTab meetingId={meetingId} />
            </TabsContent>
        </Tabs>
    );

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <SheetContent side="right" showCloseButton={false} className="w-full p-0 sm:max-w-none bg-white/5 backdrop-blur-2xl border-white/10 shadow-[-8px_0_32px_rgba(0,0,0,0.37)]">
                    <SheetTitle className="sr-only">Meeting Panel</SheetTitle>
                    <SheetDescription className="sr-only">Chat and participants panel</SheetDescription>
                    {sidebarContent}
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.aside
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 352, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{
                        width: { type: "spring", damping: 30, stiffness: 300, restDelta: 0.5 },
                        opacity: { duration: 0.2, ease: "easeInOut" }
                    }}
                    className="hidden md:flex shrink-0 flex-col border-l border-white/10 bg-white/5 backdrop-blur-2xl relative z-40 overflow-hidden"
                >
                    <div className="h-full w-[352px] flex flex-col shadow-[-8px_0_32px_rgba(0,0,0,0.37)]">
                        {sidebarContent}
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}
