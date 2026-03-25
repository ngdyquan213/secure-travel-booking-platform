# Retrofit Ready Prompts for TravelBook

Use this file when your TravelBook UI already exists and you only want to extend it without breaking consistency.

All prompts below are written for direct copy-paste into Stitch.

## How To Use

1. Copy one full prompt block from this file.
2. Paste it directly into Stitch.
3. If you have approved screenshots, attach them to the same Stitch message.
4. Only replace text wrapped in `ALL CAPS` when a prompt explicitly tells you to.

## What This File Solves

This file is the easy version of [STITCH_PROMPT_PACK.md](/Users/quan.nguyen/individual/newwwwwwwww/secure-travel-booking-platform/STITCH_PROMPT_PACK.md).

It is meant for these cases:
- your UI system already exists
- you need to add missing pages
- you need to lock an existing shell
- you need to add reusable frontend component families
- you need to stop Stitch from drifting away from the current design

## Baseline Continuity Snapshot From Current Frontend

This baseline is derived from the current TravelBook frontend codebase.

```text
[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy
```

## Ready Prompt 01 - Create An Updated Continuity Snapshot

Use this first if your approved screens are already more complete than the current baseline above.

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

Your task is not to redesign the product direction.
Your task is to summarize and lock the existing system without changing it.

If approved screens conflict with the baseline below, the approved screens win.

