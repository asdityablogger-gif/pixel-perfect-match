import { useState, type ReactNode } from "react";
import {
  Link,
  useRouterState,
} from "@tanstack/react-router";
import {
  BookOpen,
  Check,
  Home,
  Menu,
  Milk,
  Moon,
  Plus,
  Settings,
} from "lucide-react";
import { useAppData, setActiveBaby } from "@/lib/store";
import { activeBaby } from "@/lib/selectors";
import { formatAge } from "@/lib/date-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BabyDialog } from "@/components/baby-dialog";
import { PhotoImg } from "@/components/photo";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/feedings", label: "Feeds", icon: Milk },
  { to: "/sleep", label: "Sleep", icon: Moon },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/more", label: "More", icon: Menu },
] as const;

function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-xl">
        {NAV.map((item) => {
          const active =
            item.to === "/"
              ? pathname === "/"
              : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors " +
                (active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              <Icon className="h-5 w-5" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function BabySwitcher() {
  const data = useAppData();
  const baby = activeBaby(data);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={
            "flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors " +
            (baby ? "hover:bg-accent" : "bg-secondary hover:bg-secondary/80")
          }
        >
          <PhotoImg
            photoKey={baby?.photoKey}
            alt={baby?.name ?? "Baby"}
            className="h-8 w-8 rounded-full"
          />
          <span className="max-w-32 truncate text-sm font-bold">
            {baby ? baby.name : "Add baby"}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {baby ? formatAge(baby.birthDate) : "Who are we caring for?"}
          </DropdownMenuLabel>
          {data.babies.map((b) => (
            <DropdownMenuItem
              key={b.id}
              onClick={() => setActiveBaby(b.id)}
              className="gap-2"
            >
              <PhotoImg
                photoKey={b.photoKey}
                alt={b.name}
                className="h-6 w-6 rounded-full"
              />
              <span className="flex-1 truncate">{b.name}</span>
              {b.id === baby?.id && <Check className="h-4 w-4" aria-hidden />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" aria-hidden />
            Add a baby
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <BabyDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b bg-background/95 px-4 py-2.5 backdrop-blur">
        <BabySwitcher />
        <Link
          to="/settings"
          aria-label="Settings"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Settings className="h-5 w-5" aria-hidden />
        </Link>
      </header>
      <main className="flex-1 px-4 pt-4 pb-28">{children}</main>
      <BottomNav />
    </div>
  );
}
