# Flarelytics

[![](https://img.shields.io/badge/Built%20on-Cloudflare%20Workers-orange)](https://workers.cloudflare.com)
[![TypeScript](https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/--F7DF1E?logo=javascript&logoColor=000)](https://www.javascript.com/)
[![License](https://img.shields.io/badge/Licence-GPLv3%20-blue.svg)](./LICENSE)

Web analytics project to track the time visitors spend on the website.

> At this moment, the project is under active development and is not ready for production use.

Built on top of Cloudflare Workers and PlanetScale. Currently, supports tracking for a *single domain* only.

Mainteined by [Google Developer Student Club at Budapest University of Technology and Economics](https://gdsc.community.dev/budapest-university-of-technology-and-economics/).

Project lead: [@VMois](https://github.com/VMois).

## Why this project?

Being able to tell if people spend time reading your content (e.g. blog article) is crucial and makes you feel great too. Unfortunately, the popular web analytics services are violating visitors' privacy (e.g., Google Analytics is illegal in some EU states) or do not have a metric that checks how long people spend reading (e.g., [Plausible for single page visits](https://github.com/plausible/analytics/discussions/863)).

In addition, due to the increased ad/tracker blockers, even privacy-friendly web analytics tools might be blocked. One of the solutions is to deploy your custom web analytics solution to reduce the number of blocks. [This article](https://www.ctrl.blog/entry/ctrl-analytics.html) dives into pros and cons of self-hosted web analytics.

The Flarelytics project was born in response to the need for a self-deployable, privacy-friendly web analytics service to collect the time readers spend on each webpage.

## How it works?

The project consists of two parts:

- [Browser script](./analytics) - a JS script that needs to be embedded to the website; it sends events when visitors open and close the website.
- [Backend](./src) - a TypeScript code that runs on Cloudflare Worker with a simple HTTP API.

[This article](https://vmois.dev/build-web-analytics-project-from-scratch/) explains how the browser script works.

In short, every time a visitor opens a webpage (that has Flarelytics tracking script), the browser script generates a unique UUID and sends a request to the backend called **event**. The backend stores the event in the database. The browser script sends another event to the backend when the visitor closes the webpage. When the user of Flarelytics (website owner) visits the dashboard, the backend will calculate the time spent on each webpage by the visitor.

## Contributing

We welcome contributions from the community to help improve and expand this project. Before you start, please take a moment to review the following guidelines to ensure a smooth and productive collaboration.

### How to contribute

0. **Select an Issue**: You can find [open issues](https://github.com/gdsc-bme/flarelytics/issues) (tasks) that need to be done, if you are interested, you can ask to be assigned to this issue and start working on it. In addition to the open issues, we also have [a project board](https://github.com/orgs/gdsc-bme/projects/1) (that also contains the open issues) where you can see the progress of the project.

1. **Fork the Repository**: follow [Github guide](https://docs.github.com/en/get-started/quickstart/fork-a-repo) on setting up your fork.

2. **Set Up the Development Environment**: Follow the instructions in the ["Development" section](#development) of the README to set up your development environment, including installing the necessary dependencies.

3. **Follow Github Flow to Add Code Changes**: more details in [Github guide](https://docs.github.com/en/get-started/quickstart/github-flow).

## Development

In this section, you will find instructions on how to set up the development environment.

### 1. Prerequisites

Do the steps below to set up the development environment:

0. Follow instructions in [How to contribute](#how-to-contribute) section.
1. Create free [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages).
2. Create free [PlanetScale account](https://planetscale.com).
3. Install Node.js **v18** (at least), [pnpm](https://pnpm.io/) (faster equivalent of npm), and (*optional*) [nvm](https://github.com/nvm-sh/nvm) (if you are using Linux, MacOS or Windows WSL).
4. Run `pnpm install` (or equivalent) to install necessary packages.
5. Install PlanetScale [pscale CLI](https://planetscale.com/docs/concepts/planetscale-environment-setup) tool and log in to your account.
6. In PlanetScale create a database called `flarelytics` with two branches `main` and `dev`.
Consider `main` to be a production. **Always develop on `dev` branch!**
7. Create a Cloudflare Worker function in "Workers & Pages" menu called `flarelytics-dev`.
8. Create `.dev.vars` file for development secrets. For more info, read [Environment variables](#environment-variables) section.
9. In PlanetScale, you can create a new connection string to the `dev` branch of the database. Follow tutorial [here](https://planetscale.com/docs/concepts/connection-strings#creating-a-password). Copy `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD` to `.dev.vars` file. This will be used for local development. Keep the credentials safe!
10. (*optional*) If you plan to deploy to Cloudflare Workers to test your changes, make sure to add `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD` to the **secret** environment variables of the `flarelytics-dev` Worker in the web dashboard. The tutorial can be found [here](https://developers.cloudflare.com/workers/configuration/secrets/).

### 2. Environment variables

For local development, secrets are stored in `.dev.vars` file and non-sensitive variables can be defined in `wrangler.toml` file. The format of `.dev.vars` file is as follows:

```
DATABASE_HOST=<your-value-here>
DATABASE_USERNAME=<your-value-here>
DATABASE_PASSWORD=<your-value-here>
```

For production and dev, secrets need to be defined in Cloudflare Workers. Either with UI, or using `wrangler` tool.

### 3. Setting up the database

If you completed the steps from [Prerequisites](#prerequisites) section, you should have a database called `flarelytics` with two branches `main` and `dev`. The `dev` branch is used for development and `main` branch is used for production.

To setup a **dev** database, run `pnpm run setup-test-db` command. It will create necessary tables and test data in the `dev` branch of the `flarelytics` database.

### 4. Running locally

To run the project locally, run `pnpm run dev` command. It will start a local Workers server and use environment variables from `wrangler.toml` file and secrets from `.dev.vars` file.

You will see the following output:

```bash
> flarelytics@0.2.0 dev /Users/vmois/Projects/flarelytics
> wrangler dev src/index.ts
Using vars defined in .dev.vars
Your worker has access to the following bindings:
- Vars:
  - DATABASE_HOST: "(hidden)"
  - DATABASE_USERNAME: "(hidden)"
  - DATABASE_PASSWORD: "(hidden)"
⎔ Starting local server...
[mf:inf] Ready on http://0.0.0.0:8787
[mf:inf] - http://127.0.0.1:8787
[mf:inf] - http://192.168.1.97:8787
```

If you navigate to `http://localhost:8787/stats` you should see the following output:

![Test stats](./images/stats-test-setup.png)


### 5. Deploying to Cloudflare Workers

Currently, we assume that you want to deploy Flarelytics to a dev environment and it is not intended for production use case (yet). To do that, run `npm run deploy-dev` command. It will deploy the project to the `flarelytics-dev` Worker. You can find URL to access the Worker in the web dashboard. **Be careful as now your project is live and can be accessed by others!**

## Where the project name comes from?

The project name was created from simple concatenation CloudFLARE + AnaLYTICS = Flarelytics.
