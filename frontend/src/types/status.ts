export interface P4Status {
  online: boolean
  latestChange?: number
  latestChangeUser?: string
  latestChangeDescription?: string
  latestChangeTime?: string
  lastHeartbeat?: string
  message?: string
}