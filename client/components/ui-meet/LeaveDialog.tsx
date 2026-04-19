"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {LogOut, PhoneOff} from "lucide-react";

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
            <DialogContent className="max-w-sm bg-background/95 backdrop-blur-2xl sm:rounded-lg">
                <DialogHeader>
                    <DialogTitle>Leave meeting?</DialogTitle>
                    <DialogDescription>
                        {isHost
                            ? "As the host, you can leave or end the meeting for everyone."
                            : "You will be disconnected from the meeting."
                        }
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col gap-2 sm:flex-col">
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            onLeave();
                            onOpenChange(false);
                        }}
                        className="interactive-lift w-full gap-2"
                    >
                        <PhoneOff data-icon="inline-start" />
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
                            className="interactive-lift w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                        >
                            <LogOut data-icon="inline-start" />
                            End for everyone
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="interactive-lift w-full"
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
