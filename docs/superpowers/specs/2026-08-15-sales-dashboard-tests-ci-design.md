# Sales Dashboard Tests & CI Design

## Goal

Improve the public technical verifiability of `bakadja/sales-dashboard` for recruiting use, especially the FinMent Junior Web Entwickler application, by adding a small but credible automated test suite and a real GitHub Actions CI pipeline without changing product behavior.

## Scope

### In scope
- Add Vitest, React Testing Library, and jsdom.
- Add focused automated tests for existing behavior.
- Add a CI workflow that runs type checking, linting, tests, and production build.
- Preserve the existing Supabase Keep Alive workflow as a separate automation.
- Update the README to document testing, CI, quality tooling, and the existing live deployment.
- Keep all changes on `chore/add-tests-ci` and submit them through a pull request to `main`.

### Out of scope
- Product feature changes.
- Broad refactoring unrelated to testability.
- End-to-end browser tests.
- Replacing Supabase, React Router, Vite, SonarQube, or current architecture.
- Claiming CI/CD or test coverage that is not actually present.

## Architecture

The existing application remains structurally unchanged. Testing is added alongside the current source tree.

Expected additions:

- `vitest.config.ts` for Vitest + jsdom configuration.
- `src/test/setup.ts` for React Testing Library setup and shared test environment configuration.
- Co-located or clearly named test files for selected components/routes.
- `.github/workflows/ci.yml` for continuous integration.

The existing `.github/workflows/supabase-keepalive.yml` remains independent from CI.

## Test Strategy

The suite should be intentionally small and behavior-focused.

### ProtectedRoute
Verify three meaningful states:
1. `session === undefined` shows the loading state.
2. an authenticated session renders the child content.
3. no session redirects to `/signin`.

`useAuth` should be mocked at the module boundary rather than requiring a live Supabase session.

### Form
Verify stable user-visible behavior without depending on Supabase network access:
1. rep users see their own name as a read-only field.
2. admin/non-rep users see selectable sales reps.
3. invalid submitted user data produces the expected validation error.

Supabase insert calls should be mocked so the test remains deterministic.

### Dashboard
Add one focused test only if it can be done without brittle mocking. The useful target is verifying that fetched sales metrics are rendered/passed to the chart while Supabase access is mocked. If this requires excessive implementation coupling, omit it in favor of stronger tests for `ProtectedRoute` and `Form`.

## CI Pipeline

Create `.github/workflows/ci.yml` triggered on pushes to the feature branch/main and on pull requests targeting `main`.

Run on Ubuntu with the project's supported Node version. Steps:

1. Checkout repository.
2. Set up Node with npm cache.
3. `npm ci`
4. `npm run typecheck`
5. `npm run lint`
6. `npm run test:run`
7. `npm run build`

The workflow must not require Supabase production secrets because automated tests should mock network/service boundaries and Vite build should not need a live backend.

## Package Scripts

Add scripts with clear intent:

- `test`: interactive/watch-friendly Vitest command.
- `test:run`: one-shot CI-safe test command.
- optional `test:coverage` only if coverage support is added and useful immediately.

Existing scripts (`typecheck`, `build`, `lint`, `sonar`, `quality`) remain intact unless a minimal compatibility adjustment is required.

## README Changes

Document only verifiable capabilities:

- automated tests with Vitest + React Testing Library;
- CI with GitHub Actions;
- quality checks with TypeScript, ESLint, and SonarQube;
- existing Supabase Keep Alive workflow as automation, not as CI;
- existing live demo URL.

Add a CI badge only after the workflow file exists. Do not claim comprehensive coverage or production-grade testing.

## Error Handling & Isolation

Tests must not access real Supabase resources. Service boundaries are mocked. Failed validation and rejected service operations should be represented through existing user-visible error behavior rather than new application behavior.

No production secrets should be introduced into tests or CI.

## Success Criteria

The change is complete when:

- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run test:run` passes.
- `npm run build` passes.
- GitHub Actions CI runs these checks on the pull request and is green.
- The README accurately documents the new verifiable delivery evidence.
- A pull request from `chore/add-tests-ci` to `main` exists, making the implementation and CI checks publicly reviewable.

## Recruiting Value

This change directly addresses the current 100Hires weakness around "verifiable technical delivery": the repository will expose a live demo, automated tests, a visible CI workflow, quality tooling, and a reviewable pull request without overstating experience or adding artificial portfolio claims.
