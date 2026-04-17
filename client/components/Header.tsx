'use client'

import {ModeToggle} from "@/components/ModeToggle";
import {Button} from "@/components/ui/button";
import {Show, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";
import Link from "next/link";
import {Zap} from "lucide-react";
import {usePathname} from "next/navigation";

export default function Header() {
    const pathName = usePathname()
    const isMeetingPage = pathName.startsWith('/meeting/')

    if (isMeetingPage) return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/[0.06] bg-background/70 px-6 backdrop-blur-2xl">
            <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15">
                    <Zap className="size-4 text-primary" />
                </div>
                <span className="text-lg font-bold tracking-tight">CodeBeam</span>
            </Link>

            <div className="flex items-center gap-3">
                <ModeToggle />
                <Show when="signed-out">
                    <SignInButton>
                        <Button variant="ghost" className="cursor-pointer text-sm font-medium">
                            Sign In
                        </Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button className="cursor-pointer rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40">
                            Sign Up
                        </Button>
                    </SignUpButton>
                </Show>
                <Show when="signed-in">
                    <UserButton />
                </Show>
            </div>
        </header>
    )
}
