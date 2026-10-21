# Supabase Keep Alive — recovery and configuration

This operational workflow calls POST /rest/v1/rpc/keep_alive every 12 hours,
and also supports a manual run from **Actions → Supabase Keep Alive → Run workflow**.

A successful pull-request CI build **does not** prove this remote Supabase
request works: the main CI tests only the frontend.

## Findings on 2026-10-21

The connected Supabase management API reported two inactive projects:

| Project | Ref | Status |
| --- | --- | --- |
| Sales Dashboard | bfqitbkmuskkfopxwocx | INACTIVE |
| Sales Dashboard auth | dlbsdqnaqwksbuzxszsf | INACTIVE |

The previous GitHub workflow targeted Sales Dashboard auth. GitHub Actions
reported a DNS failure for that host on September 6 and October 21, 2026,
after previously receiving HTTP 200 on September 5.

**Changing the endpoint or API key does not reactivate a paused project.**

## Restore and identify the right project

1. In the [Supabase project dashboard](https://supabase.com/dashboard/projects),
   identify which project the deployed frontend actually uses. Compare its
   deployment variable VITE_SUPABASE_URL; do not choose based on project name.
2. If that project is paused, restore it in Supabase (Resume project).
   Free-plan restoration has a limited window; see
   [project pausing](https://supabase.com/docs/guides/platform/free-project-pausing).
3. Verify that the REST API responds, and inspect the public.keep_alive()
   function and its permissions before continuing. Ensure it has no dangerous
   side effects; in particular, review any SECURITY DEFINER configuration.
4. Confirm that this is the same project the frontend is using.

## Configure GitHub Actions

Open **Repository → Settings → Secrets and variables → Actions**.

- Add a repository **variable** SUPABASE_URL with the selected active project's
  HTTPS API origin, without a trailing REST path. Example:
  https://<project-ref>.supabase.co
- For compatibility, an existing Actions **secret** SUPABASE_URL is accepted
  when the variable is absent. The repository variable takes precedence.
- Set the Actions **secret** SUPABASE_ANON_KEY to that same project's
  **legacy anon JWT key**. Never use service_role or a secret API key.
  This workflow sends an Authorization Bearer token; the configuration above
  expects the legacy JWT-based anon key, not a new sb_publishable_ key.
- Keep all secrets out of commits and issue/PR comments.

## Validate before and after merging

1. In the Actions UI, manually run Supabase Keep Alive on the **new PR branch**
   after setting the values above.
2. Inspect the ping job logs:
   - 2xx means the RPC call completed successfully.
   - DNS/TLS failure means you should verify active project state and hostname.
   - 401/403 means credentials or EXECUTE permissions need review.
   - 404 means the URL or RPC function is missing.
3. After merging, ensure the workflow is enabled on the default branch and
   check that the next scheduled run completes.

**Limitations:** Supabase free-plan activity checks are not an uptime guarantee;
automated keep-alive pings may not prevent pausing. GitHub may also disable
scheduled workflows in inactive public repositories. For required production
uptime, use a plan with appropriate availability guarantees.
