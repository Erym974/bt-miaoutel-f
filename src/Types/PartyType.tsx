import { PlayerType } from "./PlayerType";
import { TeamType } from "./TeamType";
import { TrackType } from "./TrackType";

export enum GameState {
    Game = 'Game',
    Lobby = 'Lobby',
    Scoreboard = 'Scoreboard',
}

export enum GameMode {
    Individual = 'Individual',
    Team = 'Team',
}

export type PartyType = {
    id: string,
    host: PlayerType,
    players: PlayerType[],
    currentTrack: TrackType,
    currentRound: PlayerType[],
    currentRoundScore: Record<string, number>,
    scoreboard: PlayerType[],
    roundFinished: boolean,
    gameState: GameState,
    mode: GameMode,
    teams: TeamType[],
}