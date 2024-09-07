import { PlayerType } from "./PlayerType";
import { TrackType } from "./TrackType";

export type PartyType = {
    id: string,
    host: PlayerType,
    hostLastConnection: number, // -1 Connected : 120 When disconnected
    players: PlayerType[],
    currentTrack: TrackType | null,
    currentRound: PlayerType[],
    roundFinished: boolean,
    gameState: string,
}