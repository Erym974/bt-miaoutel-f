import { useState } from "react";
import { PlayerType } from "../../Types/PlayerType";

import { MdPersonRemove, MdClose } from "react-icons/md";
import { FaPlay, FaCrown, FaExternalLinkAlt } from "react-icons/fa";

import "./lobby.scss";
import { PartyType } from "../../Types/PartyType";
import { socket } from "../../socket";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import config from "../../config";

interface LobbyProps {
  partyDatas: PartyType;
  currentPlayer: PlayerType;
}

export default function Lobby({ partyDatas, currentPlayer }: LobbyProps) {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoViewer, setVideoViewer] = useState(false);
  const inviteLink = `${config.FRONT_URL}/join/`;

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

  return (
    <>
      <main id="lobby">
        <div className="players">
          {partyDatas.players &&
            partyDatas.players.map((player) => (
              <div className="player" key={player.id}>
                <img src={player.profile} alt="" className="profile" />
                <div className="player-data">
                  {player.id === currentPlayer.id && (
                    <span className="isMe">You</span>
                  )}
                  {player.id === partyDatas.host.id && (
                    <span className="isHost">Host</span>
                  )}
                </div>
                {currentPlayer.id === partyDatas.host.id &&
                  player.id != currentPlayer.id && (
                    <>
                      <button
                        className="kick"
                        onClick={() => KickPlayer(player)}
                      >
                        <MdPersonRemove />
                      </button>
                      <button
                        className="promote"
                        onClick={() => PromotePlayer(player)}
                      >
                        <FaCrown />
                      </button>
                    </>
                  )}
                <span className="player-username">{player.username}</span>
              </div>
            ))}
        </div>

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

        <div className="invite">
          <div className="invite-link">
            <input
              type="text"
              disabled
              name="invite-link"
              id="invite-link"
              value={`${inviteLink}${partyDatas.id}`}
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
            <h3>Lien de la vidéo : </h3>
            <div className="video-url">
              <input
                type="text"
                name="video-url"
                id="video-url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <button onClick={() => setVideoViewer(!videoViewer)}>
                <FaPlay />
              </button>
              <a
                href="https://www.submagic.co/tools/youtube-video-downloader"
                target="_blank"
              >
                <FaExternalLinkAlt />
              </a>
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
                <a
                  href="https://www.submagic.co/tools/youtube-video-downloader"
                  target="_blank"
                >
                  <FaExternalLinkAlt />
                </a>
              </div>
            </div>

            <div className={`video-viewer ${!videoViewer ? "d-none" : ""}`}>
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
                    setVideoViewer(!videoViewer);
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
            <button onClick={() => startGame()} disabled={!videoUrl}>
              Commencer la partie
            </button>
          )}
        </div>
      </main>
    </>
  );
}
