declare const message: typeof import("danger").message;

export const testGameOwnedDangerRule = {
  async check() {
    message("Game-owned Danger extension loaded.");
  },
};
