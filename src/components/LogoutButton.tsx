import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={signOut}
      className="fixed top-4 right-4 z-[60] rounded-full h-10 w-10 
        text-muted-foreground hover:text-foreground hover:bg-[#fdf6f0]
        border border-[#f1e5dc] hover:border-[#e76f51]/30"
      aria-label="Sign out"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}
