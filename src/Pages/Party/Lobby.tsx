import { useEffect, useState } from "react";
import { PlayerType } from "../../Types/PlayerType";

import { MdPersonRemove, MdClose } from "react-icons/md";
import { FaPlay, FaCrown } from "react-icons/fa";

import "./lobby.scss";
import { GameMode, PartyType } from "../../Types/PartyType";
import { socket } from "../../socket";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import config from "../../config";
import LobbyPlayerCard from "../../Component/LobbyPlayerCard";
import { TeamType } from "../../Types/TeamType";
import { ImYoutube2 } from "react-icons/im";

interface LobbyProps {
  partyDatas: PartyType;
  currentPlayer: PlayerType;
}

export default function Lobby({ partyDatas, currentPlayer }: LobbyProps) {
  const [gameModeToggle, setGameModeToggle] = useState(false);

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoViewer, setVideoViewer] = useState<boolean>(false);
  const inviteLink = `${config.FRONT_URL}/join/`;

  useEffect(() => {
    socket.on("response#start_game", ({ error }) => {
      toast.error(error);
    })

    return () => {
      socket.off("response#start_game");
    };
  }, [])

  const startGame = () => {
    if (currentPlayer.id === partyDatas.host.id) {
      socket.emit("start_game", { id: partyDatas.id, url: videoUrl });
    }
  };

  const KickPlayer = (player: PlayerType) => {
    socket.emit("kick_player", { id: partyDatas.id, player });
  };

  const PromotePlayer = (player: PlayerType) => {
    socket.emit("promote_player", { id: partyDatas.id, player });
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`${inviteLink}${partyDatas.id}`);
    toast.success("Copié!");
  };

  const EditMode = () => {
    if (currentPlayer.id === partyDatas.host.id) {
      const newMode = !gameModeToggle;
      setGameModeToggle(newMode);
      switch (newMode) {
        case true:
          socket.emit("edit_mode", { id: partyDatas.id, mode: GameMode.Team });
          break;
        case false:
          socket.emit("edit_mode", {
            id: partyDatas.id,
            mode: GameMode.Individual,
          });
          break;
      }
    }
  };

  const ChangeTeam = (team: number) => {
    socket.emit("change_team", { id: partyDatas.id, newTeam: team });
  };

  return (
    <>
      <main id="lobby">
        {partyDatas.mode === GameMode.Individual && (
          <div className="players">
            {partyDatas.players &&
              partyDatas.players.map((player) => (
                <LobbyPlayerCard
                  party={partyDatas}
                  player={player}
                  currentPlayer={currentPlayer}
                  KickPlayer={KickPlayer}
                  PromotePlayer={PromotePlayer}
                />
              ))}
          </div>
        )}

        {partyDatas.mode === GameMode.Team && (
          <div className="teams">
            {partyDatas.teams.map((team: TeamType, index: number) => (
              <div key={team.name} className="team">
                <div className="players" style={{ borderColor: team.color }}>
                  {partyDatas.players &&
                    partyDatas.players.map((player) => (
                      <>
                        {team.players.includes(player.id) && (
                          <LobbyPlayerCard
                            party={partyDatas}
                            player={player}
                            currentPlayer={currentPlayer}
                            KickPlayer={KickPlayer}
                            PromotePlayer={PromotePlayer}
                          />
                        )}
                      </>
                    ))}
                </div>
                <button onClick={() => ChangeTeam(index)}>
                  Rejoindre l'équipe {team.name}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="players mobile">
          {partyDatas.players.map((player, index) => (
            <li
              key={player.id}
              className={`player-mobile px-2 mb-1 py-1 d-flex aic jcsb ${
                player.id === currentPlayer.id ? "me" : ""
              }`}
              style={{
                backgroundColor:
                  index % 2 === 0 ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)",
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
                <span
                  className={`${currentPlayer.id === player.id ? "me" : ""}`}
                >
                  {player.username}
                </span>
              </div>
              <div className="right">
                {player.id === partyDatas.host.id && (
                  <span className="isHost">
                    <FaCrown />
                  </span>
                )}
                {partyDatas.host.id === currentPlayer.id &&
                  player.id != currentPlayer.id && (
                    <span className="kick" onClick={() => KickPlayer(player)}>
                      <MdPersonRemove />
                    </span>
                  )}
                {partyDatas.host.id === currentPlayer.id &&
                  player.id != currentPlayer.id && (
                    <span
                      className="promote ml-2"
                      onClick={() => PromotePlayer(player)}
                    >
                      <FaCrown />
                    </span>
                  )}
              </div>
            </li>
          ))}
        </div>

        {currentPlayer.id === partyDatas.host.id && (
          <div className="mode">
            <span>Individuel</span>
            <label className="switch">
              <input
                type="checkbox"
                defaultValue={gameModeToggle ? "checked" : ""}
                checked={gameModeToggle}
                onChange={EditMode}
              />
              <span className="slider round"></span>
            </label>
            <span>Equipe</span>
          </div>
        )}

        <div className="invite">
          <div className="invite-link">
            <input
              type="text"
              style={{ cursor: "pointer" }}
              name="invite-link"
              id="invite-link"
              value={`${inviteLink}${partyDatas.id}`}
              onClick={() => copyInviteLink()}
            />
            <button onClick={() => copyInviteLink()}>
              <span className="copy">Copier</span>
              <span className="copy-mobile">Copier le lien d'invitation</span>
            </button>
          </div>
          <div className="invite-code mt-3">
            <span>
              Code d'invitation : <strong>{partyDatas.id}</strong>
            </span>
          </div>
        </div>
        {currentPlayer.id === partyDatas.host.id && (
          <div className="settings">
            <h3>Lien youtube : </h3>
            <div className="video-url">
              <input
                type="text"
                name="video-url"
                id="video-url"
                placeholder="https://youtube.com/watch?v=__________"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <button onClick={() => setVideoViewer(!videoViewer)}>
                <FaPlay />
              </button>
              <button onClick={() => { window.open('https://www.youtube.com', '_blank') }} className="d-flex aic jcc">
                <ImYoutube2 style={{ fontSize: 40, userSelect: "none" }} />
              </button>
            </div>

            <div className="video-url-mobile">
              <input
                type="text"
                name="video-url"
                id="video-url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <div className="actions">
                <button onClick={() => setVideoViewer(!videoViewer)}>
                  <FaPlay />
                </button>
                <button onClick={() => { window.open('https://www.youtube.com', '_blank') }} className="d-flex aic jcc">
                  <ImYoutube2 style={{ fontSize: 20 }} />
                </button>
              </div>
            </div>

            <div className={`video-viewer ${(!videoViewer) ? "d-none" : ""}`}>
              <div className="player">
              <ReactPlayer
                  className="video-player"
                  playing={videoViewer}
                  controls={true}
                  width="auto"
                  height="50vh"
                  url={videoUrl}
                />
                <div
                  className="close"
                  onClick={() => {
                    setVideoViewer(false);
                  }}
                >
                  <MdClose />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="start-game">
          {currentPlayer.id === partyDatas.host.id && (
            <button
              onClick={() => startGame()}
              disabled={
                !(
                  videoUrl &&
                  (partyDatas.mode === GameMode.Individual ||
                    (partyDatas.teams[0].players.length > 0 &&
                      partyDatas.teams[1].players.length > 0))
                )
              }
            >
              Commencer la partie
            </button>
          )}
        </div>
      </main>
    </>
  );
}
