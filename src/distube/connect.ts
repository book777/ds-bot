import { SoundCloudPlugin } from "@distube/soundcloud";
import { SpotifyPlugin } from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { DisTube } from "distube";

import config from "../config";
import { Client as ClientType } from "../types";
import { playStatus } from "../util/play_status";

const distubeConnect = (client: ClientType) => {
  const distube = new DisTube(client, {
    leaveOnFinish: false,
    leaveOnStop: false,
    leaveOnEmpty: false,
    emitNewSongOnly: true,
    savePreviousSongs: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
      new SpotifyPlugin({
        emitEventsAfterFetching: true
      }),
      new SoundCloudPlugin(),
      new YtDlpPlugin({ update: true })
    ],
    ytdlOptions: {
      liveBuffer: 30,
      dlChunkSize: 5242880 // 5MB
    },
    searchCooldown: 20,
    emptyCooldown: 20,
    searchSongs: 5,
    nsfw: true
  });
  distube
    .on("playSong", (queue, song) =>
      // todo add silent option
      queue?.textChannel?.send({
        content: `${config.emoji.play} | Play now\n${playStatus(queue)}`,
        embeds: [
          {
            title: song.name,
            url: song.url,
            color: 15548997, // Red from https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812s
            description: `Duration ${song.formattedDuration}\nRequested by: ${song.user}`
          }
        ]
      })
    )
    .on("addSong", (queue, song) =>
      queue.textChannel?.send(
        `${config.emoji.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
      )
    )
    .on("addList", (queue, playlist) =>
      queue.textChannel?.send(
        `${config.emoji.success} | Added \`${playlist.name}\` playlist (${
          playlist.songs.length
        } songs) to queue\n${playStatus(queue)}`
      )
    )
    .on("error", (channel, e) => {
      if (channel) channel.send(`${config.emoji.error} | An error encountered: ${e.toString().slice(0, 1974)}`);
      console.error(e);
    })
    .on("empty", async channel => {
      await channel.stop();
      console.log("Voice channel is empty! Leaving the channel...");
    })
    .on("searchNoResult", (message, query) =>
      message.channel.send(`${config.emoji.error} | No result found for \`${query}\`!`)
    )
    .on("finish", queue => queue.textChannel?.send("Finished!"));

  client.distube = distube;
};

export { distubeConnect };
