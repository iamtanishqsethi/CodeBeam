import {ModeToggle} from "@/components/ModeToggle";
import {Button} from "@/components/ui/button";
import {Show, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";

export default function Header() {
    return (
        <header className="flex w-full bg-accent justify-end items-center p-4 gap-4 h-16 absolute top-0 right-0">
            <ModeToggle />
            <Show when="signed-out">
                <SignInButton />
                <SignUpButton>
                    <Button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base  cursor-pointer">
                        Sign Up
                    </Button>
                </SignUpButton>
            </Show>
            <Show when="signed-in">
                <UserButton />
            </Show>
        </header>
    )
}