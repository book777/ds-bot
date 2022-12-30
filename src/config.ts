import { RepeatMode } from 'distube'

export default {
  prefix: '?',
  token: 'ODkxNDE2OTk4NTAyODkxNTcw.GKRXvL.uicg82QQIu9loqdd9A-5n8O751YBZ6xmQlGtAU',
  volume: {
    default: 12,
    min: 0,
    max: 120
  },
  repeat: {
    default: RepeatMode.QUEUE
  },
  emoji: {
    play: '▶️',
    stop: '⏹️',
    queue: '📄',
    success: '☑️',
    repeat: '🔁',
    error: '❌'
  }
}
