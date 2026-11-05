import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getArticle } from "@/data/articles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/learn/article/$slug")({
  loader: ({ params }) => {
    if (!getArticle(params.slug)) throw notFound();
    return null;
  },
  head: () => ({
    meta: [
      { title: "Article · Baby Help Buddy" },
      {
        name: "description",
        content: "Practical, gentle baby care advice — readable offline.",
      },
      { property: "og:title", content: "Article · Baby Help Buddy" },
      {
        property: "og:description",
        content: "Practical, gentle baby care advice — readable offline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const article = getArticle(slug)!;

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            {article.category}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {article.minutes} min read
          </Badge>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          {article.title}
        </h1>
        <p className="text-sm text-muted-foreground">{article.summary}</p>
      </div>

      <div className="grid gap-4">
        {article.sections.map((section) => (
          <section key={section.heading} className="grid gap-2">
            <h2 className="text-base font-extrabold">{section.heading}</h2>
            <p className="text-sm whitespace-pre-wrap">{section.body}</p>
            {section.bullets && section.bullets.length > 0 && (
              <ul className="grid gap-1.5">
                {section.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {article.related && article.related.length > 0 && (
        <section className="grid gap-2">
          <h2 className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
            <BookOpen className="h-4 w-4" aria-hidden /> Keep reading
          </h2>
          <div className="grid gap-2">
            {article.related
              .map((s) => getArticle(s))
              .filter((a): a is NonNullable<typeof a> => !!a)
              .map((a) => (
                <Link
                  key={a.slug}
                  to="/learn/article/$slug"
                  params={{ slug: a.slug }}
                >
                  <Card className="py-3 transition-colors hover:bg-accent">
                    <CardContent className="px-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-bold leading-tight">{a.title}</h3>
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-[10px]"
                        >
                          {a.minutes} min
                        </Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {a.summary}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </section>
      )}

      <Button asChild variant="outline" size="sm" className="w-fit rounded-full">
        <Link to="/learn">
          <ArrowLeft className="h-4 w-4" aria-hidden /> All articles
        </Link>
      </Button>
    </div>
  );
}
