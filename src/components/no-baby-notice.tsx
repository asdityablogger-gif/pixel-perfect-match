import { Button } from "@/components/ui/button";
import { Baby as BabyIcon, Plus } from "lucide-react";
import { BabyDialog } from "@/components/baby-dialog";
import { useAppData } from "@/lib/store";
import { useState } from "react";

export function NoBabyNotice({ feature }: { feature: string }) {
  const data = useAppData();
  const [open, setOpen] = useState(false);
  const hasBabies = data.babies.length > 0;

  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-peach">
        <BabyIcon className="h-8 w-8 text-secondary-foreground" aria-hidden />
      </div>
      <h2 className="mt-4 text-lg font-bold">
        {hasBabies ? "Pick a baby first" : "Add your first baby"}
      </h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        {hasBabies
          ? `Use the name button at the top to choose whose ${feature} you'd like to see.`
          : `To start tracking ${feature}, add your baby's name and birth date. Everything stays on this device.`}
      </p>
      {!hasBabies && (
        <Button className="mt-5 rounded-full" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden /> Add a baby
        </Button>
      )}
      <BabyDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
