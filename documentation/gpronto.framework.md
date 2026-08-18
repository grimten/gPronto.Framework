# gPronto.Framework

## Status

Draft

## Scope

gPronto.Framework:The business context and purpose of **gPronto.Framework**.
gPronto.Framework:The identities and purposes of **gPronto.Application.Backstage** and **gPronto.Application.Prototypes**.
gPronto.Framework:The identities, purposes, and boundaries of **gPronto.Services** and **gPronto.Tools**.
gPronto.Framework:Framework integration, application hosting, and application separation.
gPronto.Framework:The current state of prototype admission control.
gPronto.Framework:The shared-framework philosophy and its intended benefits.
gPronto.Framework:Excludes detailed requirements owned by individual framework areas.

## Verification

Date: 2026-08-18

## Rules

<rule category="framework-application-separation" id="framework-application-types">

The **gPronto.Framework** **MUST** support both **gPronto.Application.Backstage** and **gPronto.Application.Prototype**, and every **gPronto.Application** **MUST** be exactly one of those types.

</rule>

<rule category="repository-separation" id="services-and-tools-boundaries">

Shared non-browser services **MUST** be owned by **gPronto.Services**, and development tools **MUST** be owned by **gPronto.Tools**. Both repositories **MUST** remain outside the browser runtime of a **gPronto.Application** and the public package of **gPronto.Framework**.

</rule>

<rule category="application-types" id="backstage-identity">

There **MUST** be exactly one current **gPronto.Application.Backstage**, hosted at `grimten.com`, and it **MUST** provide the client portal around the current **gPronto.Application.Prototypes**.

</rule>

<rule category="application-types" id="prototype-identity">

Each **gPronto.Application.Prototype** **MUST** be an independently hosted web application with its own webpages, Authentication, Supabase project, PostgreSQL database, Edge Functions, and isolated **Mock user** data.

</rule>

<rule category="framework-integration" id="framework-link-import">

Each **gPronto.Application** **MUST** reach the framework through its **Framework link** and **MUST** import its public framework contract through `@gpronto.framework`.

</rule>

<rule category="hosting" id="application-hosting">

Every current **gPronto.Application** **MUST** be hosted on Cloudflare Pages, and each application **MUST** use its own Supabase project.

</rule>

<rule category="admission-control" id="prototype-admission-current-state">

Backstage-issued prototype admission control **MUST** be treated as planned, not current, behavior until implemented. Current prototype Authentication **MUST** use the prototype's separate **Mock user** identity.

</rule>

<rule category="framework-philosophy" id="shared-framework-philosophy">

Reusable application behavior **MUST** be implemented in the **gPronto.Framework** when it can serve more than one **gPronto.Application**; application-facing choices **MUST** be limited to the smallest supported contract.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-gpronto-framework">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current framework, services, tools, and application repositories and against hosted boundaries when applicable. The **Agent** has approval to perform read-only inspection and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the affected framework or application behavior and current evidence. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Before you start

Read these documents before continuing:

- [Terms](terms.md)
- [Documentation](documentation.md)

## About us

Our company is called `grimten`.

We work in the financial industry. Our speciality is creating financial applications: web applications, mobile applications, backend systems, core banking solutions, and more.

Our clients are businesses in that industry.

## A standard client

Example Client Ltd is a standard client for us. It is a payments company in the United Kingdom.

Its products cover three areas: taking payments — Pay by Bank, Direct Debit, Credit & Debit, Cash Payments; paying money out — Prepaid Cards, Cash Payout; and the data around both — Customer Account Manager, File Manager, Reporting.

A client like Example Client Ltd shows the kind of application we build: real money moving between organisations, used by the staff and the customers of those organisations, with a regulated process behind every screen.

## Why we need web prototypes

A system like Example Client Ltd's is expensive to build, slow to build, and hard to change once it is live. Money is moving, a regulator is watching, and other systems depend on it. The decisions a client makes at the start are the ones they live with for years.

Before committing to that, a client needs to know what they are buying: what the screens are, what each one asks for, and how a task runs from beginning to end.

A written specification cannot answer that, and neither can a picture of a screen. Nobody can tell whether a workflow is right by reading about it. They have to use it.

A document has a second problem. The people who have to agree hold different roles and bring different experience, and each of them reads the same sentence differently. A prototype removes the interpretation: everyone sees the same thing.

So we build the product as a web prototype first. It opens in a browser, it behaves like the real product, and the people who will actually use it can work through their own tasks in it. Nothing is at risk while they do: the data is not real, and the person signed in is a **Mock user**.

Then we change it. What would take a quarter to change in a live system takes a day here, so disagreement surfaces while it is still cheap to act on. What the client ends up with is a clear model of the product they need, and a realistic view of what building it will cost.

## The problem with web prototypes

Building a web prototype sounds like a small job. Draw a few screens, wire up a button, show it to the client.

It is not, because the client sits in the same regulated industry as we do. A prototype they can judge has to behave like the real product: a person signs in, their role decides what they may see, every action leaves a trail, and the data obeys the rules the real product would obey. A screen that only pretends answers none of the questions the client is asking.

