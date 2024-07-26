# Contribution guide

This document contains notes on developing this JavaScript package. Please read the [SheffieldMLTracking contributing guide](https://github.com/SheffieldMLtracking/.github/blob/main/CONTRIBUTING.md) first.

# Architecture

This code uses the [React](https://react.dev/) JavaScript framework. Please see the architecture Miro board.

# Development

This section describes the development environment used to work on this software.

This directory contains a JavaScript package (defined by `package.json`)

## Installation

Requirements:

* Node Package Manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

To install the dependencies for this package:

```bash
cd ./frontend/
# Install package dependencies based on package.json
npm install
```

## Usage

The development environment is defined by the `dev` configuration in `package.json` and uses the [Vite](https://vitejs.dev/guide/#index-html-and-project-root) tool.

```
# Run the development environment
npm run dev
```

## Vite

[Vite](https://vitejs.dev/) provides automatic code reloading using Hot Module Replacement (HMR) and some code analysis using ESLint rules. It uses `index.html` as the [home page](https://vitejs.dev/guide/#index-html-and-project-root).

There is a configuration file for Vite at `frontend/vite.config.js` that specifies some proxy settings so that we can access the backend via the frontend testing app (which defaults to port 5173.)