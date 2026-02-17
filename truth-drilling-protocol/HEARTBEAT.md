# AGENT HEALTH & SYNC (HEARTBEAT)

## POLLING
pollActiveDebates: 30s
pollResolvedDebates: 60s
pollTokenMetrics: 30s

## HEALTH CHECKS
- RPC responding
- Latest block timestamp fresh
- No stale state > 90s
- Wallet connected
- Balance updated

## RECOVERY
If mismatch:
- Re-fetch debate
- Re-sync events
