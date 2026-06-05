# Kabe Website Builder Skill

## Purpose

Use this skill when building an internal Knowledge Base website with a modern editorial UI, CMS-driven article publishing, search, category navigation, and Docker-based deployment.

The website may take visual inspiration from premium editorial websites and awwwards-style interfaces, but must avoid copying copyrighted designs, layouts, assets, text, logos, animations, or distinctive visual identity.

## Core Goal

Build a production-ready internal Knowledge Base platform with:

* Public/internal KB frontend
* Easy CMS for posting and editing articles
* Docker Compose deployment
* Searchable articles
* Category and tag organization
* Modern UI inspired by high-end editorial sites
* Original visual design
* Clear documentation
* Safe configuration using environment variables

## Recommended Stack

Default stack:

* Frontend: Next.js App Router
* Styling: Tailwind CSS
* UI Components: shadcn/ui or simple custom components
* CMS: Directus
* Database: PostgreSQL
* Search: Meilisearch
* Runtime: Docker Compose
* Reverse proxy: Caddy or Nginx
* Content format: Markdown or rich text from CMS
* Authentication:

  * CMS admin login via Directus
  * Frontend can be internal-only via reverse proxy, VPN, or basic auth if requested

Do not introduce a more complex stack unless the user explicitly asks.

## Design Direction

Create an original design with the following direction:

* Premium internal knowledge hub
* Editorial layout
* Large typography
* Clean grid
* Modern cards
* Smooth hover states
* Soft gradients or subtle noise background
* High contrast readable article pages
* Minimal but polished animation
* Responsive desktop/tablet/mobile layout

Allowed inspiration:

* General quality level of awwwards-style websites
* Editorial hierarchy
* Creative spacing
* Bold typography
* Smooth transitions
* Interactive cards

Strictly forbidden:

* Do not clone awwwards.com
* Do not copy exact layout
* Do not copy color palette exactly
* Do not copy assets, icons, logo, screenshots, text, or animations
* Do not use trademarked branding
* Do not scrape content
* Do not pretend the design is from awwwards
* Do not include copyrighted images

Use original names, original layout, and original design tokens.

## Required Features

### Frontend

Build these pages:

1. Home page

   * Hero section
   * Search bar
   * Featured articles
   * Category cards
   * Recently updated articles
   * Popular articles placeholder if analytics is not implemented

2. Article listing page

   * Filter by category
   * Filter by tag
   * Search keyword
   * Sort by latest or updated

3. Article detail page

   * Title
   * Description
   * Category
   * Tags
   * Author
   * Last updated date
   * Reading time
   * Table of contents
   * Markdown/rich text rendering
   * Related articles
   * Copy link button

4. Category page

   * Category overview
   * Articles under category

5. Search page

   * Search input
   * Result list
   * Empty state

6. About or internal help page

   * Explain how to use the KB

### CMS

Use Directus collections:

1. articles

   * id
   * status
   * title
   * slug
   * summary
   * content
   * category
   * tags
   * author
   * featured_image
   * is_featured
   * published_at
   * updated_at

2. categories

   * id
   * name
   * slug
   * description
   * icon
   * sort

3. tags

   * id
   * name
   * slug

4. authors

   * id
   * name
   * role
   * avatar

If Directus schema automation is not implemented, provide a clear setup guide for creating these collections manually.

### Docker

Provide Docker Compose that runs:

* web
* directus
* postgres
* meilisearch
* optional reverse proxy

Use `.env.example`.

Never hardcode secrets.

### Search

Default implementation:

* Basic search using Directus API first.
* If Meilisearch is implemented, sync articles into Meilisearch.
* If sync is too complex, create a clear TODO and keep Directus search working.

### Content Safety

For internal KB content:

* Do not expose secrets
* Do not expose credentials
* Do not put API keys in frontend code
* Use environment variables
* Provide `.gitignore`
* Provide `.env.example`

## Development Rules

Follow these rules before coding:

1. Think before coding

   * Explain assumptions
   * Identify unclear points
   * Ask questions only if blocking

2. Simplicity first

   * Keep the implementation simple
   * Avoid unnecessary abstractions
   * Avoid complex animation libraries unless requested

3. Surgical changes

   * Do not edit unrelated files
   * Every file change must have a clear purpose

4. Goal-oriented execution

   * Convert ambiguous requests into verifiable goals
   * Define what “done” means before coding

## Expected Project Structure

Preferred structure:

```text
kabe/
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── lib/
│       ├── styles/
│       └── package.json
├── docker/
│   └── caddy/
│       └── Caddyfile
├── docs/
│   ├── CMS_SETUP.md
│   ├── DEPLOYMENT.md
│   └── CONTENT_GUIDE.md
├── docker-compose.yml
├── .env.example
├── README.md
└── CLAUDE.md
```

If the user asks for simpler structure, use a simpler structure.

## Acceptance Criteria

The project is considered complete when:

* `docker compose up -d` starts all required services
* CMS is accessible
* Web KB is accessible
* Articles can be created from CMS
* Frontend can display CMS articles
* Category and article detail pages work
* Search works at least with Directus API
* README explains setup clearly
* No secrets are hardcoded
* Design is original and not a clone
* The UI is responsive
* Basic error and loading states exist

## Response Style

Answer in Indonesian casual technical style.

When working in Claude Code:

* Start with a short plan
* Then inspect files
* Then implement
* Then provide run commands
* Then provide verification steps

Use this output format after implementation:

```text
Summary:
Files changed:
How to run:
How to verify:
Notes/Risks:
```

## Default User Preference

The user wants practical, production-oriented output, not only a demo.

Prioritize:

* Working Docker setup
* Easy CMS article publishing
* Clean UI
* Maintainable code
* Minimal operational complexity
