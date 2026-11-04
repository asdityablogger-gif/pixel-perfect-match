import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Baby,
  BookOpen,
  Moon,
  Milk,
  Thermometer,
  HeartPulse,
  HandHeart,
  Search,
  type LucideIcon,
} from "lucide-react";
import { ARTICLES, ARTICLE_CATEGORIES } from "@/data/articles";
import { GUIDES } from "@/data/guides";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Learn · Baby Help Buddy" },
      {
        name: "description",
        content:
          "Offline articles and step-by-step guides for common baby questions — crying, sleep, feeding, safety and more.",
      },
      { property: "og:title", content: "Learn · Baby Help Buddy" },
      {
        property: "og:description",
        content:
          "Offline articles and step-by-step guides for common baby questions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LearnHub,
});

const GUIDE_ICONS: Record<string, LucideIcon> = {
  Baby,
  Moon,
  Milk,
  Thermometer,
  HeartPulse,
  HandHeart,
};

const ACCENTS: Record<string, string> = {
  sage: "bg-sage",
  peach: "bg-peach",
  sky: "bg-sky",
};

function LearnHub() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const articles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter(
      (a) =>
        (category === "All" || a.category === category) &&
        (!q ||
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q)),
    );
  }, [query, category]);

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Learn</h1>
        <p className="text-sm text-muted-foreground">
          Gentle, practical guidance — all stored on your device.
        </p>
      </div>

      <section className="grid gap-2">
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
          <HandHeart className="h-4 w-4" aria-hidden /> What's going on?
        </h2>
        <p className="text-xs text-muted-foreground">
          Step-by-step helpers that walk you through a worry.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {GUIDES.map((g) => {
            const Icon = GUIDE_ICONS[g.icon] ?? Baby;
            return (
              <Link
                key={g.id}
                to="/learn/guide/$id"
                params={{ id: g.id }}
                className="group"
              >
                <Card className="h-full py-3 transition-colors group-hover:bg-accent">
                  <CardContent className="flex items-center gap-3 px-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        ACCENTS[g.accent] ?? "bg-muted"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-accent-foreground" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold leading-tight">
                        {g.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {g.subtitle}
                      </span>
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
          <BookOpen className="h-4 w-4" aria-hidden /> Articles
        </h2>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="pl-9"
            aria-label="Search articles"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["All", ...ARTICLE_CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors " +
                (category === c
                  ? "bg-primary text-primary-foreground"
                  : "border bg-card text-muted-foreground hover:bg-accent")
              }
            >
              {c}
            </button>
          ))}
        </div>
        {articles.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No articles match that search.
          </p>
        ) : (
          <div className="grid gap-2">
            {articles.map((a) => (
              <Link key={a.slug} to="/learn/article/$slug" params={{ slug: a.slug }}>
                <Card className="py-3 transition-colors hover:bg-accent">
                  <CardContent className="px-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-bold leading-tight">{a.title}</h3>
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        {a.minutes} min
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {a.summary}
                    </p>
                    <p className="mt-1.5 text-[11px] font-semibold text-primary">
                      {a.category}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
