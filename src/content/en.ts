import type { Content } from "./types.js";
import { es } from "./es.js";

// English version. Same projects, images and links as es.ts; only the words change.
const base = Object.fromEntries(es.projects.map(p => [p.id, p]));

export const en: Content = {
  lang: "en",
  locale: "en_US",
  meta: {
    title: "Nelson Sivisstum, full stack developer",
    description: "Full stack developer in Formosa, Argentina. Projects built with React, Next.js, TypeScript and Django: Fracxion, Ragnar Suplementos and RoadLedger.",
    ogAlt: "Nelson Sivisstum, full stack developer",
  },
  ids: { projects: "projects", ai: "ai", about: "about", contact: "contact" },
  ui: {
    skip: "Skip to content", menu: "Menu",
    nav: { projects: "Projects", ai: "AI", about: "About", contact: "Contact" },
    switchLang: "ES", switchLangLabel: "Ver en español",
    themeToDark: "Switch to dark theme", themeToLight: "Switch to light theme",
    role: "Full stack developer",
    heroLine: "I build web applications with React, Next.js and Django: the interface, the API and the database behind it.",
    viewProjects: "See projects", downloadCv: "Download CV",
    heroMeta: "Formosa, Argentina. Looking for my first development team.",
    scrollCue: "Scroll to enter",
    carouselLabel: "Project carousel", prev: "Previous project", next: "Next project",
    openProject: "Open project", carouselHint: "Drag or use the arrows to turn it. Click the front project to open it.",
    countOf: "{n} of {total}",
    detailLabel: "Project details", backToCarousel: "Back to the carousel",
    whatItDoes: "What it does", myPart: "My part", readCase: "Read the full case study", viewCode: "View code",
    projectsTitle: "Projects", brainAlt: "",
    caseBack: "Back to projects", caseStack: "Stack", caseRole: "My part",
    caseProblem: "The problem", caseSolution: "The solution", caseFeatures: "What it lets you do",
    caseArchitecture: "Architecture", caseChallenges: "Challenges", caseDecisions: "Decisions",
    caseStatus: "Status", caseWorks: "What works", caseMissing: "What's missing", caseLearning: "What I learned",
    caseNext: "Next project", caseProblemLabel: "Problem", caseSolutionLabel: "Solution", caseCode: "In the code",
  },
  ai: {
    title: "How I use AI to code",
    lead: "I use two assistants while I code. They help me read code I didn't write and move faster on small changes. Before every commit I read the diff and run the tests.",
    cards: [
      { name: "Claude Code", text: "I use it in the terminal to walk through a project, understand how its parts connect and make changes one at a time.", uses: ["Explore a repository", "Implement step by step", "Review code"] },
      { name: "Codex", text: "I use it to explore repositories, implement in iterations and review changes. I check what it proposes against the code and the project's tests.", uses: ["Analysis", "Implementation", "Review"] },
    ],
    ruleTitle: "What I don't hand off",
    rule: "What gets built and how the data is modeled. What each user is allowed to do. Which change goes in and which one gets dropped. A generated suggestion is a draft until I've read it and tested it.",
  },
  about: {
    title: "About",
    paragraphs: [
      "I'm Nelson Sivisstum, a self-taught developer from Formosa, Argentina. I work mostly with React, Next.js, TypeScript, and Python with Django.",
      "In Ragnar I built the shopping flow and the tools to run an online store. In Fracxion I worked on customers, invoices and payments, with data and permissions kept separate for each company. I like understanding an operation end to end, from the form to what ends up stored.",
      "I'm looking to join a full stack development team. I also take on online stores, admin panels and API integrations with a clear scope and deliverables.",
    ],
    timelineTitle: "Path",
    timeline: [
      { name: "January 2023", detail: "Finished high school." },
      { name: "June 2026", detail: "Started learning to code." },
      { name: "September 2026", detail: "Started building my own web projects." },
      { name: "Now", detail: "Working on Fracxion, Ragnar Suplementos and RoadLedger with React and Django, and looking for my first role on a team." },
    ],
    educationTitle: "Learning",
    education: [
      { name: "CS50 Web Programming", detail: "Harvard University / edX. Web programming with Python and JavaScript.", status: "In progress, since September 2026" },
      { name: "The Odin Project", detail: "Full Stack JavaScript.", status: "In progress, since September 2026" },
      { name: "freeCodeCamp", detail: "Front End Development Libraries.", status: "Certified, August 2026" },
    ],
    nowTitle: "Now",
    now: [
      "Learning more about SaaS architecture and data isolation.",
      "Improving tests for permissions, inventory and concurrent operations.",
      "Looking for my first professional role.",
    ],
    cvEs: "CV in Spanish", cvEn: "CV in English",
  },
  stack: {
    title: "What I work with",
    lead: "The tools behind the projects on this page.",
    groups: [
      { name: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML and CSS"] },
      { name: "Backend", items: ["Python", "Django", "Django REST Framework", "REST APIs"] },
      { name: "Data", items: ["PostgreSQL", "SQLite", "Transactions", "Constraints"] },
      { name: "Tools", items: ["Git and GitHub", "Linux", "Docker Compose", "Playwright"] },
    ],
  },
  contact: {
    title: "Write to me",
    text: "Tell me what process you need to solve, who uses it and what result you expect. I answer by email or LinkedIn.",
    emailLabel: "Send an email",
  },
  projects: [
    {
      ...base["fracxion"],
      kind: "Multi-company business management",
      tagline: "Customers, invoices and payments for several companies in one system.",
      summary: "A business management system to handle customers, products and services, issue internal invoices and record partial or full payments. Each company works with its own data and permissions.",
      images: [
        { src: "/img/fracxion-overview.png", alt: "Company overview in Fracxion, with its management modules" },
        { src: "/img/fracxion-invoice.png", alt: "Internal invoice detail in Fracxion" },
      ],
      role: "I built the interface, the API, the company model and the invoicing and payment services, plus the tests and the documentation of the business flow.",
      highlights: [
        "Customers and catalog kept separate per company, with role-based access.",
        "Internal invoices: draft, numbered issue and printing.",
        "Partial payments, outstanding balance and reversals with history.",
      ],
      problem: [
        "Running several companies on one platform means keeping their data apart, controlling who can do what, and keeping a reliable history of every document and every payment.",
        "The goal is to centralize customers, products, services and internal invoicing for small businesses, each with its own rules.",
      ],
      solution: [
        "A Next.js frontend connected to a Django REST Framework API. Each account is tied to a company through a membership with a role, and the backend checks that link before reading or changing any data.",
      ],
      features: [
        "Create an account with its company, sign in, pick a workspace and recover access by email.",
        "Add, edit, search and deactivate customers without losing their references.",
        "Manage products and services with SKU, unit, currency, price and tax.",
        "Prepare internal invoices as drafts, calculate amounts on the server, issue them with per-company numbering and print them.",
        "Record partial or full payments, see the outstanding balance and reverse a payment with a reason.",
        "See who did each operation, when, and what changed.",
      ],
      architecture: {
        text: "Next.js and React build the interface, Django REST Framework exposes the API and PostgreSQL stores users, sessions and business data. The Docker Compose setup uses Caddy as a proxy, Gunicorn for Django and Redis to share sign-in rate limits.",
        parts: [
          { name: "Next.js + React", detail: "Navigation, forms and interface states." },
          { name: "Django + DRF", detail: "Authentication, permissions, validation and business operations." },
          { name: "PostgreSQL", detail: "Data, sessions, constraints and row locks." },
          { name: "Caddy, Gunicorn, Redis", detail: "HTTPS proxy, Django server and shared limits." },
        ],
      },
      flow: {
        title: "A business flow",
        steps: [
          { name: "Create the account and company", detail: "Signing up opens the session and makes the user the workspace owner." },
          { name: "Add a customer", detail: "Their data is tied to that company." },
          { name: "Add a service", detail: "For example, ARS 100 with a 21% tax." },
          { name: "Save a draft", detail: "The server calculates a subtotal of ARS 100, tax of ARS 21 and a total of ARS 121." },
          { name: "Issue the document", detail: "It gets an internal number that is unique within the company." },
          { name: "Record a payment", detail: "A payment of ARS 40 leaves a balance of ARS 81." },
          { name: "Reverse it if needed", detail: "The reversal keeps the original payment and the balance goes back to ARS 121." },
        ],
      },
      challenges: [
        { title: "Numbering that never repeats", problem: "Two invoices issued at the same time could try to take the same number.", solution: "Issuing locks the company row with select_for_update inside a transaction, and a unique constraint in PostgreSQL backs up the rule.", source: "billing/services.py, issue_invoice" },
        { title: "History stays history", problem: "Editing a customer or a price shouldn't change an earlier document.", solution: "Creating a draft stores copies of the customer and catalog data. The API doesn't allow editing or deleting issued documents.", source: "billing/services.py, create_invoice_draft" },
        { title: "Reversing without deleting", problem: "A wrong payment has to be corrected without losing its trail.", solution: "A reversal is a separate record that keeps the original payment and the reason. The balance and the audit log are updated in the same transaction.", source: "billing/services.py, reverse_payment" },
      ],
      decisions: [
        { name: "Shared database and schema", detail: "Isolation between companies happens in the application layer, through the tenant in the URL and the permissions." },
        { name: "Sessions with HttpOnly cookies", detail: "Every write requires the CSRF token." },
        { name: "Amounts with Decimal", detail: "Rounding is explicit and done on the backend." },
        { name: "Audit in the same transaction", detail: "If the audit record fails, the operation is rolled back too." },
      ],
      status: {
        works: "The full flow works locally: sign-up, customers, catalog, issuing, payment and reversal, with PostgreSQL, Docker, and concurrency and browser tests.",
        missing: "It isn't deployed. Fiscal invoicing with ARCA, credit and debit notes, member invitations and load testing are still missing.",
      },
      learning: "Operations that move money force you to think about what happens when two requests arrive at once. Locking the right row and testing that case against real PostgreSQL connections taught me more than any form.",
    },
    {
      ...base["ragnar-suplementos"],
      kind: "E-commerce",
      tagline: "An online store for a supplement shop in Formosa.",
      summary: "Shoppers pick products, flavors and bundles, keep their cart and place an order for pickup or delivery. The business manages the catalog, stock and orders from the Django admin.",
      images: [
        { src: "/img/ragnar.webp", alt: "Home page of the Ragnar Suplementos store" },
        { src: "/img/ragnar-mobile.webp", alt: "Ragnar Suplementos catalog on a phone" },
      ],
      demoLabel: "Watch the presentation",
      role: "I built the store and the API, set up the Django admin and worked on orders, inventory reservations and the payment and shipping integrations.",
      highlights: [
        "Products and bundles with flavors, a persistent cart and guest checkout.",
        "Local pickup or delivery, with configurable payment methods.",
        "Products, bundles, stock and orders managed from the Django admin.",
      ],
      problem: [
        "A supplement brand needs to sell products and bundles without losing control of its inventory. A purchase can be retried, a payment can arrive late and several items can draw from the same stock.",
      ],
      solution: [
        "A Next.js store connected to a Django API that holds the catalog, prices, orders and administration. People can buy as guests or with an account, choose pickup or delivery and pay with whatever methods are enabled.",
        "Django is the source of truth: the browser sends IDs and quantities, and the API checks prices and stock again before creating the order.",
      ],
      features: [
        "Browse products by category, pick flavors and buy bundles with their own price.",
        "Keep the cart between visits and check out as a guest or with an account.",
        "Choose pickup or get a delivery quote from Formosa based on road distance.",
        "Pay with Mercado Pago, bank transfer or on pickup, depending on what's enabled.",
        "Reserve stock while an order is pending and release it if it's cancelled or expires.",
        "Manage products, bundles, images, prices and stock from the Django admin.",
        "Review orders and manual payments, and receive questions, complaints and cancellation requests.",
      ],
      architecture: {
        text: "Next.js, React and TypeScript build the store. Zustand keeps the cart in the browser. Django REST Framework exposes the catalog, orders and inventory, and PostgreSQL stores them in production.",
        parts: [
          { name: "Next.js + React", detail: "Store, cart and checkout." },
          { name: "Django + DRF", detail: "Catalog, orders, inventory, payments and administration." },
          { name: "PostgreSQL", detail: "Catalog, orders and reservations." },
          { name: "Mercado Pago, Nominatim, OSRM", detail: "Payments and shipping quotes." },
        ],
      },
      flow: {
        title: "From cart to order",
        steps: [
          { name: "Pick", detail: "The cart gathers products or bundles, their quantities and the delivery method." },
          { name: "Quote", detail: "For delivery, the backend locates the address, calculates the route and returns a signed quote that expires after 15 minutes." },
          { name: "Validate", detail: "Django reads prices, flavors and stock again before selling." },
          { name: "Reserve", detail: "Inside a transaction, the API locks the products and reserves what the items and bundles use." },
          { name: "Resolve", detail: "The order is approved, cancelled, expires or goes to review. External payments are confirmed with the provider." },
        ],
      },
      challenges: [
        { title: "Retrying without duplicating", problem: "A double click or a slow connection can repeat the same purchase.", solution: "A unique key per attempt plus a hash of the data tell a retry apart from a different purchase.", source: "crear_preferencia, respuesta_checkout_existente" },
        { title: "Stock shared with bundles", problem: "One product can be sold on its own and inside several bundles in the same purchase.", solution: "The API adds up quantities per product and always locks rows in the same order. Each item stores the bundle's components so the right units go back.", source: "backend/store/views.py, ItemPedido.componentes_combo" },
        { title: "Payments that arrive late", problem: "A notification can repeat, report a different amount or arrive after the reservation expired.", solution: "The webhook checks the signature and asks the provider. If anything doesn't match, the order goes to review for a person to resolve.", source: "procesar_notificacion_pago, backend/store/orders.py" },
      ],
      decisions: [
        { name: "The backend decides", detail: "Prices, variants and availability are validated again at checkout." },
        { name: "Reserve before approving", detail: "A reservation lowers availability while the payment is pending. Reserving isn't selling." },
        { name: "Optional account", detail: "Guests can buy. With a session, the order is linked to the user." },
        { name: "Each item keeps what was bought", detail: "Name, flavor, price and components stay on the order even if the catalog changes later." },
      ],
      status: {
        works: "It works locally: managed catalog, cart, pickup or delivery, order, stock reservation and payment or review, with optional accounts.",
        missing: "It isn't running with real sales yet. Payment methods, webhooks, reservation expiry and email delivery still need testing on a server.",
      },
      learning: "Checkout doesn't end when the customer leaves to pay. Designing retries, expirations and reviews mattered as much as the form, and bundles made me think of inventory as something shared.",
    },
    {
      ...base["roadledger"],
      kind: "Trip planner",
      tagline: "A truck trip's route, its stops and its daily logs.",
      summary: "A full stack prototype that connects geocoding, routing and an hours-of-service model to show a trip on a map, a timeline and printable daily logs.",
      images: [
        { src: "/img/roadledger.webp", alt: "RoadLedger's form and starting map" },
        { src: "/img/roadledger-mobile.webp", alt: "RoadLedger on a phone" },
      ],
      demoLabel: "Open demo",
      role: "I built the prototype in Django and React, integrated geocoding and routing, and built the map, the timeline and the daily logs.",
      highlights: [
        "A plan from three locations, the departure time and the hours available.",
        "Route map and a timeline of driving, stops and breaks.",
        "Printable daily logs generated from the same plan.",
      ],
      problem: [
        "A line on a map only tells part of a trip. Planning it means relating distances, pickup, drop-off, available hours and breaks, and showing it in a way people can read.",
      ],
      solution: [
        "RoadLedger takes three locations, the cycle hours already used, the departure and the time zone. The backend combines geocoding, routing and a planning model, and the interface shows the route, the events and the daily logs.",
        "It's an educational prototype I built for a technical assessment. It isn't a certified ELD record.",
      ],
      features: [
        "Three locations and cycle hours as input.",
        "GeoJSON route, miles and directions.",
        "Pickup, drop-off, driving, fuel and rest events.",
        "Timeline and estimated arrival.",
        "Daily logs with segments, totals and a duty-status chart, ready to print.",
      ],
      architecture: {
        text: "Django serves the page. React builds the form, the summary and the logs, and MapLibre draws the map. A single POST /api/plan/ request connects the input to the result.",
        parts: [
          { name: "React + MapLibre", detail: "Form, map, timeline and daily logs." },
          { name: "Django + DRF", detail: "Validation, external providers, planning and splitting by day." },
          { name: "Photon", detail: "Text to coordinates." },
          { name: "OSRM", detail: "Coordinates to a road route." },
        ],
      },
      flow: {
        title: "From three locations to a plan",
        steps: [
          { name: "Validate", detail: "The API checks the locations, the cycle used (0 to 70), the departure and the time zone before calling third parties." },
          { name: "Geocode", detail: "Photon turns each location into coordinates, with caching and pauses between requests." },
          { name: "Route", detail: "OSRM returns the geometry, miles and directions. If it fails, a backup provider is tried." },
          { name: "Plan", detail: "The model estimates driving at 55 mph and adds pickup, drop-off, fuel and breaks." },
          { name: "Show", detail: "Events are split at midnight and shown on the map, the timeline and the daily logs." },
        ],
      },
      challenges: [
        { title: "Distance and duration are different things", problem: "The time a car router returns doesn't match the plan's driving assumption.", solution: "The route provides miles and geometry. The plan computes its own times with a fixed average of 55 mph.", source: "trips/views.py, _route_trip, _make_plan" },
        { title: "Splitting the trip into days", problem: "An event can start one day and end the next, and each log sheet has to cover a full day.", solution: "Events are cut at midnight. Tests check that every day adds up to 1,440 minutes.", source: "trips/views.py, _calendar_logs, trips/tests.py" },
        { title: "Still showing something if the map fails", problem: "Geocoding, routing and drawing depend on external services.", solution: "There are timeouts, response validation and a backup router. If the map doesn't draw, the summary and logs are still shown.", source: "_get_json, _route_trip, App.submit" },
      ],
      decisions: [
        { name: "One result for every view", detail: "Map, timeline and daily logs read the same JSON." },
        { name: "GeoJSON between layers", detail: "It's the contract between the backend and MapLibre." },
        { name: "No persistence", detail: "The request returns the result directly. No accounts and no trip history." },
        { name: "Assumptions in plain sight", detail: "Average speed, cycle hours and time zone are part of the model and are shown." },
      ],
      status: {
        works: "The prototype is deployed on Render and calculates the route, events and daily logs. It has 12 tests covering validation, the API contract and time boundaries.",
        missing: "It routes with a car profile, without truck restrictions, traffic or parking, and it doesn't rebuild a full eight-day history.",
      },
      learning: "Keeping the calculation separate from external services let me test the rules with controlled inputs. The midnight splits needed their own tests.",
    },
  ],
};
