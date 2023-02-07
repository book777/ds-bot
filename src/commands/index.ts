import { Command } from "../types";
import autoplay from "./autoplay";
import filters from "./filters";
import forward from "./forward";
import help from "./help";
import join from "./join";
import leave from "./leave";
import nowPlaying from "./now_playing";
import pause from "./pause";
import play from "./play";
import playSkip from "./play_skip";
import playTop from "./play_top";
import previous from "./previous";
import queue from "./queue";
import repeat from "./repeat";
import resume from "./resume";
import rewind from "./rewind";
import seek from "./seek";
import shuffle from "./shuffle";
import skip from "./skip";
import skipTo from "./skip_to";
import stop from "./stop";
import volume from "./volume";

const commands = [
  autoplay,
  filters,
  forward,
  help,
  join,
  leave,
  nowPlaying,
  pause,
  play,
  playSkip,
  playTop,
  previous,
  queue,
  repeat,
  resume,
  rewind,
  seek,
  shuffle,
  skip,
  skipTo,
  stop,
  volume
] as Command[];

export { commands };
