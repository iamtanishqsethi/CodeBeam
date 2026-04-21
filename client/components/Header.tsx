'use client'

import React, { useState } from "react";
import {
    Navbar,
    NavBody,
    MobileNav,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import {Show, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";
import Link from "next/link";
import {Zap} from "lucide-react";
import {usePathname} from "next/navigation";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import GlassSurface from "./GlassSurface";
import { Button } from "./ui/button";

const navItems = [
    { name: "Features", link: "/#features" },
    { name: "Pricing", link: "/#pricing" },
    { name: "FAQ", link: "/#faq" },
];

export default function Header() {
    const pathName = usePathname()
    const isMeetingPage = pathName.startsWith('/meeting/')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (isMeetingPage) return null;

    return (
        <Navbar className="fixed top-0 left-0 right-0 z-50">
            {/* Desktop Navigation */}
            <NavBody className="p-0 border-none bg-transparent shadow-none backdrop-blur-0 dark:bg-transparent overflow-visible min-w-[700px]">
                <GlassSurface
                    width="100%"
                    height="100%"
                    borderRadius={999}
                    className="w-full h-full"
                    backgroundOpacity={0.1}
                    blur={12}
                    saturation={1.2}
                >
                    <div className="flex items-center justify-between w-full px-8 py-1.5 relative">
                        <Link href="/" className="interactive-lift flex items-center gap-2.5 relative z-50">
                            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/15">
                                <Zap className="text-primary size-3.5" />
                            </div>
                            <span className="text-lg font-semibold tracking-tight">CodeBeam</span>
                        </Link>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="flex items-center gap-8 pointer-events-auto">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.link}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 relative z-50">
                            <AnimatedThemeToggler />
                            <Show when="signed-out">
                                <SignInButton>
                                    <Button variant="ghost" size="sm" className="cursor-pointer text-sm font-medium">
                                        Sign In
                                    </Button>
                                </SignInButton>
                                <SignUpButton>
                                    <Button size="sm" className="interactive-lift cursor-pointer px-5 text-sm font-semibold shadow-sm shadow-primary/20">
                                        Sign Up
                                    </Button>
                                </SignUpButton>
                            </Show>
                            <Show when="signed-in">
                                <UserButton />
                            </Show>
                        </div>
                    </div>
                </GlassSurface>
            </NavBody>

            {/* Mobile Navigation */}
            <MobileNav className="p-0 border-none bg-transparent shadow-none backdrop-blur-0 lg:hidden overflow-visible">
                <GlassSurface
                    width="100%"
                    height="100%"
                    borderRadius={24}
                    className="w-full h-full"
                    backgroundOpacity={0.1}
                    blur={12}
                    saturation={1.2}
                >
                    <div className="flex flex-col w-full relative">
                        <MobileNavHeader className="px-6 py-4">
                            <Link href="/" className="interactive-lift flex items-center gap-2.5">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15">
                                    <Zap className="text-primary size-4" />
                                </div>
                                <span className="text-lg font-semibold tracking-tight">CodeBeam</span>
                            </Link>
                            <div className="flex items-center gap-2">
                                <AnimatedThemeToggler />
                                <MobileNavToggle
                                    isOpen={isMobileMenuOpen}
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                />
                            </div>
                        </MobileNavHeader>

                        <MobileNavMenu
                            isOpen={isMobileMenuOpen}
                            onClose={() => setIsMobileMenuOpen(false)}
                            className="top-20 mx-0 w-full border-none bg-transparent shadow-none backdrop-blur-0 p-0"
                        >
                            <div className="px-6 pb-8 space-y-4">
                                {navItems.map((item, idx) => (
                                    <Link
                                        key={`mobile-link-${idx}`}
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-lg font-medium text-neutral-600 dark:text-neutral-300 py-2 border-b border-border/50"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="flex w-full flex-col gap-3 pt-4">
                                    <Show when="signed-out">
                                        <SignInButton>
                                            <Button variant="outline" className="w-full h-12">Sign In</Button>
                                        </SignInButton>
                                        <SignUpButton>
                                            <Button className="w-full h-12">Sign Up</Button>
                                        </SignUpButton>
                                    </Show>
                                    <Show when="signed-in">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                                            <span className="font-medium">Account</span>
                                            <UserButton />
                                        </div>
                                    </Show>
                                </div>
                            </div>
                        </MobileNavMenu>
                    </div>
                </GlassSurface>
            </MobileNav>
        </Navbar>
    );
}
