# Stitch Prompt Pack for TravelBook

These prompts are written in English on purpose because design-generation tools usually stay more stable and consistent with English prompts.

## How To Use

1. Run `Prompt 00` first to lock the visual system.
2. For every next page, always paste content in this order:
   - `Foundation Block`
   - `Latest Continuity Notes`
   - the page prompt you want to generate
3. After each generated page, save the output notes from Stitch and paste them into the next prompt under `Latest Continuity Notes`.
4. Never ask Stitch for "a fresher style", "more creative", or "different visual direction" in later prompts unless you intentionally want to break consistency.

## If You Already Built The System First

If you already generated the main UI system in Stitch before this prompt pack existed, that is still okay. Do not restart the whole project from scratch unless the current system is already broken or inconsistent.

Use this retrofit workflow instead:

1. Treat your current generated design as the real baseline.
2. Do not re-run all page prompts from the beginning.
3. Only use the new prompts for:
   - missing pages
   - missing shells
   - continuity repair
   - future pages not generated yet
4. When using any new prompt, explicitly tell Stitch to preserve the current existing design system instead of redefining it.
5. If possible, attach screenshots or paste summaries of the pages you already approved.

### Retrofit Rule

When you already have approved pages, prepend this block before any new prompt:

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.

Your task is not to redesign the product direction.
Your task is to extend the existing system without changing it.

Preserve exactly:
- the current shell structure
- the current card families
- the current button hierarchy
- the current typography scale
- the current spacing rhythm
- the current color usage
- the current form patterns
- the current status badge logic

If anything in this prompt conflicts with the already approved screens, follow the approved screens.
Only add what is missing.
Do not restyle what already exists.
```

### What To Do With The Added Prompts

- `Prompt 00A` to `Prompt 00E`:
  Do not use them to redesign from zero if your shells already look correct.
  Use them only if:
  - you have not designed that shell yet
  - that shell is inconsistent and needs repair
  - you want Stitch to summarize and lock an existing shell before adding more pages

- `Prompt 23A`:
  Safe to add later because it is a missing placeholder-style page and should inherit the existing account system.

- `Prompt 40`:
  Use this when Stitch starts drifting away from your already approved screens.

- `Prompt 41`:
  Use this before allowing Stitch to invent a new component that was not in your original system.

### Best Practice For Existing Projects

For an already-started project, the safest generation order is:

```text
1. Create one continuity snapshot from your currently approved screens
2. Add [RETROFIT MODE]
3. Paste Foundation Block
4. Paste your current continuity snapshot
5. Paste only the new page prompt you need
6. If Stitch drifts, run Prompt 40 before continuing
```

### Example For Existing Projects

```text
[RETROFIT MODE]
The TravelBook design system already exists and has already been established in previous approved screens.
Your task is to extend the existing system without changing it.
Preserve exactly:
- the current shell structure
- the current card families
- the current button hierarchy
- the current typography scale
- the current spacing rhythm
- the current color usage
- the current form patterns
- the current status badge logic
If anything in this prompt conflicts with the already approved screens, follow the approved screens.
Only add what is missing.
Do not restyle what already exists.

[FOUNDATION BLOCK]
...paste Foundation Block...

[LATEST CONTINUITY NOTES]
...paste notes from your already approved pages...

[PAGE PROMPT]
...paste Prompt 23A or any other missing page...
```

## Foundation Block

Copy this block into every prompt after `Prompt 00`.

```text
You are a senior product designer working inside one locked design system for a secure travel booking platform called TravelBook.

Your top priority is UI/UX consistency across all pages. Consistency is more important than novelty.

[PRODUCT]
- Product: TravelBook
- Domain: secure travel booking platform
- Core modules: public discovery, authentication, checkout, traveler account, admin operations
- Main outcomes: discover trips, compare offers, review schedules, complete secure checkout, manage bookings and documents, operate bookings and refunds

[BRAND]
- Personality: trustworthy, calm, efficient, modern, premium but not flashy
- Emotional goal: users should feel safe, informed, and in control
- Tone of voice: short, clear, reassuring, not salesy

[LOCKED VISUAL SYSTEM]
- Primary color family: blue scale centered around #3b82f6 and #2563eb
- Accent color family: green centered around #22c55e for success and confirmation
- Security/payment support accent: restrained cyan only where security or payment reassurance needs emphasis
- Neutrals: white, slate, gray surfaces
- Typography: Inter, clean hierarchy, sentence-case labels, readable body copy
- Spacing: strict 8px system
- Radius: 24 for large cards and major containers, 16 for cards and panels, 12 for form controls and buttons, full pill for badges
- Shadows: subtle and low-noise, avoid heavy floating cards
- Icon style: simple line icons, consistent stroke weight

[LOCKED LAYOUT RULES]
- Desktop layouts should feel stable, not crowded
- Public pages use a clean marketing shell with generous whitespace
- Auth pages use a focused shell with minimal distraction
- Checkout pages use a progress-oriented shell with a clear primary action and persistent summary
- Account pages use a trusted utility shell with strong navigation and clear status visibility
- Admin pages use a denser operational shell while still following the same visual language
- Mobile layouts must preserve hierarchy and CTA visibility without inventing a different UX pattern

[LOCKED UX RULES]
- Reuse existing patterns before creating new ones
- Primary CTA must always be visually strongest
- Secondary CTA must never compete with the primary CTA
- Similar actions must look and behave the same across pages
- Forms must reduce cognitive load and error risk
- Always support loading, empty, error, and success states when relevant
- Avoid decorative complexity that weakens trust

[LOCKED COMPONENT INVENTORY]
- Top navigation
- Footer
- Sidebar navigation
- Page header
- Hero / section hero
- Search bar
- Filter chips / filter panel
- Tour card
- Schedule card
- Booking summary card
- Price summary / payment summary
- Stats card
- Detail card
- Stepper / progress indicator
- Input, select, date picker, quantity control, file upload
- Tabs
- Badge / status badge
- Alert / inline validation
- Modal / drawer / confirm dialog
- Table
- Empty state
- Notification item
- Timeline / progress status

[CONTINUITY RULES]
- Do not change the color system
- Do not change the typography system
- Do not change the shell structure once it is established for a product area
- Do not invent a new card style if an existing card can be reused or extended
- Do not introduce a new CTA style unless it is explicitly a variant of the existing button system
- If a new component is absolutely required, explain what existing component family it extends
- This page must look like it was designed by the same team, in the same week, for the same product

