import { Queue, RepeatMode } from 'distube'

const loop = (repeatMode: RepeatMode) => {
  switch (repeatMode) {
    case RepeatMode.DISABLED:
      return 'Off'
    case RepeatMode.QUEUE:
      return 'All Queue'
    case RepeatMode.SONG:
      return 'This Song'
    default:
      return 'unknown'
  }
}

const playStatus = (queue: Queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${loop(
    queue.repeatMode
  )}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

export default playStatus
