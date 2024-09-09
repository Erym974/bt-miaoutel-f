import { PlayerType } from "./PlayerType";
import { TrackType } from "./TrackType";

export type PartyType = {
    id: string,
    host: PlayerType,
    players: PlayerType[],
    currentTrack: TrackType,
    currentRound: PlayerType[],
    currentRoundScore: Record<string, number>,
    scoreboard: PlayerType[],
    roundFinished: boolean,
    gameState: string,
}