[ACCESSIBILITY]
- Strong contrast
- Clear focus states
- Large tap targets on mobile
- Error states must be understandable without relying only on color
- Forms should feel calm and low-stress

[OUTPUT FORMAT]
At the end of every page design, include:
1. layout hierarchy
2. reused components
3. approved new variants
4. key interaction rules
5. continuity notes for the next page
```

## Latest Continuity Notes Template

Use this between the `Foundation Block` and every page prompt.

```text
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

This block is intentionally a template. You are supposed to fill it with a short summary of the pages you already approved.

### How To Fill `Latest Continuity Notes`

You do not need to write a long design spec. A short locked summary is enough.

Fill it from the screens you already approved:

- `Locked shell`:
  what overall page structure is already fixed
- `Locked component patterns`:
  what recurring UI patterns already exist
- `Locked CTA treatment`:
  what the main and secondary buttons look like
- `Locked form patterns`:
  how forms are laid out and validated
- `Locked table/list patterns`:
  how lists, rows, or tables currently behave
- `Locked card variants`:
  what card styles already exist
- `Approved new variants`:
  only list variants you explicitly decided to keep
- `Copy tone reminders`:
  what writing tone is already approved
- `Mobile behavior reminders`:
  what must remain true on mobile
- `Do not change`:
  the most important non-negotiable parts

### Example Of A Filled `Latest Continuity Notes`

```text
[LATEST CONTINUITY NOTES]
- Locked shell: account area uses top header + footer + left sidebar + content area on the right
- Locked component patterns: page header, white rounded information cards, subtle bordered sections, simple badges
- Locked CTA treatment: primary button is solid blue, secondary button is outline or text-only
- Locked form patterns: labels above fields, quiet validation, save action aligned at the end of the form
- Locked table/list patterns: bookings and documents are shown as stacked cards or clean rows, not dense data tables
- Locked card variants: stats card, detail card, informational card
- Approved new variants: schedule selection card
- Copy tone reminders: calm, direct, reassuring, low-drama
- Mobile behavior reminders: sidebar collapses, cards stack vertically, primary CTA stays visible
- Do not change: blue-led palette, Inter typography, rounded cards, trust-first tone
```

### Fastest Way To Create The First `Latest Continuity Notes`

If you already have approved screens and do not know how to summarize them, ask Stitch to create a continuity snapshot first.

Paste this before generating any missing page:

```text
Create a continuity snapshot from the already approved TravelBook screens.

Do not redesign anything.
Do not suggest a new style direction.
Only summarize the design system that already exists.

Based on the approved screens, output only this format:

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

Keep each line short and concrete.
If screenshots are provided, treat them as the source of truth.
If previous approved screen descriptions are provided, use them as the source of truth.
```

### Rule For First-Time Use

- If you are starting from zero: leave `Latest Continuity Notes` empty only once, right after `Prompt 00`.
- If you already have approved screens: do not leave it empty. First create a continuity snapshot, then use that snapshot for all later prompts.

## Prompt 00 - Foundation Reference Page

```text
Design a single foundation reference page for TravelBook that acts as the visual and UX source of truth for the entire product.

This is not a marketing page and not a dashboard. It is a design alignment page that shows:
- the core visual direction
- the main product shells for public, auth, checkout, account, and admin
- the main button hierarchy
- the main card families
- status badges and alerts
- primary form fields and date inputs
- search/filter patterns
- table and list patterns
- empty, loading, and success states

Requirements:
- keep the page highly structured and easy to scan
- make it look like a real internal design reference rather than a raw style guide
- show examples that can clearly be reused later
- lock the visual language for trust, booking clarity, and operational readability

At the end output:
1. the visual system summary
2. the shell summary for each area
3. the approved component families
4. the continuity notes that all later pages must inherit
```

## Optional Shell Locking Prompts

Use these right after `Prompt 00` if you want Stitch to lock the shell structure before moving into page-level design. These are optional, but strongly recommended when you care a lot about cross-page consistency.

### Prompt 00A - Public Layout Shell Reference

```text
Design one shell-reference page only for the public-facing TravelBook experience.

This is not a content-heavy page. It is a shell alignment page that locks:
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
- keep the public shell trust-first, spacious, and easy to scan

At the end output:
1. public shell rules
2. reusable public components
3. spacing and hierarchy rules
4. continuity notes for the Home page
```

### Prompt 00B - Auth Layout Shell Reference

```text
Design one shell-reference page only for the authentication area of TravelBook.

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
4. continuity notes for the Login page
```

### Prompt 00C - Checkout Layout Shell Reference

```text
Design one shell-reference page only for the checkout flow in TravelBook.

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
4. continuity notes for the Checkout Review page
```

### Prompt 00D - Account Layout Shell Reference

```text
Design one shell-reference page only for the signed-in traveler account area in TravelBook.

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
4. continuity notes for the Account Dashboard
```

### Prompt 00E - Admin Layout Shell Reference

```text
Design one shell-reference page only for the admin area of TravelBook.

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
4. continuity notes for the Admin Dashboard
```

## Public Flow

### Prompt 01 - Home Page

```text
Design one page only: the public home page for TravelBook.

Goal:
- communicate trust, breadth of travel services, and booking simplicity
- move users toward browsing tours and starting their travel planning

Required sections:
- public top navigation
- hero with strong promise, clear CTA, and a secondary exploration CTA
- trust/value proposition strip
- feature grid for tours, destinations, promotions, and help/support confidence
- simple "how it works" section
- social proof or traveler testimonials
- final CTA block
- public footer

Rules:
- this page establishes the public shell for later public pages
- visual style should feel secure, polished, and welcoming
- do not overuse gradients or flashy travel imagery
- keep CTA hierarchy extremely clear
- ensure mobile hero and CTA block remain clean and uncluttered

At the end include continuity notes for the Tours Catalog page.
```

### Prompt 02 - Tours Catalog

```text
Design one page only: the public tours catalog page.

Previous page: Home
Next page: Tour Detail

User goal:
- browse active tours quickly
- filter by destination and relevant trip characteristics
- compare options without feeling overwhelmed

Required sections:
- public top navigation
- page header with concise supporting copy
- destination search field
- lightweight filter and sort controls
- responsive results grid of tour cards
- small trust/support strip near the results or footer
- public footer

Required states:
- loading
- empty results
- error loading results

Rules:
- reuse the public shell, typography, buttons, and card language from Home
- tour cards must feel related to the same component family used elsewhere
- make comparison easy with destination, duration, status, starting price, and CTA
- do not create an enterprise-heavy search experience

At the end include continuity notes for the Tour Detail page.
```

