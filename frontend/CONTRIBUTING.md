# Contribution guide

This document contains notes on developing this package. Please read the [SheffieldMLTracking contributing guide](https://github.com/SheffieldMLtracking/.github/blob/main/CONTRIBUTING.md) first.

# Architecture

This code uses the [React](https://react.dev/) JavaScript framework 

# Development

This section describes the development environment used to work on this software.

## Vite

[Vite](https://vitejs.dev/) with Hot Module Replacement (HMR) and some code analysis using ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh