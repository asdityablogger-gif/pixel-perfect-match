import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Stethoscope,
} from "lucide-react";
import { getGuide } from "@/data/guides";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/learn/guide/$id")({
  loader: ({ params }) => {
    if (!getGuide(params.id)) throw notFound();
    return null;
  },
  head: () => ({
    meta: [
      { title: "Guide · Baby Help Buddy" },
      {
        name: "description",
        content:
          "A step-by-step helper that walks you through a common baby worry.",
      },
      { property: "og:title", content: "Guide · Baby Help Buddy" },
      {
        property: "og:description",
        content: "A step-by-step helper for a common baby worry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GuidePage,
});

const ACCENTS: Record<string, string> = {
  sage: "bg-sage",
  peach: "bg-peach",
  sky: "bg-sky",
};

function GuidePage() {
  const { id } = Route.useParams();
  const guide = getGuide(id)!;
  const [nodeId, setNodeId] = useState<string>(guide.start);
  const node = guide.nodes[nodeId];

  if (!node) {
    return (
      <div className="grid gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight">{guide.title}</h1>
        <p className="text-sm text-muted-foreground">
          This helper seems incomplete. Please pick another one.
        </p>
        <Button asChild variant="outline" className="w-fit rounded-full">
          <Link to="/learn">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Learn
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {guide.title}
          </h1>
          <p className="text-sm text-muted-foreground">{guide.subtitle}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 rounded-full"
          onClick={() => setNodeId(guide.start)}
          aria-label="Restart this guide"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Start over
        </Button>
      </div>

      {node.type === "question" ? (
        <Card className="py-4">
          <CardContent className="grid gap-3 px-4">
            <p className="text-sm font-bold">{node.text}</p>
            <div className="grid gap-2">
              {node.options.map((opt) => (
                <Button
                  key={opt.next}
                  variant="outline"
                  className="h-auto justify-between rounded-2xl px-4 py-3 text-left font-semibold"
                  onClick={() => setNodeId(opt.next)}
                >
                  <span className="min-w-0 pr-2">{opt.label}</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </Button>
              ))}
            </div>
            {nodeId !== guide.start && (
              <Button
                variant="ghost"
                size="sm"
                className="w-fit rounded-full text-muted-foreground"
                onClick={() => setNodeId(guide.start)}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back to start
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="py-4">
          <CardContent className="grid gap-3 px-4">
            <h2 className="text-lg font-extrabold">{node.title}</h2>
            {node.seeDoctor && (
              <p className="flex items-start gap-2 rounded-2xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">
                <Stethoscope className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                Contact a health professional for this one.
              </p>
            )}
            <p className="text-sm whitespace-pre-wrap">{node.body}</p>
            {node.suggestions.length > 0 && (
              <div className="grid gap-2">
                <p className="text-sm font-bold">Things you can try</p>
                <ul className="grid gap-1.5">
                  {node.suggestions.map((s) => (
                    <li
                      key={s}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {node.articleSlug && (
              <Button asChild variant="outline" className="w-fit rounded-full">
                <Link to="/learn/article/$slug" params={{ slug: node.articleSlug }}>
                  <BookOpen className="h-4 w-4" aria-hidden /> Read the article
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-fit rounded-full text-muted-foreground"
              onClick={() => setNodeId(guide.start)}
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Walk through again
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-2 rounded-2xl border border-dashed bg-muted/40 p-3">
        <Badge
          variant="secondary"
          className="w-fit gap-1 text-[10px]"
          aria-hidden
        >
          <AlertTriangle className="h-3 w-3" aria-hidden /> Safety note
        </Badge>
        <p className="text-xs text-muted-foreground">{guide.safetyNote}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link to="/learn">
            <ArrowLeft className="h-4 w-4" aria-hidden /> All helpers
          </Link>
        </Button>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full ${
            ACCENTS[guide.accent] ?? "bg-muted"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5 text-accent-foreground" aria-hidden />
        </span>
      </div>
    </div>
  );
}
