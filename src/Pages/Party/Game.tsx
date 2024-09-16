import { useEffect, useRef, useState } from "react";
import { PlayerType } from "../../Types/PlayerType";
import ReactPlayer from "react-player";

import "./game.scss";
import { GameMode, PartyType } from "../../Types/PartyType";
import { socket } from "../../socket";

import { FaPlay, FaPause } from "react-icons/fa";
import { AiOutlineDisconnect } from "react-icons/ai";
import { CiVolumeHigh } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import ScoreboardTeam from "../../Component/ScoreboardTeam";
import { TeamType } from "../../Types/TeamType";

interface GameProps {
  partyDatas: PartyType;
  currentPlayer: PlayerType;
}

export default function Game({ partyDatas, currentPlayer }: GameProps) {
  const [volume, setVolume] = useState(25);
  const playerRef = useRef<ReactPlayer>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (playerRef.current) {
      setDuration(playerRef.current.getDuration());
    }
  }, [playerRef.current])

  useEffect(() => {
    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (document.activeElement instanceof HTMLElement) {
          (document.activeElement as HTMLElement).blur();
        }
        Buzz();
      }
    });

    socket.on("sync_video", (party: PartyType) => {
      playerRef.current?.seekTo(party.currentTrack?.currentTime ?? 0);
    });

    socket.on("player_disconnect", (player: PlayerType) => {
      toast.error(`${player?.username} a été déconnecté de la partie`);
    });
    socket.on("player_connected", (player: PlayerType) => {
      toast.success(`${player?.username} reconnecté`);
    });

    return () => {
      document.removeEventListener("keyup", (e: KeyboardEvent) => {
        if (e.code === "Space") {
          Buzz();
        }
      });

      socket.off("sync_video");
      socket.off("player_disconnect");
      socket.off("player_connected");
    };
  }, []);

  const UpdateScore = (player: PlayerType, amount: number, inRound: boolean = false) => {
    socket.emit("update_score", {
      id: partyDatas.id,
      playerId: player.id,
      amount,
      inRound,
    });
  };

  const parseTime = (time: number) => {
    // return time in seconds to hh::mm:ss if there a hour or mm:ss time
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const durationHours = Math.floor(duration / 3600);

    return `${durationHours > 0 ? hours + ':' : ''}${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  const Buzz = () => {
    socket.emit("buzz", { id: partyDatas.id });
  };

  const TogglePlaying = () => {
    if (partyDatas.roundFinished) return;
    socket.emit("toggle_playing", {
      id: partyDatas.id,
      trackTime: playerRef.current?.getCurrentTime(),
    });
  };

  const EndGame = () => {
    socket.emit("end_game", { id: partyDatas.id });
  };

  const SkipRound = () => {
    socket.emit("skip_round", { id: partyDatas.id });
  }

  const ToggleRound = () => {
    socket.emit(partyDatas.roundFinished ? "resume_turn" : "end_turn", {
      id: partyDatas.id,
    });
  };

  const UpdateTracker = (playedSeconds: number) => {
    setCurrentTime(playedSeconds);
    if (
      partyDatas?.currentTrack?.isPlaying &&
      partyDatas.host.id === currentPlayer.id
    ) {
      socket.emit("sync_video", {
        id: partyDatas.id,
        currentTime: playedSeconds,
      });
    }
  };

  const UpdateTimeline = (playedSeconds: number) => {
    if (
      partyDatas?.currentTrack?.isPlaying &&
      partyDatas.host.id === currentPlayer.id
    ) {
      setCurrentTime(playedSeconds);
      socket.emit("edit_timeline", {
        id: partyDatas.id,
        currentTime: playedSeconds,
      });
      playerRef.current?.seekTo(playedSeconds);
    }

  }

  const findPlayerTeam = (player: PlayerType) => {
    return partyDatas.teams.find(team => team.players.find(p => p === player.id));
  }

  return (
    <>
      <main id="game">
        {!partyDatas.host.connected && (
          <div className="host-disconnected">
            <h2>
              L'hôte a été deconnecté de la partie. Merci de patienter son
              retour.
            </h2>
            <NavLink to="/" className="mt-3">
              Quitter la partie
            </NavLink>
          </div>
        )}
        <section className="left">
          <div className="scoreboard">
            <h3>Scoreboard</h3>
            <ul>
            {partyDatas.mode === GameMode.Team && <li className="subtitle">Equipes</li> }
              {partyDatas.mode === GameMode.Team && <>
                {partyDatas.teams.sort((a, b) => b.score - a.score).map((team: TeamType) => (
                  <li key={team.name}>
                    <ScoreboardTeam team={team} />
                  </li>
                ))}
              </>}
              {partyDatas.mode === GameMode.Team && <li className="subtitle">Joueurs</li> }
              {partyDatas.players.map((player, index) => (
                <li
                  key={player.id}
                  className={`px-2 mb-1 py-1 d-flex aic jcsb ${
                    player.id === currentPlayer.id ? "me" : ""
                  }`}
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? "rgba(0, 0, 0, 0.5)"
                        : "rgba(0, 0, 0, 0)",
                  }}
                >
                  <div className="left d-flex aic jcc">
                    <div className="player-image mr-2">
                      <img
                        src={player.profile}
                        alt=""
                      />
                    </div>
                    <span className="mr-2">{player.username} {partyDatas.mode === GameMode.Team && <span className="player-badge" style={{ backgroundColor: findPlayerTeam(player).color }}>{findPlayerTeam(player).name}</span>}</span>
                    {!player.connected && <AiOutlineDisconnect />}
                  </div>
                  <div className="right">
                    {currentPlayer.id === partyDatas.host.id && (
                      <button onClick={() => UpdateScore(player, -1)}>
                        -1
                      </button>
                    )}
                    <span className="mx-2">{player.score}</span>
                    {currentPlayer.id === partyDatas.host.id && (
                      <button onClick={() => UpdateScore(player, 1)}>+1</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {currentPlayer.id === partyDatas.host.id && (
            <div className=" actions mt-2">
              <button onClick={() => EndGame()} >
                Terminer la partie
              </button>
            </div>
          )}
        </section>
        <section className="middle">
          <div className="video">
            <ReactPlayer
              ref={playerRef}
              onProgress={({ playedSeconds }) => UpdateTracker(playedSeconds)}
              playing={partyDatas?.currentTrack?.isPlaying}
              volume={volume / 100}
              width="auto"
              height="100%"
              onReady={() => setDuration(playerRef.current?.getDuration() ?? 0)}
              url={partyDatas?.currentTrack?.url}

            />
            <div className={`video-player-controls ${currentPlayer.id === partyDatas.host.id ? 'host' : ''}`}>
              <div className="togglePlaying" onClick={() => TogglePlaying()}>
                {partyDatas?.currentTrack?.isPlaying ? <FaPause /> : <FaPlay />}
              </div>
              <div className="timeline">
                <input
                    type="range"
                    min="0"
                    max={duration}
                    step={1}
                    value={currentTime}
                    onChange={({ target: { value } }) => UpdateTimeline(Number(value))}
                  />
                  <span>{parseTime(currentTime)} / {parseTime(duration)}</span>
              </div>
              <div className="volume">
                <CiVolumeHigh />
                <input
                  type="range"
                  min="0"
                  max="100"
                  step={1}
                  value={volume}
                  onChange={(evt) => setVolume(Number(evt.target.value))}
                />
                <span>{volume}</span>
              </div>
            </div>
          </div>
          <div
            className={`buzz ${
              partyDatas.currentRound.find(
                (p: PlayerType) => p.id === currentPlayer.id
              ) != null
                ? "lock"
                : ""
            }`}
          >
            <div className="button-border">
              <div className="button-base">
                <button className="button" onClick={() => Buzz()}>
                  Buzz
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="right">
          <div className="current-round">
            <h3>Buzzed</h3>
            <ul>
              {partyDatas?.currentRound.map((player, index) => (
                <li
                  key={player.id}
                  className={`px-2 mb-1 py-1 d-flex aic ${
                    false ? "jcsb" : "jcc"
                  }`}
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? "rgba(0, 0, 0, 0.5)"
                        : "rgba(0, 0, 0, 0)",
                  }}
                >
                  <div className="left">
                    <img
                      src={player.profile}
                      alt=""
                      height="35px"
                      width="35px"
                      className="mr-2"
                    />
                    <span className="mr-2">{player.username} {partyDatas.mode === GameMode.Team && <span className="player-badge" style={{ backgroundColor: findPlayerTeam(player).color }}>{findPlayerTeam(player).name}</span>}</span>
                  </div>
                    <div className="right">
                      {currentPlayer.id === partyDatas.host.id && partyDatas.roundFinished && (
                        <button onClick={() => UpdateScore(player, -1, true)}>
                          -1
                        </button>
                      )}
                      <span className="mx-2">{ partyDatas.currentRoundScore[player.id] != 0 ? partyDatas.currentRoundScore[player.id] > 0 ? "+" : "-" : ''} {partyDatas.currentRoundScore[player.id].toString().replace('-', '')}</span>
                      {currentPlayer.id === partyDatas.host.id && partyDatas.roundFinished && (
                        <button onClick={() => UpdateScore(player, 1, true)}>
                          +1
                        </button>
                      )}
                    </div>
                </li>
              ))}
            </ul>
          </div>
          {currentPlayer.id === partyDatas.host.id && (
            <div className="actions mt-2">
              <button onClick={() => ToggleRound()} >
                {partyDatas.roundFinished
                  ? "Reprendre la manche"
                  : "Terminer la manche"}
              </button>
              {!partyDatas.roundFinished && <button onClick={() => SkipRound()} >
                Passer
              </button>}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

1725572507;
