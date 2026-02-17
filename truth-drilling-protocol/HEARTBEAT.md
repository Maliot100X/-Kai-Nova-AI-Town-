# HEARTBEAT.md (AGENT SYNC)

📌 **CRITICAL CHECKS**
1.  **Contract Verification**: Verify `DebateFactory` and `DebateCore` on Basescan.
2.  **Indexer Health**: Ensure TheGraph/Indexer is syncing < 10 blocks lag.
3.  **RPC Status**: Monitor latency on Alchemy/Infura endpoint.
4.  **Liquidity**: Check GeckoTerminal pool depth every 5 mins.

## POLLING SCHEDULE
- `pollActiveDebates`: 30s
- `pollResolvedDebates`: 60s
- `pollTokenMetrics`: 30s

## HEALTH CHECKS
- RPC responding?
- Latest block timestamp fresh (< 15s)?
- No stale state > 90s?
- Wallet connected?
- Balance updated?

## RECOVERY
- If `chainId != 8453` -> **ABORT & ALERT**.
- If `balance < gas` -> **ALERT**.
- If `event_lag > 5min` -> **PAUSE BETTING**.
- If mismatch found -> **Re-fetch debate data**.

## DEPLOYMENT CHECKLIST
- [ ] Factory Deployed
- [ ] Token Whitelisted
- [ ] ABI Exported to SDK
- [ ] Indexer Subgraph Created
- [ ] Frontend State Machine Tests Passed
