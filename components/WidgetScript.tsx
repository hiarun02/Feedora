"use client";

import {useEffect} from "react";

type WidgetScriptProps = {
  projectId?: string;
  apiUrl?: string;
  scriptUrl?: string;
};

const WIDGET_SCRIPT_ID = "feedora-widget-script";
const WIDGET_ROOT_ID = "feedora-widget-root";
const WIDGET_PANEL_ID = "feedora-widget-panel";
const WIDGET_STYLE_ID = "feedora-widget-styles";

export default function WidgetScript({
  projectId,
  apiUrl,
  scriptUrl,
}: WidgetScriptProps) {
  useEffect(() => {
    const cleanup = () => {
      const root = document.getElementById(WIDGET_ROOT_ID);
      if (root) {
        root.remove();
      }

      const panel = document.getElementById(WIDGET_PANEL_ID);
      if (panel) {
        panel.remove();
      }

      const style = document.getElementById(WIDGET_STYLE_ID);
      if (style) {
        style.remove();
      }

      const script = document.getElementById(WIDGET_SCRIPT_ID);
      if (script) {
        script.remove();
      }
    };

    if (!projectId) {
      cleanup();
      return cleanup;
    }

    const existingScript = document.getElementById(
      WIDGET_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    // Auto-detect URLs if not provided
    const finalScriptUrl =
      scriptUrl ?? `${window.location.origin}/widget/widget.js`;
    const finalApiUrl = apiUrl ?? window.location.origin;

    if (existingScript) {
      existingScript.setAttribute("data-project-id", projectId);
      existingScript.setAttribute("data-api-url", finalApiUrl);
      return cleanup;
    }

    const script = document.createElement("script");
    script.id = WIDGET_SCRIPT_ID;
    script.src = finalScriptUrl;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-project-id", projectId);
    script.setAttribute("data-api-url", finalApiUrl);
    document.body.appendChild(script);

    return cleanup;
  }, [projectId, apiUrl, scriptUrl]);

  return null;
}
