# CSU-SGA

## Render auto-deploy troubleshooting

If Render is not detecting your recent commits, run:

```bash
npm run check:render
```

This verifies:
- your current branch,
- whether the branch has an upstream tracking branch,
- whether a Git remote is configured,
- and whether local commits have been pushed.

### Common causes
1. Commits were made locally but not pushed to the remote.
2. The Render service is watching a different branch than the one you pushed.
3. Auto-deploy is disabled in Render service settings.
4. The Render service is connected to a different repository.