### Prompt 03 - Tour Detail

```text
Design one page only: the public tour detail page.

Previous page: Tours Catalog
Next page: Tour Schedules

User goal:
- understand whether this tour is worth considering
- scan itinerary value, destination appeal, duration, and booking confidence

Required sections:
- public top navigation
- tour hero with destination context and trust cues
- summary block with duration, price from, availability, and high-priority CTA
- itinerary or experience overview
- key inclusions / exclusions
- supporting media or destination highlights
- FAQ or reassurance section
- persistent or clearly visible CTA to review schedules
- public footer

Required states:
- default
- loading
- unavailable / sold out
- error

Rules:
- keep this page visually richer than the catalog, but still within the same system
- do not invent a new CTA style
- preserve the same badge, card, and info-block logic from the catalog
- the CTA should move users into the schedule selection flow

At the end include continuity notes for the Tour Schedules page.
```

### Prompt 04 - Tour Schedules

```text
Design one page only: the public tour schedules page.

Previous page: Tour Detail
Next page: Login or Checkout Review, depending on auth state

User goal:
- compare available schedules and choose one with confidence

Required sections:
- public top navigation
- compact tour summary header
- schedule list or schedule cards
- useful metadata for each schedule: dates, availability, pricing context, status
- clear primary CTA to continue booking
- secondary CTA to go back to tour details
- public footer

Required states:
- loading
- no schedules available
- limited availability
- error

Rules:
- this page is the bridge between public discovery and booking
- schedule cards must feel like a variant of the existing card family, not a new design language
- selection states must be obvious and trustworthy
- avoid clutter; emphasize decision-making clarity

At the end include continuity notes for the Login page and Checkout Review page.
```

### Prompt 05 - Destinations

```text
Design one page only: the public destinations page.

Goal:
- inspire exploration while staying inside the same TravelBook design system
- guide users into tour discovery by destination

Required sections:
- public top navigation
- editorial-style header
- destination highlights grid
- thematic or regional grouping
- quick route into Tours Catalog filtered by destination
- reassurance block about trusted booking and support
- public footer

Rules:
- preserve the public shell from Home
- make it inspirational but not visually disconnected from the product
- destination cards must still feel like part of the same card family
- keep the path to actual tour browsing obvious

At the end include continuity notes for the Promotions page.
```

### Prompt 06 - Promotions

```text
Design one page only: the public promotions page.

Goal:
- showcase active deals without looking cheap or noisy
- reinforce trust and urgency in a controlled way

Required sections:
- public top navigation
- promotions page header
- offer cards or featured promotional modules
- eligibility / validity information
- route into tours or checkout-relevant detail flows
- FAQ or terms clarification block
- public footer

Rules:
- urgency should feel premium and controlled
- avoid red-sale visual chaos
- reuse existing card, badge, and CTA treatments
- promotion logic must remain easy to understand on mobile

At the end include continuity notes for the Help page.
```

### Prompt 07 - Help Page

```text
Design one page only: the public help page.

Goal:
- answer common pre-booking concerns
- reduce anxiety around security, refunds, payments, and support

Required sections:
- public top navigation
- help header with search or quick topic shortcuts
- grouped FAQ modules
- contact/support escalation block
- payment security and booking trust reassurance
- clear CTA back into tours or account access
- public footer

Rules:
- this page should feel calm, clear, and highly readable
- keep information architecture stronger than decoration
- reuse the public shell and card language
- support-related UI should feel close to the future account support experience

At the end include continuity notes for the Login page.
```

## Auth Flow

### Prompt 08 - Login Page

```text
Design one page only: the login page.

Previous page: Tour Schedules or Help
Next page: Checkout Review or Account Dashboard

Goal:
- help users sign in quickly and safely
- preserve booking momentum without causing stress

Required sections:
- focused auth shell
- concise welcome/value copy
- email and password form
- forgot password link
- clear primary CTA for sign in
- secondary path to register
- trust or security microcopy

Required states:
- default
- validation error
- incorrect credentials
- loading

Rules:
- the auth shell must feel calmer and more focused than the public shell
- keep trust and continuity from public pages
- do not create a different button or input style
- make the page work for both returning travelers and users arriving mid-booking

At the end include continuity notes for the Register page.
```

### Prompt 09 - Register Page

```text
Design one page only: the registration page.

Previous page: Login
Next page: Checkout Review or Account Dashboard

Goal:
- create a secure account with minimal friction
- reassure users that registration helps manage bookings, documents, and travelers

Required sections:
- focused auth shell
- registration form with clear field grouping
- password strength guidance
- privacy and consent area
- primary CTA for account creation
- secondary path to login
- short benefits panel explaining why an account helps

Required states:
- default
- validation error
- password mismatch or weak password
- loading
- success / next-step confirmation

Rules:
- reuse the same input and CTA system as Login
- form should be longer than Login but still feel calm
- keep the promise of secure booking and trip management visible

At the end include continuity notes for the Forgot Password page.
```

### Prompt 10 - Forgot Password

```text
Design one page only: the forgot password page.

Goal:
- let users recover access without anxiety

Required sections:
- focused auth shell
- simple explanation of the reset process
- single email input
- primary CTA to send reset instructions
- secondary path back to login
- reassurance about email security and timing

Required states:
- default
- validation error
- submission loading
- success state confirming instructions were sent

Rules:
- reduce the page to the essentials
- reuse auth shell, input styles, and button hierarchy
- use very calm, plain-language copy

At the end include continuity notes for the Reset Password page.
```

### Prompt 11 - Reset Password

```text
Design one page only: the reset password page.

Goal:
- help users set a new password clearly and securely

Required sections:
- focused auth shell
- new password and confirm password fields
- password requirements guidance
- primary CTA to confirm reset
- secondary path to login

Required states:
- default
- token invalid or expired
- validation error
- loading
- success confirmation

Rules:
- keep parity with the auth design system already established
- emphasize confidence and security rather than decoration

At the end include continuity notes for the Checkout Review page.
```

## Checkout Flow

