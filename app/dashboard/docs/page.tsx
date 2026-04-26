"use client";

import {useMemo, useState} from "react";
import {
  BookOpenText,
  Code2,
  Copy,
  Loader2,
  MessageSquareText,
  Star,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Marquee} from "@/components/ui/marquee";

type PublicFeedback = {
  id: number;
  name: string;
  rating: number;
  category: string;
  feedback: string;
  createdAt: string;
};

function FeedbackTile({item}: {item: PublicFeedback}) {
  return (
    <article className="w-[320px] rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-semibold text-sm truncate">{item.name}</p>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {item.category}
        </span>
      </div>
      <div className="mb-2 flex items-center gap-1 text-amber-500">
        {Array.from({length: 5}).map((_, index) => (
          <Star
            key={`${item.id}-${index}`}
            className="h-3.5 w-3.5"
            fill={index < item.rating ? "currentColor" : "none"}
          />
        ))}
      </div>
      <p className="line-clamp-3 text-sm text-muted-foreground">
        {item.feedback}
      </p>
    </article>
  );
}

export default function DocsPage() {
  const [projectId, setProjectId] = useState("1");
  const [apiBaseUrl, setApiBaseUrl] = useState(
    process.env.NEXT_PUBLIC_API_URL ?? "https://feedora.hiarun.me",
  );
  const [items, setItems] = useState<PublicFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"none" | "html" | "react">("none");

  const sanitizedProjectId = projectId.trim() || "1";
  const sanitizedApiUrl =
    apiBaseUrl.trim().replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://feedora.hiarun.me";

  const htmlSnippet = useMemo(
    () =>
      `<script\n  src=\"${sanitizedApiUrl}/widget/widget.js\"\n  id=\"feedora-widget-script\"\n  data-project-id=\"${sanitizedProjectId}\"\n  data-api-url=\"${sanitizedApiUrl}\"\n  data-theme-class=\"white\"\n  defer\n></script>`,
    [sanitizedApiUrl, sanitizedProjectId],
  );

  const reactSnippet = useMemo(
    () =>
      `import { Marquee } from \"@/components/ui/marquee\";\n\nasync function loadFeedback() {\n  const response = await fetch(\"${sanitizedApiUrl}/api/feedback?projectId=${sanitizedProjectId}&limit=20\");\n  const data = await response.json();\n  return data.feedback || [];\n}\n\nexport async function FeedbackMarquee() {\n  const feedback = await loadFeedback();\n\n  return (\n    <div className=\"group\">\n      <Marquee pauseOnHover className=\"py-2\">\n        {feedback.map((item) => (\n          <article key={item.id} className=\"w-[320px] rounded-xl border bg-white p-4\">\n            <p className=\"font-semibold\">{item.name}</p>\n            <p className=\"text-sm text-slate-600\">{item.feedback}</p>\n          </article>\n        ))}\n      </Marquee>\n    </div>\n  );\n}`,
    [sanitizedApiUrl, sanitizedProjectId],
  );

  const copyText = async (value: string, type: "html" | "react") => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied("none"), 1800);
  };

  const loadPreview = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${sanitizedApiUrl}/api/feedback?projectId=${sanitizedProjectId}&limit=12`,
      );

      if (!response.ok) {
        let message = "Failed to load feedback list";
        try {
          const data = (await response.json()) as {error?: string};
          if (data.error) {
            message = data.error;
          }
        } catch {
          // keep fallback message
        }
        throw new Error(message);
      }

      const data = (await response.json()) as {feedback?: PublicFeedback[]};
      setItems(data.feedback ?? []);
    } catch (err) {
      setItems([]);
      setError(err instanceof Error ? err.message : "Failed to load preview");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpenText className="h-5 w-5" /> Feedback Docs
          </CardTitle>
          <CardDescription>
            Embed your feedback button and display recent feedback on your site
            with a smooth marquee section.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project ID</label>
            <Input
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              placeholder="1"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">API Base URL</label>
            <Input
              value={apiBaseUrl}
              onChange={(event) => setApiBaseUrl(event.target.value)}
              placeholder="https://feedora.hiarun.me"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Code2 className="h-5 w-5" /> Widget Install Snippet
          </CardTitle>
          <CardDescription>
            Paste this before your site closing body tag.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
            {htmlSnippet}
          </pre>
          <Button
            type="button"
            onClick={() => {
              void copyText(htmlSnippet, "html");
            }}
          >
            <Copy className="h-4 w-4" />
            {copied === "html" ? "Copied" : "Copy snippet"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquareText className="h-5 w-5" /> Marquee Integration
            (React)
          </CardTitle>
          <CardDescription>
            Use this in your own site to show latest feedback cards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
            {reactSnippet}
          </pre>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void copyText(reactSnippet, "react");
            }}
          >
            <Copy className="h-4 w-4" />
            {copied === "react" ? "Copied" : "Copy React example"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Marquee Preview</CardTitle>
          <CardDescription>
            Loads public feedback from your API and scrolls it with the Marquee
            component.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={() => void loadPreview()}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading
                </>
              ) : (
                "Load preview"
              )}
            </Button>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
              No feedback loaded yet. Click Load preview.
            </div>
          ) : (
            <div className="group rounded-xl border bg-muted/20 py-3">
              <Marquee pauseOnHover durationSeconds={30}>
                {items.map((item) => (
                  <FeedbackTile key={item.id} item={item} />
                ))}
              </Marquee>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
