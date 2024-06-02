
class Success {
    playerKey;
    attempts;
    createdAt;
    gameMode;

    constructor(options) {
        const {playerKey, attempts, gameMode, createdAt} = options;

        this.playerKey = playerKey;
        this.attempts = attempts;
        this.gameMode = gameMode;
        this.createdAt = createdAt || new Date();
    }
}

export default Success;