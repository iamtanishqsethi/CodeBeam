"use client";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {PhoneOff} from "lucide-react";
import GlassSurface from "@/components/GlassSurface";

interface LeaveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLeave: () => void;
    onEndMeeting: () => void;
    isHost: boolean;
}

export default function LeaveDialog({
    open,
    onOpenChange,
    onLeave,
    onEndMeeting,
    isHost,
}: LeaveDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm border border-white/10 bg-zinc-950/90 backdrop-blur-2xl sm:rounded-2xl p-0">
                <div className="flex flex-col items-center p-8 text-center">
                    <GlassSurface
                        borderRadius={999}
                        width={64}
                        height={64}
                        backgroundOpacity={0.15}
                        blur={30}
                        className="mb-6 border border-white/5"
                        contentClassName="flex items-center justify-center"
                    >
                        <PhoneOff className="size-7 text-red-400" />
                    </GlassSurface>
                    
                    <h2 className="text-xl font-bold text-white mb-2">Leave meeting?</h2>
                    <p className="text-sm text-white/50 mb-8">
                        {isHost
                            ? "You can leave or end the meeting for everyone."
                            : "You'll be disconnected from the meeting."
                        }
                    </p>

                    <div className="flex w-full flex-col gap-3">
                        <Button
                            type="button"
                            onClick={() => {
                                onLeave();
                                onOpenChange(false);
                            }}
                            className="w-full h-12 rounded-xl bg-red-500 text-white hover:bg-red-600"
                        >
                            Leave meeting
                        </Button>
                        {isHost && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    onEndMeeting();
                                    onOpenChange(false);
                                }}
                                className="w-full h-12 rounded-xl border-white/10 text-white/70 hover:bg-white/5"
                            >
                                End for everyone
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="w-full h-12 rounded-xl text-white/50 hover:text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}