### Prompt 12 - Checkout Review

```text
Design one page only: the checkout review page.

Previous page: Tour Schedules or Login/Register
Next page: Payment

User goal:
- verify booking details before paying

Required sections:
- checkout shell with clear progress framing
- booking summary header
- key trip details
- traveler count and travel date
- payment status summary
- sticky or highly visible amount due panel
- primary CTA to continue to payment
- fallback empty state when no booking is ready

Required states:
- loading
- no booking ready
- error

Rules:
- this page establishes the checkout shell for the rest of the payment flow
- keep a high-trust visual tone
- emphasize idempotency, payment safety, and clarity without technical overload
- summary and CTA hierarchy must be very obvious on mobile

At the end include continuity notes for the Payment page.
```

### Prompt 13 - Payment Page

```text
Design one page only: the payment page.

Previous page: Checkout Review
Next page: Payment Success or Payment Failed

User goal:
- complete payment with confidence and minimal confusion

Required sections:
- checkout shell with progress context
- payment method selector
- payment form
- order summary
- security reassurance block
- primary CTA to pay now
- secondary path to return to review

Required states:
- default
- inline validation errors
- payment processing
- payment method unavailable
- API error

Rules:
- use the same checkout shell, stepper logic, and summary card family from Checkout Review
- form spacing and error treatment must be calm and clear
- keep the page transactional and trustworthy, not flashy

At the end include continuity notes for the Payment Success page.
```

### Prompt 14 - Payment Success

```text
Design one page only: the payment success page.

Previous page: Payment
Next page: Account Dashboard or Booking Detail

Goal:
- confirm payment clearly
- reduce post-payment uncertainty
- route users into booking management and vouchers

Required sections:
- checkout shell or lightweight success shell derived from checkout
- strong success confirmation
- booking reference and next steps
- CTA to view booking detail
- CTA to go to account dashboard
- voucher or document reminder

Rules:
- keep continuity with checkout colors and structure
- use the success accent carefully and sparingly
- avoid celebratory visuals that feel less trustworthy than useful

At the end include continuity notes for the Payment Failed page and Account Dashboard.
```

### Prompt 15 - Payment Failed

```text
Design one page only: the payment failed page.

Previous page: Payment
Next page: Payment or Support

Goal:
- explain failure clearly
- help users retry or seek support without panic

Required sections:
- checkout shell or derived state page
- clear failure explanation
- likely reasons or next-step guidance
- primary CTA to retry payment
- secondary CTA to contact support or return to booking

Rules:
- the page should feel calm and recoverable
- do not use overly alarming visual language
- keep the same checkout tone and component logic

At the end include continuity notes for the Account Dashboard and Support page.
```

## Account Flow

### Prompt 16 - Account Dashboard

```text
Design one page only: the account dashboard.

Previous page: Payment Success or Login
Next page: Bookings, Documents, Vouchers, Travelers, Notifications, Support

Goal:
- give returning travelers a calm operational overview
- highlight the next important actions quickly

Required sections:
- account shell with strong navigation
- welcome header
- stats cards for trips, payments, documents, or account activity
- recent bookings module
- quick action modules linking to profile, documents, vouchers, notifications, and travelers

Required states:
- loading
- error
- empty bookings

Rules:
- this page establishes the account shell for all account pages
- keep it utility-first, polished, and trustworthy
- cards and list items must feel like a direct extension of checkout and public patterns

At the end include continuity notes for the Profile page.
```

### Prompt 17 - Profile Page

```text
Design one page only: the account profile page.

Previous page: Account Dashboard
Next page: Change Password

Goal:
- let users review and edit identity details cleanly

Required sections:
- account shell
- page header
- profile overview card
- editable personal information form
- account security summary or identity reassurance block
- save action area

Required states:
- default
- validation error
- saving
- success

Rules:
- reuse account shell, form controls, alert styles, and card system
- keep this page administrative and low-stress

At the end include continuity notes for the Change Password page.
```

### Prompt 18 - Change Password

```text
Design one page only: the change password page inside the account area.

Goal:
- support a secure password update without confusing profile editing with security tasks

Required sections:
- account shell
- page header
- security-focused form
- password rules guidance
- success or confirmation messaging

Rules:
- this should feel like a stricter variant of profile editing
- reuse the same form system and alert patterns
- emphasize security and clarity

At the end include continuity notes for the Travelers page.
```

### Prompt 19 - Travelers Page

```text
Design one page only: the traveler profiles page.

Goal:
- help users manage saved traveler information for faster checkout later

Required sections:
- account shell
- page header
- traveler list or traveler cards
- add or edit traveler action
- key traveler metadata and readiness status
- empty state encouraging first traveler creation

Rules:
- this page should feel connected to checkout data entry patterns
- traveler cards must belong to the existing card family
- form entry should feel structured and low-risk

At the end include continuity notes for the Bookings List page.
```

### Prompt 20 - Bookings List

```text
Design one page only: the bookings list page.

Goal:
- let users scan and manage all bookings quickly

Required sections:
- account shell
- page header with optional filtering
- booking list or table-card hybrid
- status, payment state, travel date, and amount visibility
- clear drill-down CTA into booking detail
- helpful empty state

Required states:
- loading
- empty
- error

Rules:
- preserve the account shell
- booking rows/cards must feel like an evolution of recent bookings from the dashboard
- status badges and detail hierarchy must stay consistent with checkout and dashboard pages

At the end include continuity notes for the Booking Detail page.
```

### Prompt 21 - Booking Detail

```text
Design one page only: the account booking detail page.

Previous page: Bookings List
Next page: Vouchers or Refunds

Goal:
- provide a complete single place to understand one booking and act on it

Required sections:
- account shell
- booking header with code and status
- trip summary
- traveler summary
- payment summary
- voucher/document area
- cancellation or refund-related action area where appropriate

Rules:
- maintain the same data language established in checkout review
- make the page feel reliable and operational, not overloaded
- actions such as pay, cancel, download, or request refund must be clearly prioritized

At the end include continuity notes for the Vouchers page.
```

### Prompt 22 - Vouchers Page

```text
Design one page only: the vouchers page.

Goal:
- help users find and download available booking vouchers quickly

Required sections:
- account shell
- page header
- voucher list or card list
- booking reference, voucher status, download actions
- empty state when no vouchers are available

Rules:
- keep it simple and highly actionable
- voucher items should inherit booking list and detail visual language
- download actions should be obvious but not visually noisy

At the end include continuity notes for the Documents page.
```

