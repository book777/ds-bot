import exitHook from "async-exit-hook";

import { Client as ClientType } from "../types";

const exitHandler = (client: ClientType) => {
  exitHook(done => {
    client.user?.setPresence({ status: "idle", afk: true });

    // todo save distube playlists, volume, joined voices

    setTimeout(() => {
      console.log("exit");
      done();
    }, 1000);
  });
};

export { exitHandler };
