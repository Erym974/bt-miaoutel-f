import { useState } from "react";
import { PlayerType } from "../../Types/PlayerType";

import { MdPersonRemove, MdClose  } from "react-icons/md";
import { FaPlay, FaCrown } from "react-icons/fa";

import "./lobby.scss";
import { PartyType } from "../../Types/PartyType";
import { socket } from "../../socket";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";

interface LobbyProps {
  partyDatas: PartyType;
  currentPlayer: PlayerType;
}

export default function Lobby({ partyDatas, currentPlayer }: LobbyProps) {
  const onPlayerJoinGame = (player: PlayerType) => {};

  const [videoUrl, setVideoUrl] = useState("");
  const [videoViewer, setVideoViewer] = useState(false);
  const inviteLink = "http://localhost:5173/join/";

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
  }

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
                  {player.id === partyDatas.host.id && <span className="isHost">Host</span>}
                </div>
                {currentPlayer.id === partyDatas.host.id &&
                  player.id != currentPlayer.id && (
                    <>
                      <button className="kick" onClick={() => KickPlayer(player)}>
                      <MdPersonRemove />
                    </button>
                    <button className="promote" onClick={() => PromotePlayer(player)}>
                      <FaCrown />
                    </button>
                    </>
                  )}
                <span className="player-username">{player.username}</span>
              </div>
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
            <button onClick={() => {navigator.clipboard.writeText(`${inviteLink}${partyDatas.id}`); toast.success('Copié!')}}>Copier</button>
          </div>
          <div className="invite-code mt-3">
            <span>
              Code d'invitation : <strong>{partyDatas.id}</strong>
            </span>
          </div>
        </div>
        {currentPlayer.id === partyDatas.host.id && (
          <div className="settings mb-4">
            <h3>Lien de la vidéo : </h3>
            <input
              type="text"
              name="video-url"
              id="video-url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <button
              className="mt-2"
              onClick={() => setVideoViewer(!videoViewer)}
            >
              <FaPlay />
            </button>

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
                <div className="close" onClick={() => { 
                  setVideoViewer(!videoViewer);
                  }}>
                  <MdClose />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="start-game">
          {currentPlayer.id === partyDatas.host.id && <button onClick={() => startGame()} disabled={partyDatas.players.length <= 1 || !videoUrl}>
            Commencer la partie
          </button>}
        </div>
      </main>
    </>
  );
}