So underneath the few screens that matter sits everything a real application needs. Sign-up, sign-in, sign-out, magic links, password recovery, password reset, password change, email change, invitation acceptance — fifteen authentication webpages before the product itself begins. Then a database with row-level access rules, roles, sessions, audit events, and a described contract for every table.

## Introducing the gPronto.Framework

To solve the problems with building web prototypes, we created the **gPronto.Framework**.

That solves that problem (and more).

## What is the gPronto.Framework?

The **gPronto.Framework** is a structured way of building **gPronto.Application**, both the **gPronto.Application.Backstage** and the **gPronto.Application.Prototype**.

To understand what the **gPronto.Framework** is, imagine how you would normally create a web prototype. You would:

1. bring out the pen and paper and start writing up the specifications;
2. get a better pen and some nicer paper, and start sketching what the different screens would look like;
3. spend many hours creating the web application;
4. send that to the client and get some feedback;
5. take that feedback and go back to step 1.

Over and over again.

The **gPronto.Framework** is our way of creating a structure around this, making it more efficient and way, way faster.

## Services and tools

**gPronto.Services** owns the shared non-browser services that support the framework and applications. It is separate from both the framework package and the application repositories.

**gPronto.Tools** owns development tools used to work with the framework, applications, and documentation. Its tools support development but are not part of an application's browser runtime.

## Applications

### What is a gPronto.Application?

To understand how it works, let's start with what the **gPronto.Framework** creates (so to speak).

The **gPronto.Framework** creates **gPronto.Applications**. A **gPronto.Application** is either a **gPronto.Application.Backstage** or a **gPronto.Application.Prototype**.

### What is a gPronto.Application.Backstage?

**gPronto.Application.Backstage** is the portal our clients work in when they work with their **gPronto.Application.Prototype**. There is exactly one, at `grimten.com`.

It brings together the **gPronto.Application.Prototype** and the work around it. From **gPronto.Application.Backstage**, a client can:

- see information about their **gPronto.Application.Prototype**;
- review planning, including the expected time and cost of building the real product;
- communicate with us and our partners;
- review details about the **gPronto.Application.Prototype** and the available options for building the real product.

### What is a gPronto.Application.Prototype?

A **gPronto.Application.Prototype** is a web application that models a proposed customer-facing financial product — an online bank, a service for transferring money between countries — before the real product is built. Its purpose is to let the client see what the final product will look like.

It is complete and fully functional: its own webpages, its own Authentication, its own data. The people it signs in as are **Mock users**, so ideas and workflows can be explored safely.

A **gPronto.Application.Prototype** does not need to be a perfect fit when it is first created. The client uses it to evaluate ideas and decide what should change: how a webpage looks, what information it collects, how it works. As that work continues, it becomes a clearer model of the product the client needs.

Each **gPronto.Application.Prototype** runs on its own subdomain of `grimten.com`.

## Basics of the gPronto.Framework

The **gPronto.Framework** is a framework for building React web applications.

A **gPronto.Application** reaches it through its **Framework link**. The **Framework link** points at the **gPronto.Framework** source, and the application imports what it needs from `@gpronto.framework`.

The **gPronto.Framework** then controls how that application is built: how a webpage is put together, which components a webpage may use, how styling is managed, and much more.

Each **gPronto.Application** has its own Supabase project, and therefore its own authentication system, its own PostgreSQL database, its own Edge Functions, and its own isolated data.

Every **gPronto.Application** is hosted on Cloudflare Pages.

Each **gPronto.Application.Prototype** sends data to **gPronto.Application.Backstage**, so that a client can follow what is happening inside their prototype.

Admission control issued by **gPronto.Application.Backstage** is planned but is not implemented. A **gPronto.Application.Prototype** can currently be opened without first signing in to **gPronto.Application.Backstage**; inside the prototype, authentication uses a separate **Mock user** identity.

## Benefits of the gPronto.Framework

We can build and change a **gPronto.Application.Prototype** or **gPronto.Application.Backstage** very quickly. The shared work is already done, so a new one starts from a working application rather than from nothing.

What we build for one client can be given to another. A webpage, a component, or a workflow created for one **gPronto.Application.Prototype** becomes available to every other one.

Quality control is centralised. A correction made once in the **gPronto.Framework** reaches every **gPronto.Application**, instead of having to be found and repeated in each of them.

Together this means we serve our clients better. They get more, they get it sooner, and what they get holds a consistent standard.

## Philosophy behind the gPronto.Framework

Five ideas decide what goes into the **gPronto.Framework** and what is left to a **gPronto.Application**.

Put as much as possible in the framework. Whatever the **gPronto.Framework** can carry, it carries, so that each **gPronto.Application** is left with as little as possible to do.

Build everything for more than one application. Anything we build is built so that every **gPronto.Application** can use it, not only the one it was first needed for.

Limit the options. The fewer choices an action offers, the faster that action is to carry out.

Keep the framework closed to the application developer. A developer building a **gPronto.Application** cannot change the **gPronto.Framework**. Every choice they face is either already made for them, or reduced to two answers, or reduced to as few answers as we can manage.

The developer should not have to think. The developer should act.

## How to learn more

[Documentation map](documentation-map.md) catalogs every document and identifies the document that owns each subject.

