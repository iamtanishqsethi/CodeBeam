"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Check, Copy, Link2} from "lucide-react";
import {useState} from "react";
import {toast} from "sonner";

interface InviteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    meetingId: string;
}

export default function InviteDialog({open, onOpenChange, meetingId}: InviteDialogProps) {
    const [copied, setCopied] = useState(false);

    const meetingUrl = typeof window !== "undefined"
        ? `${window.location.origin}/meeting/${meetingId}`
        : meetingId;

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-background/95 backdrop-blur-2xl sm:rounded-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link2 />
                        Invite people
                    </DialogTitle>
                    <DialogDescription>
                        Share the meeting ID or link with others to invite them.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 pt-2">
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-muted-foreground">Meeting ID</span>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 rounded-lg bg-muted/50 px-4 py-3 font-mono text-sm tracking-[0.15em]">
                                {meetingId}
                            </code>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => copyToClipboard(meetingId)}
                                className="interactive-lift shrink-0"
                                aria-label="Copy meeting ID"
                            >
                                {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-muted-foreground">Meeting link</span>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 truncate rounded-lg bg-muted/50 px-4 py-3 text-xs">
                                {meetingUrl}
                            </code>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => copyToClipboard(meetingUrl)}
                                className="interactive-lift shrink-0"
                                aria-label="Copy meeting link"
                            >
                                <Copy data-icon="inline-start" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
