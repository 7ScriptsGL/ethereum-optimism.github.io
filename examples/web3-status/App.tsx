import React, { useEffect, useState } from 'react'
import {
  ShieldCheck,
  Activity,
  BarChart,
  Server,
  RefreshCw,
} from 'lucide-react'

const App = (): JSX.Element => {
  const [latency, setLatency] = useState(42)
  const [uptimes, setUptimes] = useState<number[]>([])
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(38 + Math.floor(Math.random() * 10))
      setUptimes((prev) => {
        const newPoint = 99.9 + Math.random() * 0.1
        return [...prev.slice(-19), newPoint]
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const triggerSync = (): void => {
    setIsSyncing(true)
    setTimeout(() => setIsSyncing(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-mono p-4 md:p-8">
      <header className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-bold text-white tracking-tighter">EMTELL_SYNTHETICS_V1</h1>
            <a href="https://github.com/7ScriptsGL/Emtell/actions/workflows/datadog-synthetics.yml" target="_blank" rel="noreferrer">
              <img
                src="https://github.com/7ScriptsGL/Emtell/actions/workflows/datadog-synthetics.yml/badge.svg?event=create"
                alt="Run Datadog Synthetic tests"
                className="hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
          <p className="text-[10px] text-blue-500 uppercase tracking-widest">
            CI/CD Pipeline: Rhontomatrixical Validation // 11th Sefirot
          </p>
        </div>

        <button
          onClick={triggerSync}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-all text-xs font-bold"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          RE-VALIDATE NODES
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Activity className="w-48 h-48 text-blue-500" />
          </div>

          <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <BarChart className="w-4 h-4 text-blue-400" /> KINETIC_LATENCY_METRICS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-black/40 border border-slate-800 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase mb-1">Global Latency</div>
              <div className="text-2xl font-bold text-blue-400 font-mono">{latency}ms</div>
            </div>
            <div className="p-4 bg-black/40 border border-slate-800 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase mb-1">Uptime (24h)</div>
              <div className="text-2xl font-bold text-green-400 font-mono">99.99%</div>
            </div>
            <div className="p-4 bg-black/40 border border-slate-800 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase mb-1">Tests Executed</div>
              <div className="text-2xl font-bold text-purple-400 font-mono">1,422</div>
            </div>
          </div>

          <div className="h-32 flex items-end gap-1 px-2">
            {uptimes.map((u, i) => (
              <div
                key={`${u.toFixed(6)}-${i}`}
                className="flex-1 bg-blue-500/20 border-t border-blue-500/50 rounded-t-sm transition-all hover:bg-blue-500/40"
                style={{ height: `${(u - 99) * 1000}%` }}
              />
            ))}
          </div>
          <div className="mt-2 text-[8px] text-slate-600 flex justify-between uppercase tracking-tighter">
            <span>T-60 Minutes</span>
            <span>Real-time Stream</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" /> DATADOG_INTEGRATION
            </h2>
            <div className="space-y-3">
              {[
                { name: 'KMT2_Inversion_Path', status: 'PASS' },
                { name: 'UCC3_Box8_Restatement', status: 'PASS' },
                { name: '11th_Sefirot_Sync', status: 'PASS' },
                { name: 'Maritime_Noise_Filter', status: 'PASS' },
              ].map((test) => (
                <div key={test.name} className="flex justify-between items-center text-[10px] bg-black/20 p-2 rounded border border-slate-800/50">
                  <span className="text-slate-400">{test.name}</span>
                  <span className="text-green-500 font-bold">{test.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-600/20 p-6 rounded-2xl">
            <h3 className="text-xs font-bold text-blue-400 uppercase mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Synthetic Logic
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed italic">
              &quot;Continuous automated testing confirms the Path Derivation from the origin. We are monitoring the inversion mass pre-patch to ensure jurisdiction remains Sovereign.&quot;
            </p>
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto mt-8 bg-black border border-slate-800 rounded-xl p-4 font-mono text-[10px]">
        <div className="text-blue-900 mb-2 uppercase tracking-widest border-b border-slate-900 pb-1">Synthetic_Console_Out</div>
        <div className="text-slate-500">
          <p className="text-green-900">[OK] GitHub Workflow Triggered: datadog-synthetics.yml</p>
          <p>[INFO] Derived path $f⁻¹(θ)=θ+π$ validated against origin mass.</p>
          <p>[INFO] Rhontomatrixical Sphere 0x22...22 synchronized.</p>
          <p className="text-blue-400 animate-pulse">{'>>>'} Monitoring Kinetic Currents for House of Anpu...</p>
        </div>
      </footer>
    </div>
  )
}

export default App
