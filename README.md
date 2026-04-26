# Feedora

Feedora is a feedback collection app for product teams and small businesses. It gives you a simple embed widget, a dashboard to manage responses, and a docs page with examples for showing feedback on your own site.

## What it does

- Embed a feedback button on any website
- Collect ratings, messages, names, emails, and categories
- Manage projects from the dashboard
- View and delete feedback in one place
- Open full feedback details in the inbox
- Customize the widget button color theme
- Show feedback in a scrolling marquee view
- Copy ready-to-use embed snippets from the docs page
- Sign in securely with NextAuth
- Switch between light and dark theme

## Main pages

- `/dashboard` - overview
- `/dashboard/projects` - create, edit, and delete projects
- `/dashboard/feedback` - feedback inbox
- `/dashboard/docs` - embed instructions and marquee example

## Widget embed

Use this script on your site:

```html
<script
  id="feedora-widget-script"
  src="https://your-domain.com/widget/widget.js"
  data-project-id="1"
  data-api-url="https://your-domain.com"
  data-theme-class="white"
  defer
></script>
```

`data-theme-class` supports:

- `blue`
- `emerald`
- `rose`
- `amber`
- `slate`
- `white`

## Marquee example

Use the docs page if you want to show feedback cards in a scrolling row on your site. The app includes a reusable `Marquee` component and a public feedback endpoint for that.

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- NextAuth
- Radix UI

