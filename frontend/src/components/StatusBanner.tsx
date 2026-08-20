interface StatusBannerProps {
  online: boolean
}

function StatusBanner({ online }: StatusBannerProps) {
  return (
    <section className="status-banner">
      <div className="status-banner-label">
        <span className="status-dot" />
        <span>Status:</span>
      </div>

      <strong className="status-value">
        {online ? 'Online' : 'Offline'}
      </strong>
    </section>
  )
}

export default StatusBanner