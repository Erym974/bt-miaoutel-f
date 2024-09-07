import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaUsers } from "react-icons/fa6";

import "./party.scss";
import { PlayerType } from "../../Types/PlayerType";
import Lobby from "./Lobby";
import Game from "./Game";
import Scoreboard from "./Scoreboard";
import { PartyType } from "../../Types/PartyType";
import { socket } from "../../socket";
import { toast } from "react-toastify";
import Rules from "../../Component/Rules";

export default function Party() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>();
  const [partyDatas, setPartyDatas] = useState<PartyType>();

  useEffect(() => {
    if (!gameId) return navigate("/");

    const oldPlayer: PlayerType | null = localStorage.getItem("player")
      ? (JSON.parse(localStorage.getItem("player") as string) as PlayerType)
      : null;

    socket.emit("get_player", { gameId, oldPlayer });
    socket.emit("get_party", gameId);
  }, [gameId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("response#get_player", OnGetPlayerResponse);
    socket.on("response#get_party", OnGetPartyResponse);
    socket.on("response#leave_party", OnLeaveResponseResponse);
    socket.on("kicked_by_host", OnKickedByHost);
    socket.on(`update_party`, OnPartyUpdated);

    return () => {
      socket.off("response#get_player");
      socket.off("response#get_party");
      socket.off("response#leave_party");
      socket.off(`update_party`);
      socket.off(`kicked_by_host`);
    };
  }, []);

  const OnGetPlayerResponse = (player: PlayerType | null) => {
    if (!player) return navigate(`/join/${gameId}`);
    setCurrentPlayer(player);
    localStorage.setItem("player", JSON.stringify(player));
  };

  const OnGetPartyResponse = (party: PartyType | null) => {
    if (!party) return navigate(`/join/${gameId}`);
    setPartyDatas(party);
  };
  const OnLeaveResponseResponse = (party: PartyType | null) => {
    return navigate(`/`);
  };

  const OnPartyUpdated = (party: PartyType) => {
    setPartyDatas(party);
  };

  const OnKickedByHost = () => {
    toast.error("Vous avez été expulsé de la partie.");
    navigate("/");
  };

  return (
    <>
      {currentPlayer && partyDatas && (
        <>
          <header>
            <div className="border"></div>
            <div className="titles">
              <h2>Salon de {partyDatas?.host.username}</h2>
              <h3 className="player-count">
                <FaUsers />
                <span>{partyDatas?.players.length}</span>
              </h3>
              {partyDatas && <h4>Code salon : {partyDatas?.id}</h4>}
            </div>
            <div className="border actions">
              <Rules />
              <button onClick={() => socket.emit("leave_party", gameId)} className="btn-danger">Quitter</button>
            </div>
          </header>
          {partyDatas.gameState === "Lobby" && (
            <Lobby partyDatas={partyDatas} currentPlayer={currentPlayer} />
          )}
          {partyDatas.gameState === "Game" && (
            <Game partyDatas={partyDatas} currentPlayer={currentPlayer} />
          )}
          {partyDatas.gameState === "Scoreboard" && (
            <Scoreboard partyDatas={partyDatas} currentPlayer={currentPlayer} />
          )}
        </>
      )}
    </>
  );
}