### Prompt 23 - Documents Page

```text
Design one page only: the documents page.

Goal:
- manage passport, visa, and related travel document uploads with confidence

Required sections:
- account shell
- page header
- upload panel
- document list with status visibility
- document detail metadata such as type, expiry, upload date, and review status
- validation guidance and security reassurance

Required states:
- empty
- uploading
- review pending
- approved
- rejected
- error

Rules:
- this page should feel safety-critical and organized
- reuse account shell, badges, alerts, cards, and form controls
- file upload must feel like part of the same form family, not a random widget

At the end include continuity notes for the Refunds page.
```

### Prompt 23A - Document Detail Placeholder Page

```text
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

At the end include continuity notes for the Refunds page.
```

### Prompt 24 - Refunds Page

```text
Design one page only: the refunds list page.

Goal:
- show refund requests and statuses clearly

Required sections:
- account shell
- page header
- refund list or status timeline list
- status, amount, booking reference, request date
- CTA into refund detail
- empty state when no refund requests exist

Rules:
- this page should visually connect to booking detail and support flows
- status presentation must be consistent and easy to scan

At the end include continuity notes for the Refund Detail page.
```

### Prompt 25 - Refund Detail

```text
Design one page only: the refund detail page.

Goal:
- explain one refund case transparently, including current stage and next expected step

Required sections:
- account shell
- refund summary header
- timeline or step-based status progression
- amount and booking reference details
- support/escalation area
- clear status explanation

Rules:
- use the existing timeline, badge, alert, and detail-card language
- the page must reduce uncertainty and support questions
- keep the design informative, not dramatic

At the end include continuity notes for the Notifications page.
```

### Prompt 26 - Notifications Page

```text
Design one page only: the notifications page.

Goal:
- let users scan recent alerts, booking updates, and system notices quickly

Required sections:
- account shell
- page header
- notification list with type, priority, time, and read/unread treatment
- optional filters or tabs if helpful
- empty state

Rules:
- keep it utilitarian and fast to scan
- notification items should inherit status and list logic from bookings and refunds
- do not invent an unrelated messaging UI

At the end include continuity notes for the Support page.
```

### Prompt 27 - Support Page

```text
Design one page only: the account support page.

Goal:
- help signed-in users create and track support requests connected to their trips

Required sections:
- account shell
- page header
- support ticket creation form
- recent or open tickets list
- status badges and expected response timing
- escalation or guidance block

Rules:
- support UI must feel related to Help and Refund pages
- form and list patterns should reuse the existing account system
- make the page feel reassuring and structured

At the end include continuity notes for the Admin Dashboard.
```

## Admin Flow

### Prompt 28 - Admin Dashboard

```text
Design one page only: the admin dashboard.

Goal:
- give operators a fast high-level operational summary
- route them into the correct admin workflow quickly

Required sections:
- admin shell with operational navigation
- summary header
- high-level stats cards
- queue shortcuts for bookings, refunds, documents, and operations
- operational highlight or warning area

Required states:
- loading
- error
- no data fallback

Rules:
- this page establishes the admin shell
- admin should feel denser than account, but still part of the same product family
- retain the same tokens, spacing logic, badge logic, and table/card language

At the end include continuity notes for Tour Management.
```

### Prompt 29 - Admin Tour Management

```text
Design one page only: the admin tour management page.

Goal:
- let operators review and manage tours efficiently

Required sections:
- admin shell
- page header
- filters and actions toolbar
- table or table-card hybrid for tours
- status, destination, duration, price context, schedule count, and actions

Rules:
- the admin table system must be established here and reused later
- density can increase, but readability must stay strong
- action buttons should feel related to the same global button system

At the end include continuity notes for Schedule Management.
```

### Prompt 30 - Admin Schedule Management

```text
Design one page only: the admin schedule management page.

Goal:
- manage tour schedules, availability, and schedule-level details efficiently

Required sections:
- admin shell
- page header
- schedule filters and controls
- schedule table or card-table hybrid
- availability and status visibility
- edit or review actions

Rules:
- reuse the admin table language from Tour Management
- keep schedule data more granular without redesigning the page system

At the end include continuity notes for Pricing Management.
```

### Prompt 31 - Admin Pricing Management

```text
Design one page only: the admin pricing management page.

Goal:
- present pricing rules and adjustments clearly to operators

Required sections:
- admin shell
- page header
- pricing rules table or list
- create/edit rule panel area
- status and effective-date visibility
- validation and warning treatment

Rules:
- pricing management should feel more form-heavy, but still clearly related to the established admin system
- warning and validation styles must stay consistent with checkout and account alerts

At the end include continuity notes for Booking Management.
```

### Prompt 32 - Admin Booking Management

```text
Design one page only: the admin booking management page.

Goal:
- help operators inspect booking queues and move into booking-level review

Required sections:
- admin shell
- page header
- queue filters
- bookings table
- high-signal columns for booking code, traveler, amount, status, payment status, date, and actions

Required states:
- loading
- empty queue
- error

Rules:
- reuse the same admin table system established earlier
- this page is operationally critical, so scanning speed matters most
- status hierarchy must align with account booking views

At the end include continuity notes for Admin Booking Detail.
```

### Prompt 33 - Admin Booking Detail

```text
Design one page only: the admin booking detail page.

Goal:
- give operators a complete operational view of one booking

Required sections:
- admin shell
- booking summary header
- traveler and payment details
- booking timeline or state history
- linked documents or voucher context
- internal action area for follow-up

Rules:
- this should be the admin counterpart to the account booking detail page
- use the same base information architecture with more operator controls
- keep power-user density without breaking the design system

At the end include continuity notes for Refund Management.
```

### Prompt 34 - Admin Refund Management

```text
Design one page only: the admin refund management page.

Goal:
- help operators process refund requests clearly and consistently

Required sections:
- admin shell
- page header
- refund queue table
- status and amount visibility
- action panel or action affordances
- risk or attention flags where needed

Rules:
- refund statuses must stay consistent with the account-side refund views
- this page should feel queue-oriented and action-ready

At the end include continuity notes for Document Management.
```

### Prompt 35 - Admin Document Management

