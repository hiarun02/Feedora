export const runtime = "nodejs";

const script = `(function () {
  var existing = document.getElementById("feedora-widget-root");
  if (existing) {
    return;
  }

  var scriptEl = document.currentScript || document.getElementById("feedora-widget-script");
  var projectId = scriptEl && scriptEl.getAttribute("data-project-id") ? scriptEl.getAttribute("data-project-id") : "";
  var apiUrl = scriptEl && scriptEl.getAttribute("data-api-url") ? scriptEl.getAttribute("data-api-url") : "";
  var scriptSrc = scriptEl && scriptEl.getAttribute("src") ? scriptEl.getAttribute("src") : "";
  var assetBase = scriptSrc.indexOf("http") === 0 ? scriptSrc.split("/widget/widget.js")[0] : window.location.origin;
  var logoUrl = assetBase.replace(/\\/$/, "") + "/favicon.svg";
  var resolvedApiUrl = apiUrl || window.location.origin;
  var endpoint = resolvedApiUrl.replace(/\\/$/, "") + "/api/feedback";

  var root = document.createElement("div");
  root.id = "feedora-widget-root";
  document.body.appendChild(root);

  var button = document.createElement("button");
  button.type = "button";
  button.innerHTML = "<svg viewBox='0 0 24 24' width='22' height='22' aria-hidden='true' focusable='false'><path fill='#ffffff' d='M21 12c0 4.418-4.03 8-9 8-1.14 0-2.23-.18-3.24-.5L3 21l1.6-4.4C3.6 15.4 3 13.77 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'/></svg>";
  button.setAttribute("aria-label", "Open feedback widget");

  var panel = document.createElement("div");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", "Feedback widget");

  var header = document.createElement("div");
  header.className = "feedora-widget-header";
  var title = document.createElement("strong");
  title.textContent = "Feedora Widget";
  var closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "feedora-widget-close";
  closeBtn.textContent = "Close";
  closeBtn.setAttribute("aria-label", "Close feedback widget");

  header.appendChild(title);
  header.appendChild(closeBtn);

  var body = document.createElement("div");
  body.innerHTML =
    "<p class='feedora-widget-subtitle'>Widget connected</p>" +
    "<p class='feedora-widget-meta'>" +
    "Project ID: " + (projectId || "not set") + "<br/>" +
    "API URL: " + (apiUrl || "not set") +
    "</p>" +
    "<form data-widget-form class='feedora-widget-form'>" +
    "<input required name='name' placeholder='Your name' />" +
    "<input required type='email' name='email' placeholder='you@example.com' />" +
    "<select name='rating'>" +
    "<option value='5'>5 - Excellent</option>" +
    "<option value='4' selected>4 - Good</option>" +
    "<option value='3'>3 - Okay</option>" +
    "<option value='2'>2 - Poor</option>" +
    "<option value='1'>1 - Bad</option>" +
    "</select>" +
    "<textarea required name='feedback' rows='3' placeholder='Share your feedback'></textarea>" +
    "<button type='submit'>Send feedback</button>" +
    "<p data-status class='feedora-widget-status'></p>" +
    "</form>";

  panel.appendChild(header);
  panel.appendChild(body);

  var styles = document.createElement("style");
  styles.textContent =
    "#feedora-widget-root { position: fixed; bottom: 24px; right: 24px; z-index: 2147483647; }" +
    "#feedora-widget-root button { cursor: pointer; }" +
    "#feedora-widget-root > button {" +
    "background: #2563eb; color: #fff; border: none; border-radius: 999px;" +
    "padding: 12px; width: 48px; height: 48px; box-shadow: 0 12px 24px rgba(37,99,235,0.25);" +
    "display: inline-flex; align-items: center; justify-content: center;" +
    "}" +
    "#feedora-widget-root > button img { width: 22px; height: 22px; filter: brightness(0) invert(1); }" +
    "#feedora-widget-panel {" +
    "position: fixed; bottom: 76px; right: 24px; width: 340px; max-width: calc(100vw - 48px);" +
    "background: #ffffff; color: #0f172a; border-radius: 18px; padding: 18px;" +
    "box-shadow: 0 22px 60px rgba(15,23,42,0.25); border: 1px solid #e5e7eb; display: none;" +
    "font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;" +
    "}" +
    ".feedora-widget-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }" +
    ".feedora-widget-close { background: #f1f5f9; border: none; color: #334155; font-size: 12px; padding: 4px 8px; border-radius: 999px; }" +
    ".feedora-widget-subtitle { margin: 0 0 6px; font-weight: 600; }" +
    ".feedora-widget-meta { margin: 0 0 14px; color: #64748b; font-size: 12px; }" +
    ".feedora-widget-form { display: grid; gap: 10px; }" +
    ".feedora-widget-form input, .feedora-widget-form select, .feedora-widget-form textarea {" +
    "padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px;" +
    "outline: none; }" +
    ".feedora-widget-form input:focus, .feedora-widget-form select:focus, .feedora-widget-form textarea:focus {" +
    "border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(147,197,253,0.35); }" +
    ".feedora-widget-form textarea { resize: vertical; min-height: 88px; }" +
    ".feedora-widget-form button {" +
    "background: #2563eb; color: #fff; border: none; border-radius: 999px; padding: 10px 14px; font-size: 14px; }" +
    ".feedora-widget-status { margin: 0; font-size: 12px; color: #64748b; }";

  panel.id = "feedora-widget-panel";
  root.appendChild(button);
  document.head.appendChild(styles);
  document.body.appendChild(panel);

  var form = body.querySelector("[data-widget-form]");
  var status = body.querySelector("[data-status]");

  var setStatus = function (message) {
    if (status) {
      status.textContent = message;
    }
  };

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!projectId) {
        setStatus("Missing project id.");
        return;
      }

      var formData = new FormData(form);
      var payload = {
        projectId: Number(projectId),
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        rating: Number(formData.get("rating") || 4),
        feedback: String(formData.get("feedback") || ""),
      };

      setStatus("Sending...");

      fetch(endpoint, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Request failed");
          }
          return response.json();
        })
        .then(function () {
          setStatus("Thanks for your feedback!");
          form.reset();
        })
        .catch(function () {
          setStatus("Failed to send feedback.");
        });
    });
  }

  var togglePanel = function (isOpen) {
    panel.style.display = isOpen ? "block" : "none";
  };

  button.addEventListener("click", function () {
    togglePanel(true);
  });
  closeBtn.addEventListener("click", function () {
    togglePanel(false);
  });
})();`;

export async function GET() {
  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}
