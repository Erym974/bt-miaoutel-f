import { useEffect, useRef, useState } from "react";
import { PlayerType } from "../../Types/PlayerType";
import ReactPlayer from "react-player";

import "./game.scss";
import { PartyType } from "../../Types/PartyType";
import { socket } from "../../socket";

import { FaPlay, FaPause } from "react-icons/fa";
import { AiOutlineDisconnect } from "react-icons/ai";
import { CiVolumeHigh } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

interface GameProps {
  partyDatas: PartyType;
  currentPlayer: PlayerType;
}

export default function Game({ partyDatas, currentPlayer }: GameProps) {
  const [volume, setVolume] = useState(25);
  const playerRef = useRef<ReactPlayer>(null);

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

  const UpdateScore = (player: PlayerType, amount: number) => {
    socket.emit("update_score", {
      id: partyDatas.id,
      playerId: player.id,
      amount,
    });
  };

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

  const ToggleRound = () => {
    socket.emit(partyDatas.roundFinished ? "resume_turn" : "end_turn", {
      id: partyDatas.id,
    });
  };

  const UpdateTracker = (playedSeconds: number) => {
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
                    <img
                      src={player.profile}
                      alt=""
                      height="35px"
                      width="35px"
                      className="mr-2"
                    />
                    <span className="mr-2">{player.username}</span>
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
            <button onClick={() => EndGame()} className="mt-2">
              Terminer la partie
            </button>
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
              url={partyDatas?.currentTrack?.url}
            />
            <div className="togglePlaying" onClick={() => TogglePlaying()}>
              {partyDatas?.currentTrack?.isPlaying ? <FaPause /> : <FaPlay />}
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
                  <div className="d-flex aic jcc">
                    <img
                      src={player.profile}
                      alt=""
                      height="35px"
                      width="35px"
                      className="mr-2"
                    />
                    <span>{player.username}</span>
                  </div>
                  {partyDatas.roundFinished && (
                    <div className="right">
                      {currentPlayer.id === partyDatas.host.id && (
                        <button onClick={() => UpdateScore(player, -1)}>
                          -1
                        </button>
                      )}
                      <span className="mx-2">{player.score}</span>
                      {currentPlayer.id === partyDatas.host.id && (
                        <button onClick={() => UpdateScore(player, 1)}>
                          +1
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {currentPlayer.id === partyDatas.host.id && (
            <button onClick={() => ToggleRound()} className="mt-2">
              {partyDatas.roundFinished
                ? "Reprendre la manche"
                : "Terminer la manche"}
            </button>
          )}
        </section>
      </main>
    </>
  );
}

1725572507;