[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy

Task:
Create an updated continuity snapshot from the already approved TravelBook screens.

Rules:
- do not redesign anything
- do not suggest a new style direction
- only summarize the system that already exists
- keep each line short and concrete

Output only this format:

[LATEST CONTINUITY NOTES]
- Locked shell:
- Locked component patterns:
- Locked CTA treatment:
- Locked form patterns:
- Locked table/list patterns:
- Locked card variants:
- Approved new variants:
- Copy tone reminders:
- Mobile behavior reminders:
- Do not change:
```

## Ready Prompt 02 - Lock Existing Public Shell

Use this when public pages already exist, but you want Stitch to stop drifting while adding more public pages.

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

Your task is to lock the existing public shell without redesigning it.

Preserve exactly:
- the current public header behavior
- the current public footer behavior
- the current section spacing rhythm
- the current hero and content transition style
- the current CTA hierarchy
- the current card families
- the current mobile navigation behavior

If approved screens conflict with the baseline below, the approved screens win.
Only add clarity. Do not restyle what already exists.

[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy

Task:
Design one shell-reference page only for the existing public-facing TravelBook experience.

This is not a content-heavy page.
It is a shell alignment page that locks:
- public top navigation behavior
- public footer structure
- container widths and section spacing
- hero-to-content transitions
- list-page scaffold and detail-page scaffold
- CTA placement rules
- mobile navigation behavior

Requirements:
- make this feel like a real reusable public shell, not a generic wireframe
- define how Home, Tours Catalog, Tour Detail, Destinations, Promotions, and Help should all feel related
- keep the existing public shell trust-first, spacious, and easy to scan

At the end output:
1. public shell rules
2. reusable public components
3. spacing and hierarchy rules
4. continuity notes for later public pages
```

## Ready Prompt 03 - Lock Existing Auth Shell

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

Your task is to lock the existing auth shell without redesigning it.

Preserve exactly:
- the current auth background treatment
- the current logo and identity placement
- the current centered auth card behavior
- the current button and input styles
- the current validation and helper text tone

If approved screens conflict with the baseline below, the approved screens win.
Only add clarity. Do not restyle what already exists.

[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy

Task:
Design one shell-reference page only for the existing authentication area of TravelBook.

This shell must lock:
- the auth background treatment
- logo and identity placement
- centered auth container rules
- form card size and spacing
- validation and help text zones
- support microcopy zone
- mobile behavior

Requirements:
- the shell should feel focused, calm, secure, and lightweight
- it must support Login, Register, Forgot Password, and Reset Password without visual drift
- it should preserve continuity with the public shell while reducing distraction

At the end output:
1. auth shell rules
2. reusable auth components
3. form and validation rules
4. continuity notes for later auth pages
```

## Ready Prompt 04 - Lock Existing Checkout Shell

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

Your task is to lock the existing checkout shell without redesigning it.

Preserve exactly:
- the current checkout header relationship
- the current stepper logic and visual style
- the current content and summary layout
- the current payment reassurance tone
- the current CTA hierarchy in transactional screens

If approved screens conflict with the baseline below, the approved screens win.
Only add clarity. Do not restyle what already exists.

[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy

Task:
Design one shell-reference page only for the existing checkout flow in TravelBook.

This shell must lock:
- checkout header behavior
- progress stepper treatment
- content and summary panel relationship
- sticky summary rules
- payment reassurance placement
- mobile stacking logic

Requirements:
- the shell should support Checkout Review, Payment, Payment Success, and Payment Failed
- it must feel transactional, trusted, and low-friction
- the shell should make progression obvious without adding stress

At the end output:
1. checkout shell rules
2. reusable checkout components
3. summary and CTA hierarchy rules
4. continuity notes for later checkout pages
```

## Ready Prompt 05 - Lock Existing Account Shell

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

Your task is to lock the existing account shell without redesigning it.

Preserve exactly:
- the current account header and footer relationship
- the current left sidebar navigation behavior
- the current content width and page rhythm
- the current dashboard and detail-page scaffold
- the current mobile simplification pattern

If approved screens conflict with the baseline below, the approved screens win.
Only add clarity. Do not restyle what already exists.

[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy

Task:
Design one shell-reference page only for the existing signed-in traveler account area in TravelBook.

This shell must lock:
- top navigation and footer relationship
- sidebar navigation structure
- content width and panel rhythm
- dashboard card zones
- detail-page scaffold
- mobile navigation collapse behavior

Requirements:
- the shell should support Dashboard, Profile, Travelers, Bookings, Vouchers, Documents, Refunds, Notifications, and Support
- it must feel trusted, practical, and easy to operate over time
- it should carry continuity from checkout while becoming more utility-focused

At the end output:
1. account shell rules
2. reusable account components
3. list, detail, and form-page scaffold rules
4. continuity notes for later account pages
```

## Ready Prompt 06 - Lock Existing Admin Shell

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

Your task is to lock the existing admin shell without redesigning it.

Preserve exactly:
- the current admin sidebar behavior
- the current top utility/header zone
- the current page header pattern
- the current dense table workspace rules
- the current operator detail-page scaffold
- the current queue visibility logic

If approved screens conflict with the baseline below, the approved screens win.
Only add clarity. Do not restyle what already exists.

[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy

Task:
Design one shell-reference page only for the existing admin area of TravelBook.

This shell must lock:
- left sidebar behavior
- top utility/header zone
- page header pattern
- dense table workspace rules
- operator detail-page scaffold
- status and queue visibility rules
- mobile and smaller-laptop fallback behavior

Requirements:
- the shell should support Dashboard, Tours, Schedules, Pricing, Bookings, Refunds, Documents, and Operations
- it must feel operationally dense but still clearly part of the same TravelBook product
- it should be efficient, trustworthy, and readable under heavy data load

At the end output:
1. admin shell rules
2. reusable admin components
3. table and action-density rules
4. continuity notes for later admin pages
```

## Ready Prompt 07 - Add The Missing Document Detail Placeholder Page

This is the easiest real example of a missing page added on top of the existing frontend.

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

Your task is not to redesign the product direction.
Your task is to extend the existing system without changing it.

Preserve exactly:
- the current account shell structure
- the current sidebar navigation
- the current card families
- the current button hierarchy
- the current typography scale
- the current spacing rhythm
- the current color usage
- the current form patterns
- the current status badge logic

If approved screens conflict with the baseline below, the approved screens win.
Only add what is missing.
Do not restyle what already exists.

[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy

Task:
Design one page only: the document detail placeholder page inside the account area.

Context:
- the current product does not fully expose item-specific document detail routing yet
- this page exists to avoid a dead-end and guide users back to the centralized document center

Goal:
- explain clearly why detail actions remain centralized
- help users return to the document center confidently

Required sections:
- account shell
- page header
- calm informational message explaining the current limitation
- lightweight explanation card describing why centralized document handling is safer for now
- primary CTA back to the document center
- optional secondary CTA to support if the user needs help

Rules:
- do not make this feel like an error page
- it should feel like a purposeful placeholder inside the account system
- reuse existing account card, alert, and CTA logic

At the end include:
1. layout hierarchy
2. reused components
3. approved new variants
4. key interaction rules
5. continuity notes for the Refunds page
```

## Ready Prompt 08 - Add Any Missing Route Page

Replace only the parts in `ALL CAPS`.

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

Your task is not to redesign the product direction.
Your task is to extend the existing system without changing it.

Preserve exactly:
- the current PRODUCT_AREA shell structure
- the current card families
- the current button hierarchy
- the current typography scale
- the current spacing rhythm
- the current color usage
- the current form patterns
- the current status badge logic

If approved screens conflict with the baseline below, the approved screens win.
Only add what is missing.
Do not restyle what already exists.

[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy

Task:
Design one page only: PAGE_NAME.

Area:
- PRODUCT_AREA

Previous page:
- PREVIOUS_PAGE

Next page:
- NEXT_PAGE

Goal:
- PRIMARY_USER_GOAL
- SECONDARY_USER_GOAL

Required sections:
- SECTION_1
- SECTION_2
- SECTION_3
- SECTION_4
- SECTION_5

Required states:
- DEFAULT
- LOADING
- EMPTY_OR_UNAVAILABLE
- ERROR

Rules:
- preserve the existing PRODUCT_AREA shell and page rhythm
- reuse existing component families before creating anything new
- keep this page visually consistent with already approved screens
- if a new component is unavoidable, explicitly explain which existing component family it extends

At the end include:
1. layout hierarchy
2. reused components
3. approved new variants
4. key interaction rules
5. continuity notes for NEXT_PAGE
```

## Ready Prompt 09 - Add Any Missing Frontend Component Family

Replace only the parts in `ALL CAPS`.

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

Your task is not to redesign the product direction.
Your task is to extend the existing system without changing it.

Preserve exactly:
- the current shell structure
- the current component lineage
- the current button hierarchy
- the current typography scale
- the current spacing rhythm
- the current color usage
- the current status language

If approved screens conflict with the baseline below, the approved screens win.
Only add what is missing.
Do not restyle what already exists.

[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy

Task:
Design the reusable COMPONENT_FAMILY_NAME for TravelBook.

Cover:
- COMPONENT_1
- COMPONENT_2
- COMPONENT_3
- COMPONENT_4
- COMPONENT_5

Goals:
- PRIMARY_GOAL
- SECONDARY_GOAL

Requirements:
- define variants and states
- show desktop and mobile behavior when relevant
- preserve continuity with existing component families
- do not invent a disconnected visual language

At the end output:
1. component family
2. variants and states
3. spacing and hierarchy rules
4. continuity notes for related pages
```

## Ready Prompt 10 - Add The Full Navigation System Without Breaking Existing UI

Use this if header/footer/sidebar behavior still drifts across the app.

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

Your task is to standardize and extend the existing navigation system without redesigning the product direction.

Preserve exactly:
- the current brand identity
- the current blue-led action hierarchy
- the current header and footer visual tone
- the current account and admin navigation roles
- the current responsive behavior philosophy

If approved screens conflict with the baseline below, the approved screens win.
Only add structure and consistency. Do not restyle what already exists.

[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy

Task:
Design the complete global navigation system for TravelBook as one unified component family.

Cover:
- main header for public and authenticated users
- mobile navigation behavior
- account sidebar navigation
- admin sidebar navigation
- breadcrumbs
- footer

Goals:
- create one coherent navigation language across the whole product
- make public, account, and admin navigation feel related but purpose-fit
- keep orientation, access, and trust very clear

Requirements:
- define active, hover, focus, collapsed, and mobile-open states
- show how branding, user identity, and logout actions are handled
- keep the system responsive and low-friction

At the end output:
1. navigation component family
2. variants by product area
3. interaction states
4. continuity notes for related pages
```

## Ready Prompt 11 - Add Shared UI Primitives Without Breaking Existing UI

Use this if you want to standardize buttons, inputs, badges, alerts, cards, tabs, pagination, overlays, and common controls.

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

Your task is to standardize the shared UI primitive library without redesigning the product direction.

Preserve exactly:
- the current blue-led CTA hierarchy
- the current neutral surface language
- the current rounded form and card style
- the current trust-first tone
- the current accessible, low-stress interaction style

If approved screens conflict with the baseline below, the approved screens win.
Only add structure and consistency. Do not restyle what already exists.

[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy

Task:
Design the shared UI primitive library for TravelBook.

Cover:
- button
- input
- textarea
- select
- checkbox
- radio
- toggle
- badge
- alert
- card
- tabs
- pagination
- modal
- drawer
- confirm dialog
- tooltip
- spinner
- skeleton
- empty state

Goals:
- create one reusable, calm, trustworthy, and scalable UI foundation
- make all product areas feel consistent without flattening their purpose

Requirements:
- define sizes, states, validation, disabled, loading, success, warning, and destructive patterns
- show desktop and mobile behavior when relevant
- preserve existing hierarchy and component lineage

At the end output:
1. primitive component family
2. variants and states
3. spacing and semantic rules
4. continuity notes for all future pages
```

## Ready Prompt 12 - Repair Drift

Use this when a newly generated screen starts looking different from your approved screens.

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

The last generated result drifted away from the approved TravelBook system.

Your task is to restore continuity, not to create a new direction.

Preserve exactly:
- the current shell structure
- the current card families
- the current button hierarchy
- the current typography scale
- the current spacing rhythm
- the current color usage
- the current form patterns
- the current status badge logic

If approved screens conflict with the baseline below, the approved screens win.
Do not introduce any new component family.
Do not change the visual direction.
Do not optimize for novelty.

[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy

Task:
Redesign the last generated screen while strictly restoring continuity with the approved TravelBook system.

Restore and preserve:
- the same shell structure
- the same button hierarchy
- the same spacing rhythm
- the same radius and shadow system
- the same card families
- the same form patterns
- the same status badge treatment
- the same tone and trust level

At the end, explain exactly which elements were brought back into alignment.
```

## Ready Prompt 13 - Approve Or Reject A New Component Before Stitch Invents It

Use this before asking Stitch for something that might create a new component family.

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

Your task is to protect the existing component system from unnecessary drift.

If approved screens conflict with the baseline below, the approved screens win.

[BASELINE CONTINUITY SNAPSHOT]
- Locked shell: public and checkout areas use a sticky top header with a clean white bar and a dark footer; auth uses a centered card on a soft blue gradient; account uses header + footer + left sidebar + main content area; admin uses a dedicated left sidebar with a top header and operational content workspace
- Locked component patterns: white rounded cards, subtle borders, light shadows, page headers with an eyebrow label and bold title, simple stats cards, informational cards, clean list rows, quiet status badges
- Locked CTA treatment: primary action is a solid blue button, secondary action is a light neutral or outline-style button, low-emphasis action is text or ghost, destructive action is reserved red
- Locked form patterns: labels above inputs, clear helper text, quiet validation, consistent spacing, low-stress field grouping
- Locked table/list patterns: public discovery prefers cards and grids, account prefers cards or clean rows, admin prefers denser queue tables and review tables
- Locked card variants: marketing card, stats card, summary card, detail card, informational card, admin queue card, dark payment summary card
- Approved new variants: schedule selection card, payment summary dark panel, queue/review table variant
- Copy tone reminders: calm, direct, trustworthy, concise, operational when needed
- Mobile behavior reminders: top navigation collapses cleanly, cards stack vertically, sidebars collapse or simplify, primary CTA remains visible and easy to tap
- Do not change: blue-led palette, Inter typography, rounded surfaces, subtle border/shadow language, trust-first tone, consistent CTA hierarchy

Task:
Before creating a new component, first verify whether the need can be solved by:
- reusing an existing component
- extending an existing component with a variant
- combining existing components differently

Only create a new component if all three options fail.

If a new component is still required, describe:
1. why existing components are insufficient
2. which existing family it inherits from
3. the exact rules that keep it visually consistent with the rest of TravelBook

Then design the page or module using that component sparingly.
```

## Best First Three Steps

If you want the safest sequence, do this:

1. Run `Ready Prompt 01` and get an updated continuity snapshot.
2. If needed, run one shell lock prompt from `02` to `06`.
3. Add missing pages with `Ready Prompt 07` or `Ready Prompt 08`.