```text
Design one page only: the admin document management page.

Goal:
- let operators review user-submitted travel documents efficiently

Required sections:
- admin shell
- page header
- document review queue
- file type, traveler, upload date, status, expiry, and action visibility
- review or approval area

Rules:
- this page should clearly relate to the account documents page but include operator controls
- statuses, warnings, and file-related UI must stay consistent with the rest of the product

At the end include continuity notes for Operations.
```

### Prompt 36 - Admin Operations Page

```text
Design one page only: the admin operations page.

Goal:
- provide a board-like operational overview for ongoing issues, backlog, and manual follow-up

Required sections:
- admin shell
- page header
- operations board or grouped operational modules
- issue/queue visibility
- ownership or status grouping
- escalation or monitoring callouts

Rules:
- this page can be slightly more dashboard-like, but it must still look like the same admin product
- board or grouped modules should reuse existing card, badge, and panel logic

At the end include continuity notes for the error pages.
```

## Error States

### Prompt 37 - Forbidden Page

```text
Design one page only: the 403 forbidden page.

Goal:
- explain lack of access clearly and calmly
- route the user to a safe next step

Required sections:
- lightweight shell appropriate to the area the user came from
- clear explanation
- primary CTA to go somewhere valid
- secondary CTA to go back or contact support

Rules:
- error pages should still feel like the same product
- keep the tone respectful and not alarming
```

### Prompt 38 - Not Found Page

```text
Design one page only: the 404 not found page.

Goal:
- help users recover quickly when a route does not exist

Required sections:
- lightweight product shell
- clear not-found message
- CTA to home or dashboard depending on context
- secondary CTA to browse tours or bookings

Rules:
- preserve the design system and tone
- do not treat this as a playful illustration-first page
```

### Prompt 39 - Server Error Page

```text
Design one page only: the 500 server error page.

Goal:
- explain that something went wrong temporarily
- guide the user toward retrying safely or using support

Required sections:
- lightweight product shell
- status explanation
- primary CTA to retry
- secondary CTA for support or navigation fallback

Rules:
- keep the page serious, reassuring, and clear
- stay inside the same alert and CTA system used elsewhere
```

## Frontend System Coverage Prompts

These prompts exist to cover the rest of the visual frontend system beyond route-level pages and layout shells.

Numbering note:
- `Prompt 40` and `Prompt 41` remain reserved for drift-control utilities
- `Prompt 42` to `Prompt 60` are an optional deep-coverage extension block for the full visual frontend system

When to run `42-60`:
- If you want a fast, practical flow, run them after the main pages
- If you want maximum consistency in Stitch, run them before the page prompts
- For strict system-first design work, `42-60` should come before `01-39`

Important:
- use these for visual surfaces and reusable UI
- do not use Stitch prompts for `api`, `hooks`, `queryKeys`, `schema`, `types`, or store files because they are not design surfaces
- these prompts are the missing layer that maps to `shared/navigation`, `shared/components`, `shared/ui`, `sections`, and `features/*/components`

### Prompt 42 - Global Navigation System

```text
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
4. continuity notes for shared UI primitives
```

### Prompt 43 - Public Marketing Section Library

```text
Design the reusable public marketing sections for TravelBook as one coherent library.

Cover:
- section hero
- section header
- feature card
- testimonial card
- contact form
- featured tours section
- popular destinations section
- promotions section
- destination highlight section

Goals:
- make Home, Destinations, Promotions, and Help feel clearly related
- preserve a trust-first travel aesthetic without generic startup visuals

Requirements:
- define section spacing, content width, visual rhythm, and CTA placement
- make each section reusable across multiple public pages
- keep section transitions smooth and consistent

At the end output:
1. section families
2. card families
3. spacing and hierarchy rules
4. continuity notes for discovery search and filter components
```

### Prompt 44 - Discovery Search And Filter System

```text
Design the reusable search and filter system for TravelBook discovery flows.

Cover:
- search bar
- filter panel
- tour search filters
- destination search
- sort controls
- filter chips
- date range inputs where relevant
- quantity selectors where relevant

Goals:
- help users narrow choices quickly without creating an enterprise-heavy experience
- ensure the same search/filter language works across tours, schedules, bookings, and admin lists where appropriate

Requirements:
- show desktop and mobile filter behavior
- define active, applied, cleared, and empty-result states
- reuse the existing form and button system

At the end output:
1. search/filter component family
2. mobile behavior
3. state handling
4. continuity notes for tour discovery components
```

### Prompt 45 - Tour Discovery Component Family

```text
Design the reusable tour discovery components for TravelBook.

Cover:
- tour card
- tour price box
- tour detail hero
- schedule list
- schedule card / schedule selection row
- destination section modules

Goals:
- support browsing, comparison, and schedule selection with very clear travel decision-making
- preserve continuity from catalog to detail to schedule selection

Requirements:
- define information hierarchy for destination, duration, availability, price, and CTA
- show default, limited availability, sold out, and loading skeleton states
- keep every component in the same card family lineage

At the end output:
1. discovery component family
2. states and variants
3. pricing and availability treatment
4. continuity notes for auth and checkout components
```

### Prompt 46 - Auth Form Component System

```text
Design the reusable authentication form system for TravelBook.

Cover:
- login form
- register form
- forgot password form
- reset password form
- inline validation
- password strength guidance
- success and error messaging

Goals:
- keep auth calm, low-stress, and secure
- maintain consistency across all auth entry points

Requirements:
- define field spacing, help text, validation timing, and button hierarchy
- show mobile behavior and error states
- ensure form cards inherit from the auth shell rules

At the end output:
1. auth form family
2. validation patterns
3. message patterns
4. continuity notes for checkout modules
```

### Prompt 47 - Checkout Module Set

```text
Design the reusable checkout modules for TravelBook.

Cover:
- checkout summary section
- traveler info section
- payment summary section
- payment method selector
- payment status panel
- checkout panel

Goals:
- create a trusted transaction system that feels consistent from review to payment result
- minimize payment anxiety while preserving strong clarity

Requirements:
- define layout relationship between content and summary
- show form, review, success, failure, and processing states
- keep the modules reusable across checkout and booking detail flows

At the end output:
1. checkout modules
2. state patterns
3. summary and payment rules
4. continuity notes for account modules
```

### Prompt 48 - Account Summary Section Set

