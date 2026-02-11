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
  title.textContent = "Share your feedback";
  var closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "feedora-widget-close";
  closeBtn.textContent = "x";
  closeBtn.setAttribute("aria-label", "Close feedback widget");

  header.appendChild(title);
  header.appendChild(closeBtn);

  var body = document.createElement("div");
  body.innerHTML =
    "<form data-widget-form class='feedora-widget-form'>" +
    "<div class='feedora-widget-field'>" +
    "<span class='feedora-widget-label'>How would you rate your experience?</span>" +
    "<div class='feedora-widget-stars' role='radiogroup' aria-label='Rating'>" +
    "<input class='feedora-widget-star-input' type='radio' id='feedora-star-5' name='rating' value='5'/>" +
    "<label class='feedora-widget-star' for='feedora-star-5' aria-label='5 stars'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M12 2.5l2.95 5.98 6.6.96-4.78 4.65 1.13 6.57L12 17.9l-5.9 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z'/></svg></label>" +
    "<input class='feedora-widget-star-input' type='radio' id='feedora-star-4' name='rating' value='4'/>" +
    "<label class='feedora-widget-star' for='feedora-star-4' aria-label='4 stars'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M12 2.5l2.95 5.98 6.6.96-4.78 4.65 1.13 6.57L12 17.9l-5.9 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z'/></svg></label>" +
    "<input class='feedora-widget-star-input' type='radio' id='feedora-star-3' name='rating' value='3'/>" +
    "<label class='feedora-widget-star' for='feedora-star-3' aria-label='3 stars'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M12 2.5l2.95 5.98 6.6.96-4.78 4.65 1.13 6.57L12 17.9l-5.9 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z'/></svg></label>" +
    "<input class='feedora-widget-star-input' type='radio' id='feedora-star-2' name='rating' value='2'/>" +
    "<label class='feedora-widget-star' for='feedora-star-2' aria-label='2 stars'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M12 2.5l2.95 5.98 6.6.96-4.78 4.65 1.13 6.57L12 17.9l-5.9 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z'/></svg></label>" +
    "<input class='feedora-widget-star-input' type='radio' id='feedora-star-1' name='rating' value='1'/>" +
    "<label class='feedora-widget-star' for='feedora-star-1' aria-label='1 star'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M12 2.5l2.95 5.98 6.6.96-4.78 4.65 1.13 6.57L12 17.9l-5.9 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z'/></svg></label>" +
    "</div>" +
    "</div>" +
    "<div class='feedora-widget-field'>" +
    "<label class='feedora-widget-label' for='feedora-feedback'>Feedback</label>" +
    "<textarea required id='feedora-feedback' name='feedback' rows='4' placeholder='Tell us what you think...'></textarea>" +
    "</div>" +
    "<div class='feedora-widget-field'>" +
    "<label class='feedora-widget-label' for='feedora-category'>Category</label>" +
    "<select id='feedora-category' name='category'>" +
    "<option value='' selected>Select a category...</option>" +
    "<option value='general'>General</option>" +
    "<option value='bug'>Bug</option>" +
    "<option value='feature'>Feature request</option>" +
    "<option value='ui'>UI/UX</option>" +
    "</select>" +
    "</div>" +
    "<div class='feedora-widget-field'>" +
    "<label class='feedora-widget-label' for='feedora-name'>Name</label>" +
    "<input required id='feedora-name' name='name' placeholder='e.g., Jane Doe' />" +
    "</div>" +
    "<div class='feedora-widget-field'>" +
    "<label class='feedora-widget-label' for='feedora-email'>Email (Optional)</label>" +
    "<input id='feedora-email' type='email' name='email' placeholder='you@example.com' />" +
    "</div>" +
    "<button type='submit'>Send Feedback</button>" +
    "<p data-status class='feedora-widget-status'></p>" +
    "</form>";

  panel.appendChild(header);
  panel.appendChild(body);

  var styles = document.createElement("style");
  styles.id = "feedora-widget-styles";
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
    "position: fixed; bottom: 76px; right: 24px; width: 360px; max-width: calc(100vw - 48px);" +
    "background: #ffffff; color: #0f172a; border-radius: 20px; padding: 20px;" +
    "box-shadow: 0 24px 60px rgba(15,23,42,0.22); border: 1px solid #e2e8f0; display: none;" +
    "font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;" +
    "}" +
    ".feedora-widget-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }" +
    ".feedora-widget-header strong { font-size: 18px; }" +
    ".feedora-widget-close {" +
    "background: #f1f5f9; border: none; color: #334155; font-size: 14px; width: 28px; height: 28px;" +
    "border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; }" +
    ".feedora-widget-form { display: grid; gap: 12px; }" +
    ".feedora-widget-field { display: grid; gap: 6px; }" +
    ".feedora-widget-label { font-size: 13px; font-weight: 600; color: #334155; }" +
    ".feedora-widget-form input, .feedora-widget-form select, .feedora-widget-form textarea {" +
    "padding: 11px 12px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px;" +
    "outline: none; background: #ffffff; }" +
    ".feedora-widget-form input:focus, .feedora-widget-form select:focus, .feedora-widget-form textarea:focus {" +
    "border-color: #94a3b8; box-shadow: 0 0 0 3px rgba(148,163,184,0.25); }" +
    ".feedora-widget-form textarea { resize: vertical; min-height: 100px; }" +
    ".feedora-widget-stars { display: flex; flex-direction: row-reverse; justify-content: flex-end; gap: 6px; }" +
    ".feedora-widget-star-input { position: absolute; opacity: 0; pointer-events: none; }" +
    ".feedora-widget-star svg { width: 22px; height: 22px; fill: #e2e8f0; transition: fill 0.15s ease; }" +
    ".feedora-widget-star:hover svg, .feedora-widget-star:hover ~ .feedora-widget-star svg { fill: #f59e0b; }" +
    ".feedora-widget-star-input:checked ~ .feedora-widget-star svg { fill: #f59e0b; }" +
    ".feedora-widget-star-input:focus-visible + .feedora-widget-star { outline: 2px solid #94a3b8; border-radius: 6px; }" +
    ".feedora-widget-form button {" +
    "background: #2563eb; color: #fff; border: none; border-radius: 12px; padding: 12px 14px; font-size: 14px; font-weight: 600; }" +
    ".feedora-widget-status { margin: 0; font-size: 12px; color: #64748b; }";

  panel.id = "feedora-widget-panel";
  root.appendChild(button);
  document.head.appendChild(styles);
  document.body.appendChild(panel);

  var form = body.querySelector("[data-widget-form]");
  var status = body.querySelector("[data-status]");
  var emailInput = body.querySelector("input[name='email']");
  var defaultEmail = "";

  if (scriptEl) {
    var scriptEmail = scriptEl.getAttribute("data-email");
    if (scriptEmail) {
      defaultEmail = scriptEmail;
    }
  }

  var resetDefaults = function () {
    if (emailInput) {
      emailInput.value = defaultEmail || "";
    }
    if (form) {
      var ratingInputs = form.querySelectorAll("input[name='rating']");
      ratingInputs.forEach(function (input) {
        input.checked = false;
      });
    }
  };

  var setStatus = function (message) {
    if (status) {
      status.textContent = message;
    }
  };

  if (form) {
    resetDefaults();
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!projectId) {
        setStatus("Missing project id.");
        return;
      }

      var formData = new FormData(form);
      var ratingValue = formData.get("rating");
      var ratingNumber = ratingValue ? Number(ratingValue) : 0;
      var nameValue = String(formData.get("name") || "").trim();
      var feedbackValue = String(formData.get("feedback") || "").trim();
      var emailValue = String(formData.get("email") || "").trim();

      if (!nameValue || !feedbackValue) {
        setStatus("Name and feedback are required.");
        return;
      }

      if (!ratingNumber) {
        setStatus("Please select a star rating.");
        return;
      }

      var payload = {
        projectId: Number(projectId),
        name: nameValue,
        email: emailValue || undefined,
        rating: ratingNumber,
        feedback: feedbackValue,
      };

      setStatus("Sending...");

      fetch(endpoint, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().then(function (data) {
              throw new Error(data.error || "Request failed");
            }).catch(function () {
              throw new Error("Request failed");
            });
          }
          return response.json();
        })
        .then(function () {
          setStatus("Thanks for your feedback!");
          form.reset();
          defaultEmail = scriptEl ? scriptEl.getAttribute("data-email") || "" : "";
          resetDefaults();
          togglePanel(false);
        })
        .catch(function (error) {
          setStatus(error.message || "Failed to send feedback.");
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
