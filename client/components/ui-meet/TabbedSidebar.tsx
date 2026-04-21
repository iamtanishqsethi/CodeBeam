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
import GlassSurface from "@/components/GlassSurface";

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
                <GlassSurface
                    borderRadius={999}
                    width="100%"
                    height={36}
                    backgroundOpacity={0.05}
                    blur={20}
                    className="mr-1.5"
                    contentClassName="p-0"
                >
                    <TabsList className="h-full w-full bg-transparent border-none p-1 rounded-full relative">
                        <TabsTrigger 
                            value="chat" 
                            className="flex-1 gap-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/60 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-none border-none relative z-10 transition-colors duration-300"
                        >
                            {currentTab === "chat" && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <MessageCircle size={14} />
                            Chat
                            {unreadCount > 0 && (
                                <Badge className="ml-1 min-w-5 px-1 text-[10px] bg-primary text-white border-none">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger 
                            value="participants" 
                            className="flex-1 gap-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/60 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-none border-none relative z-10 transition-colors duration-300"
                        >
                            {currentTab === "participants" && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Users size={14} />
                            People
                        </TabsTrigger>
                    </TabsList>
                </GlassSurface>

                <Button
                    type="button"
                    variant="default"
                    aria-label="Close panel"
                    onClick={onClose}
                    size={'icon-sm'}
                    className=" size-4 shrink-0  text-white/70 rounded-full "
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
                <SheetContent side="right" showCloseButton={false} className="w-[85%] sm:w-[400px] p-0 sm:max-w-none bg-white/5 backdrop-blur-2xl border-white/10 shadow-[-8px_0_32px_rgba(0,0,0,0.37)]">
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
                    animate={{ width: 400, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{
                        width: { type: "spring", damping: 30, stiffness: 300, restDelta: 0.5 },
                        opacity: { duration: 0.2, ease: "easeInOut" }
                    }}
                    className="hidden md:flex shrink-0 flex-col border-l border-white/10 bg-white/5 backdrop-blur-2xl relative z-40 overflow-hidden"
                >
                    <div className="h-full w-[400px] flex flex-col shadow-[-8px_0_32px_rgba(0,0,0,0.37)]">
                        {sidebarContent}
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );

}
