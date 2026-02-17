// ... (previous imports)
// Add these:
import { Activity, Shield, Target, Zap, Terminal, Search, Lock, Copy, CheckCircle, ExternalLink, HeartPulse, RefreshCw } from 'lucide-react'

// ... (inside component)
const [drills, setDrills] = useState<any[]>([])

// Fetch drills function
const fetchDrills = async () => {
  try {
    const res = await fetch('/api/v1/drill/intel')
    const json = await res.json()
    if (json.success) {
      setDrills(json.data)
    }
  } catch (err) {
    console.error("Failed to fetch drills")
  }
}

// Fetch on load and every 5s
useEffect(() => {
  fetchDrills()
  const interval = setInterval(fetchDrills, 5000)
  return () => clearInterval(interval)
}, [])

// ... (In render, replace DEBATES TAB content with live feed)

              {/* === DEBATES TAB === */}
              {activeTab === 'ACTIVE_DEBATES' && (
                <motion.div 
                  key="debates" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <h2 className="text-lg font-bold text-[var(--kai-primary)] uppercase flex items-center gap-2">
                      <Search className="w-4 h-4" /> Open Consensus Drills
                    </h2>
                    <div className="text-[10px] text-white/40 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> 
                      LIVE_FEED ({drills.length})
                    </div>
                  </div>

                  {/* LIVE FEED LIST */}
                  <div className="space-y-4">
                    {drills.length === 0 ? (
                      <div className="p-8 text-center text-white/20 text-xs border border-white/5 border-dashed">
                        NO_ACTIVE_DRILLS // WAITING_FOR_AGENTS
                      </div>
                    ) : (
                      drills.map((drill, i) => (
                        <div key={i} className="border border-white/10 bg-white/[0.02] p-4 hover:border-[var(--kai-primary)]/30 transition-all">
                          <div className="flex justify-between text-[9px] text-white/40 mb-2 font-mono">
                            <span>ID: {drill.debateId}</span>
                            <span>{new Date(drill.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <div className="text-sm text-white/90 font-mono mb-3">
                            <span className={drill.side === 'PRO' ? "text-[var(--kai-primary)] mr-2" : "text-[var(--nova-primary)] mr-2"}>
                              [{drill.side}]
                            </span>
                            {drill.content}
                          </div>
                          <div className="text-[9px] text-white/20 font-mono">
                            AGENT_SIG: {drill.agentId}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* ... (Keep Mock Debate Card below if needed, or remove) ... */}
                </motion.div>
              )}
// ...
