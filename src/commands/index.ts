import autoplay from './autoplay'
import filters from './filters'
import forward from './forward'
import help from './help'
import join from './join'
import leave from './leave'
import nowplaying from './nowplaying'
import pause from './pause'
import play from './play'
import playskip from './playskip'
import playtop from './playtop'
import queue from './queue'
import repeat from './repeat'
import resume from './resume'
import rewind from './rewind'
import seek from './seek'
import shuffle from './shuffle'
import skip from './skip'
import skipto from './skipto'
import stop from './stop'
import volume from './volume'
import { Command } from '../types'

const commands = [
  autoplay,
  filters,
  forward,
  help,
  join,
  leave,
  nowplaying,
  pause,
  play,
  playskip,
  playtop,
  queue,
  repeat,
  resume,
  rewind,
  seek,
  shuffle,
  skip,
  skipto,
  stop,
  volume
] as Command[]

export default commands
