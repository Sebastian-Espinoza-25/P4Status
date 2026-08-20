import {
  Clock,
  FileText,
  GitCommitHorizontal,
  HeartPulse,
  User,
} from 'lucide-react'

import type { P4Status } from '../types/status'

interface StatusDetailsProps {
  status: P4Status
}

function formatDate(timestamp?: string) {
  if (!timestamp) {
    return 'Unavailable'
  }

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Mexico_City',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}

function StatusDetails({ status }: StatusDetailsProps) {
  return (
    <section className="status-details">
      <div className="detail-row">
        <FileText className="detail-icon" />

        <div>
          <span className="detail-label">Description</span>
          <p className="detail-value">
            {status.latestChangeDescription ?? 'Unavailable'}
          </p>
        </div>
      </div>

      <div className="detail-row">
        <User className="detail-icon" />

        <div>
          <span className="detail-label">User</span>
          <p className="detail-value">
            {status.latestChangeUser ?? 'Unavailable'}
          </p>
        </div>
      </div>

      <div className="detail-row">
        <GitCommitHorizontal className="detail-icon" />

        <div>
          <span className="detail-label">Change</span>
          <p className="detail-value">
            {status.latestChange
              ? `#${status.latestChange}`
              : 'Unavailable'}
          </p>
        </div>
      </div>

      <div className="detail-row">
        <Clock className="detail-icon" />

        <div>
          <span className="detail-label">Latest Change</span>
          <p className="detail-value">
            {formatDate(status.latestChangeTime)}
          </p>
        </div>
      </div>

      <div className="detail-row">
        <HeartPulse className="detail-icon" />

        <div>
          <span className="detail-label">Last Heartbeat</span>
          <p className="detail-value">
            {formatDate(status.lastHeartbeat)}
          </p>
        </div>
      </div>
    </section>
  )
}

export default StatusDetails