# AGENTS.md

## Project
- Kafka playground for experimenting with kafkajs
- Package manager: `pnpm@10.32.1` (set via `packageManager` field)
- Dependency: `kafkajs@^2.2.4`

## Commands
- Install: `pnpm install`
- Add dependency: `pnpm add <pkg>`

## Structure
- `admin.js` — placeholder for Kafka admin client code (currently empty)
- No tests, no build step, no TypeScript

## Notes
- Plain JS project — no tsconfig, no build pipeline
- No Kafka broker bundled; a running Kafka instance is required for any kafkajs code to work

## OpenCode Workflow
- Ask before making file changes in this repo
- Ask for clarification when requirements are ambiguous or incomplete
