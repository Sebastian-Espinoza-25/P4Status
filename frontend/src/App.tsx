import { useEffect, useState } from 'react'

interface P4Status {
  online: boolean
  latestChange?: number
  latestChangeUser?: string
  latestChangeDescription?: string
  latestChangeTime?: string
  lastHeartbeat?: string
  message?: string
}

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
    return <p>Could not load server status.</p>
  }

  if (!status) {
    return <p>Loading...</p>
  }

  return (
    <main>
      <h1>P4Status</h1>

      <p>{status.online ? 'Online' : 'Offline'}</p>

      {status.latestChange && (
        <>
          <p>Change #{status.latestChange}</p>
          <p>User: {status.latestChangeUser}</p>
          <p>Description: {status.latestChangeDescription}</p>
          <p>Latest change: {status.latestChangeTime}</p>
          <p>Last heartbeat: {status.lastHeartbeat}</p>
        </>
      )}

      {status.message && <p>{status.message}</p>}
    </main>
  )
}

export default App