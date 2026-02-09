"use client";

import {useEffect, useMemo, useState} from "react";
import {Code, Copy} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ProjectSnippetDialogProps = {
  projectId: number;
};

export default function ProjectSnippetDialog({
  projectId,
}: ProjectSnippetDialogProps) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const widgetScriptUrl =
    process.env.NEXT_PUBLIC_WIDGET_SCRIPT_URL ??
    (origin
      ? `${origin}/widget/widget.js`
      : "https://your-domain.com/widget/widget.js");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    (origin ? origin : "https://your-api-domain.com");

  const snippet = useMemo(
    () =>
      `<script\n  id="feedora-widget-script"\n  src="${widgetScriptUrl}"\n  data-project-id="${projectId}"\n  data-api-url="${apiUrl}"\n  defer\n></script>`,
    [widgetScriptUrl, projectId, apiUrl],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Code /> Get Snippet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Embed your widget</DialogTitle>
          <DialogDescription>
            Copy this snippet and paste it into your website&#39;s HTML to embed
            the widget.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl border bg-muted/40 p-4 text-sm">
          <p className="font-medium">Quick setup guide</p>
          <p className="text-muted-foreground">
            Paste this script before the closing{" "}
            <span className="font-medium">&lt;/body&gt;</span>
            tag.
          </p>
        </div>
        <div className="relative rounded-2xl bg-slate-950 p-5 text-sm text-slate-100">
          <pre className="whitespace-pre-wrap">{snippet}</pre>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="absolute right-4 top-4"
            onClick={handleCopy}
          >
            <Copy />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