```text
Design the reusable account summary sections for TravelBook.

Cover:
- profile overview section
- booking history section
- document overview section
- notification center section
- stats cards
- account quick-action cards

Goals:
- make the account area feel useful, calm, and scan-friendly
- create reusable modules for dashboard and overview screens

Requirements:
- define section priority, card density, and status visibility
- preserve continuity with checkout summaries and booking components

At the end output:
1. account summary modules
2. card and list rules
3. dashboard composition rules
4. continuity notes for booking components
```

### Prompt 49 - Booking Component Family

```text
Design the reusable booking components for TravelBook.

Cover:
- booking card
- booking summary
- booking status badge
- booking actions
- booking queue row/card patterns where reusable

Goals:
- make booking information easy to scan in account and admin contexts
- preserve one status language across checkout, account, and operations

Requirements:
- define how status, amount, date, traveler count, and actions appear
- show default, pending payment, confirmed, cancelled, and refunded states
- make actions clear without clutter

At the end output:
1. booking component family
2. status language
3. action hierarchy
4. continuity notes for profile and traveler forms
```

### Prompt 50 - Profile And Traveler Form System

```text
Design the reusable profile and traveler management form system for TravelBook.

Cover:
- profile card
- profile form
- change password form
- traveler form
- traveler list

Goals:
- support identity management and traveler data entry with low friction
- keep personal-data tasks calm, secure, and structured

Requirements:
- define edit, save, cancel, validation, and empty states
- show how forms scale from a simple profile edit to multi-field traveler entry
- preserve the same form language established in auth and checkout

At the end output:
1. profile/traveler form family
2. card and list relationships
3. validation and save patterns
4. continuity notes for document components
```

### Prompt 51 - Document Management Component Family

```text
Design the reusable document management components for TravelBook.

Cover:
- document upload panel
- file upload field
- document list
- document card
- document manager section
- verification status

Goals:
- make document handling feel secure, organized, and easy to understand
- support upload, review, and status tracking without chaos

Requirements:
- define accepted-file guidance, progress, pending review, approved, rejected, and error states
- show how upload and list views relate to each other
- keep the system reusable for both account and admin review flows

At the end output:
1. document component family
2. upload and review states
3. security and reassurance patterns
4. continuity notes for vouchers and refunds
```

### Prompt 52 - Voucher And Refund Component Family

```text
Design the reusable voucher and refund components for TravelBook.

Cover:
- voucher viewer
- voucher download button
- refund timeline
- refund request form
- refund status displays

Goals:
- help users understand post-booking artifacts and refund progress clearly
- reduce uncertainty around documents, entitlements, and refund stages

Requirements:
- define success, pending, unavailable, processing, and rejected states
- keep voucher and refund status language aligned with booking status language
- make timeline progression calm and informative

At the end output:
1. voucher/refund component family
2. status and timeline patterns
3. download and request actions
4. continuity notes for notifications and support
```

### Prompt 53 - Notification And Support Component Family

```text
Design the reusable notification and support components for TravelBook.

Cover:
- notification item
- notification list
- ticket form
- ticket list
- ticket status badge

Goals:
- create a coherent communication layer for alerts, support requests, and operational follow-up
- keep the experience structured and reassuring

Requirements:
- define unread/read treatment, priority levels, response expectation cues, and empty states
- make support tickets feel related to help and refund experiences
- preserve one status and badge language across communications

At the end output:
1. communication component family
2. priority and status rules
3. empty and active states
4. continuity notes for admin table systems
```

### Prompt 54 - Admin Table And Review System

```text
Design the reusable admin table and review system for TravelBook.

Cover:
- base admin table
- booking management table
- refund management table
- document review table
- tour management table
- pagination
- inline row actions
- filter toolbar

Goals:
- create one dense but readable data-management language for the admin area
- ensure different admin queues feel like one product system

Requirements:
- define column hierarchy, sticky actions if needed, sorting/filtering affordances, selection behavior, and empty states
- make the system responsive for smaller laptops without collapsing into unusable complexity
- preserve continuity with booking/account status language

At the end output:
1. admin table family
2. queue/review variants
3. action-density rules
4. continuity notes for admin operational modules
```

### Prompt 55 - Admin Operational Modules

```text
Design the reusable admin operational modules for TravelBook.

Cover:
- dashboard stats section
- booking queue section
- refund queue section
- operations board
- pricing rule form
- operational alert panels

Goals:
- support daily operator workflows with clear prioritization and low noise
- make admin dashboards and boards feel operationally mature

Requirements:
- define card density, urgency treatment, queue summaries, and board grouping
- keep operator dashboards consistent with the admin table system
- show active, blocked, warning, and resolved states where relevant

At the end output:
1. admin operational module family
2. urgency and prioritization rules
3. board and stats patterns
4. continuity notes for shared state components
```

### Prompt 56 - Shared Status And Feedback System

```text
Design the shared status and feedback system for TravelBook.

Cover:
- status badge
- generic badge
- alert
- empty state
- error fallback
- loading overlay
- skeleton
- spinner

Goals:
- establish one consistent language for status, progress, warning, error, and no-data situations
- make every module across the product feel consistent during system feedback moments

Requirements:
- define severity and semantic mappings
- show loading, success, warning, error, info, and neutral states
- keep accessibility and clarity stronger than decoration

At the end output:
1. feedback component family
2. semantic color and copy rules
3. loading and error patterns
4. continuity notes for shared form primitives
```

### Prompt 57 - Shared Form Primitive Library

```text
Design the shared form primitive library for TravelBook.

Cover:
- button
- input
- textarea
- select
- checkbox
- radio
- toggle
- date picker
- date range field
- quantity field
- form field wrapper

Goals:
- create one reusable, calm, and trustworthy form language for every product area
- make data entry feel consistent from public search to admin operations

Requirements:
- define sizes, states, labels, helper text, validation, disabled, loading, and mobile behavior
- preserve clear CTA hierarchy inside the button system
- keep control styling consistent with the existing visual system

At the end output:
1. form primitive family
2. state rules
3. sizing and spacing rules
4. continuity notes for navigation and flow components
```

### Prompt 58 - Shared Navigation And Flow Components

```text
Design the shared navigation and flow components for TravelBook.

Cover:
- stepper
- tabs
- pagination
- breadcrumb
- page header

Goals:
- make multi-step flows, segmented content, and deep navigation feel coherent across the product
- keep progression and orientation very clear

Requirements:
- define default, active, completed, disabled, and overflow states where relevant
- show desktop and mobile adaptations
- keep these components visually connected to the global navigation system

At the end output:
1. flow/navigation component family
2. states and variants
3. responsive rules
4. continuity notes for overlay and utility components
```

