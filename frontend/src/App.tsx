import { useEffect, useState } from 'react'

import ServerModel from './components/ServerModel'
import StatusBanner from './components/StatusBanner'
import StatusDetails from './components/StatusDetails'
import type { P4Status } from './types/status'

const STATUS_URL = import.meta.env.VITE_STATUS_URL

function App() {
  const [status, setStatus] = useState<P4Status | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(STATUS_URL)

        if (!response.ok) {
          throw new Error('Failed to fetch status')
        }

        const data: P4Status = await response.json()

        setStatus(data)
      } catch {
        setError(true)
      }
    }

    fetchStatus()
  }, [])

  if (error) {
    return (
      <main className="feedback-screen">
        Could not load server status.
      </main>
    )
  }

  if (!status) {
    return (
      <main className="feedback-screen">
        Loading...
      </main>
    )
  }

  return (
    <main className={`dashboard ${status.online ? 'online' : 'offline'}`}>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>
            <span>P4</span>TD
          </h1>
        </header>

        <div className="dashboard-content">
          <ServerModel online={status.online} />
          

          <div className="dashboard-info">
            <StatusBanner online={status.online} />
            <StatusDetails status={status} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default App