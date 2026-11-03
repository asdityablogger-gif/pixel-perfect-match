import { useEffect, useState } from "react";
import { Baby as BabyIcon } from "lucide-react";
import { getPhotoUrl } from "@/lib/photo-store";
import { cn } from "@/lib/utils";

export function PhotoImg({
  photoKey,
  alt,
  className,
}: {
  photoKey?: string;
  alt: string;
  className?: string;
}) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    let alive = true;
    if (!photoKey) {
      setUrl(undefined);
      return;
    }
    getPhotoUrl(photoKey).then((u) => {
      if (alive) setUrl(u);
    });
    return () => {
      alive = false;
    };
  }, [photoKey]);

  if (!photoKey || !url) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className,
        )}
      >
        <BabyIcon className="h-1/2 w-1/2 opacity-60" aria-hidden />
      </div>
    );
  }
  return <img src={url} alt={alt} className={cn("object-cover", className)} />;
}
