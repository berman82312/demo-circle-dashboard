# Payments dashboard demo

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prerequisite

It is advised to run this project using `node >= 20`. Though it should be fine using lower version, the project is tested under node 20 environment.

This project should be served along side with the `server` project. Please make sure your `server` is running.

## Initial setup

Generate a `.env` file by copying the `.env.example`.

```bash
cp .env.example .env
```

Modify the server URL in the `.env` file if needed.

## Getting Started

First thing first, install the packages.

```bash
npm i
```

You can run this project under dev mode or prod mode.

### Dev mode

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Prod mode

First, build the project:

```bash
npm run build
```

Second, start the server:

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