### Prompt 59 - Shared Display And Utility Components

```text
Design the shared display and utility components for TravelBook.

Cover:
- card
- avatar
- section header
- date text
- currency text
- protected block
- protected route informational treatment

Goals:
- standardize the quieter pieces of UI that appear across many modules
- prevent visual drift in the small reusable parts

Requirements:
- define display hierarchy, spacing, and inline metadata treatment
- keep utility components subtle and highly reusable
- avoid overdesigning purely supportive UI

At the end output:
1. utility component family
2. metadata display rules
3. card hierarchy rules
4. continuity notes for overlay components
```

### Prompt 60 - Shared Overlay Components

```text
Design the shared overlay components for TravelBook.

Cover:
- modal
- drawer
- confirm dialog
- tooltip

Goals:
- create a consistent interruptive-UI language for confirmations, secondary tasks, and contextual help
- ensure overlays feel safe, restrained, and easy to dismiss

Requirements:
- define layering, backdrop, focus handling, primary and secondary actions, destructive confirmation treatment, and mobile behavior
- keep overlays visually tied to the same card, form, and button system

At the end output:
1. overlay component family
2. interaction and dismissal rules
3. destructive-action treatment
4. continuity notes for any future components
```

## Drift Control Prompts

### Prompt 40 - Continuity Repair

Use this if Stitch starts drifting away from earlier pages.

```text
The last generated page drifted away from the locked TravelBook design system.

Please redesign the page while strictly restoring continuity with the previously established system.

Restore and preserve:
- the same shell structure
- the same button hierarchy
- the same spacing rhythm
- the same radius and shadow system
- the same card families
- the same form patterns
- the same status badge treatment
- the same tone and trust level

Do not introduce any new component family.
Do not change the visual direction.
Do not optimize for novelty.

At the end, explain exactly which elements were brought back into alignment.
```

### Prompt 41 - New Component Approval

Use this before allowing Stitch to invent a new component.

```text
Before creating a new component, first verify whether the need can be solved by:
- reusing an existing component
- extending an existing component with a variant
- combining existing components differently

Only create a new component if all three options fail.

If a new component is still required, describe:
1. why existing components are insufficient
2. which existing family it inherits from
3. the exact rules that keep it visually consistent with the rest of TravelBook

Then design the page using that component sparingly.
```

## Recommended Generation Order

This is the practical page-first order.
Use it when you want to move quickly from shell to full screens, then tighten the reusable system afterward.

```text
00 Foundation Reference Page
00A Public Layout Shell Reference
00B Auth Layout Shell Reference
00C Checkout Layout Shell Reference
00D Account Layout Shell Reference
00E Admin Layout Shell Reference
01 Home
02 Tours Catalog
03 Tour Detail
04 Tour Schedules
05 Destinations
06 Promotions
07 Help
08 Login
09 Register
10 Forgot Password
11 Reset Password
12 Checkout Review
13 Payment
14 Payment Success
15 Payment Failed
16 Account Dashboard
17 Profile
18 Change Password
19 Travelers
20 Bookings List
21 Booking Detail
22 Vouchers
23 Documents
23A Document Detail Placeholder Page
24 Refunds
25 Refund Detail
26 Notifications
27 Support
28 Admin Dashboard
29 Admin Tour Management
30 Admin Schedule Management
31 Admin Pricing Management
32 Admin Booking Management
33 Admin Booking Detail
34 Admin Refund Management
35 Admin Document Management
36 Admin Operations
37 Forbidden
38 Not Found
39 Server Error
40 Continuity Repair
41 New Component Approval
```

## Strict Consistency Order

This is the system-first order.
For Stitch-heavy work, this is usually the better order because it locks reusable components and interaction patterns before page generation.

```text
00 Foundation Reference Page
00A Public Layout Shell Reference
00B Auth Layout Shell Reference
00C Checkout Layout Shell Reference
00D Account Layout Shell Reference
00E Admin Layout Shell Reference
42 Global Navigation System
43 Public Marketing Section Library
44 Discovery Search And Filter System
45 Tour Discovery Component Family
46 Auth Form Component System
47 Checkout Module Set
48 Account Summary Section Set
49 Booking Component Family
50 Profile And Traveler Form System
51 Document Management Component Family
52 Voucher And Refund Component Family
53 Notification And Support Component Family
54 Admin Table And Review System
55 Admin Operational Modules
56 Shared Status And Feedback System
57 Shared Form Primitive Library
58 Shared Navigation And Flow Components
59 Shared Display And Utility Components
60 Shared Overlay Components
01 Home
02 Tours Catalog
03 Tour Detail
04 Tour Schedules
05 Destinations
06 Promotions
07 Help
08 Login
09 Register
10 Forgot Password
11 Reset Password
12 Checkout Review
13 Payment
14 Payment Success
15 Payment Failed
16 Account Dashboard
17 Profile
18 Change Password
19 Travelers
20 Bookings List
21 Booking Detail
22 Vouchers
23 Documents
23A Document Detail Placeholder Page
24 Refunds
25 Refund Detail
26 Notifications
27 Support
28 Admin Dashboard
29 Admin Tour Management
30 Admin Schedule Management
31 Admin Pricing Management
32 Admin Booking Management
33 Admin Booking Detail
34 Admin Refund Management
35 Admin Document Management
36 Admin Operations
37 Forbidden
38 Not Found
39 Server Error
40 Continuity Repair
41 New Component Approval
```

## Optional Deep Frontend Coverage Order

Use this only if you want the prompt pack to cover the complete visual frontend system, not just route screens.

```text
42 Global Navigation System
43 Public Marketing Section Library
44 Discovery Search And Filter System
45 Tour Discovery Component Family
46 Auth Form Component System
47 Checkout Module Set
48 Account Summary Section Set
49 Booking Component Family
50 Profile And Traveler Form System
51 Document Management Component Family
52 Voucher And Refund Component Family
53 Notification And Support Component Family
54 Admin Table And Review System
55 Admin Operational Modules
56 Shared Status And Feedback System
57 Shared Form Primitive Library
58 Shared Navigation And Flow Components
59 Shared Display And Utility Components
60 Shared Overlay Components
```
