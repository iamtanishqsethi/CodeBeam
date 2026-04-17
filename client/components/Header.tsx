'use client'

import {ModeToggle} from "@/components/ModeToggle";
import {Button} from "@/components/ui/button";
import {Show, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";
import Link from "next/link";
import {Video} from "lucide-react";
import {usePathname} from "next/navigation";

export default function Header() {

    const pathName=usePathname()
    const isDashboard = pathName === '/'


   return (
       <>
           {isDashboard ? (        <header className="flex w-full bg-accent justify-between items-center px-6 h-16 border-b fixed top-0 z-50">
                   <Link href="/" className="flex items-center gap-2">
                       <Video className="h-5 w-5 text-primary"/>
                       <span className="font-bold text-lg">CodeBeam</span>
                   </Link>

                   <div className="flex items-center gap-3">
                       <ModeToggle/>
                       <Show when="signed-out">
                           <SignInButton>
                               <Button variant="ghost" className="font-medium text-sm cursor-pointer">
                                   Sign In
                               </Button>
                           </SignInButton>
                           <SignUpButton>
                               <Button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm cursor-pointer">
                                   Sign Up
                               </Button>
                           </SignUpButton>
                       </Show>
                       <Show when="signed-in">
                           <Link href="/dashboard">
                               <Button variant="ghost" size="sm">Dashboard</Button>
                           </Link>
                           <UserButton/>
                       </Show>
                   </div>
               </header>
           ): <div></div>}
       </>
    )
}
