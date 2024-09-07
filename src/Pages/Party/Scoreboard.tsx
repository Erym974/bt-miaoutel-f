import React, { useEffect, useState } from "react";

import "./scoreboard.scss";
import { PlayerType } from "../../Types/PlayerType";
import { PartyType } from "../../Types/PartyType";
import { Navigate, useNavigate } from "react-router-dom";
import { socket } from "../../socket";

interface ScoreboardProps {
  partyDatas: PartyType;
  currentPlayer: PlayerType;
}

export default function Scoreboard({
  partyDatas,
  currentPlayer,
}: ScoreboardProps) {

  const navigate = useNavigate();

  const [newGame, setNewGame] = useState<PartyType>()

  const RestartGame = () => {
    socket.emit("restart", { id: partyDatas.id, newParty: newGame ? newGame.id : undefined });
  }

  useEffect(() => {
    socket.on('response#restart', OnGameRestarting)
    socket.on('new_game_available', OnNewGameAvailable)

    return () => {
      socket.off("response#restart");
    };
  }, [])

  const OnGameRestarting = (newParty: PartyType) => {
    if(newParty) return navigate(`/party/${newParty.id}`)
  }

  const OnNewGameAvailable = (newParty: PartyType) => {
    setNewGame(newParty)
  }

  return (
    <>
      <main id="scoreboard">
        <div className="podium">
          <div className="position second">
            <div className="player">
              <img src={partyDatas.players[1]?.profile} alt="" className="profile" />
              <div className="player-data">
                {partyDatas.players[1]?.id === currentPlayer.id && (
                  <span className="isMe">You</span>
                )}
              </div>
              <span className="player-username">{partyDatas.players[1]?.username}</span>
            </div>
          </div>
          <div className="position first">
            <div className="player">
              <img src={partyDatas.players[0]?.profile} alt="" className="profile" />
              <div className="player-data">
                {partyDatas.players[0]?.id === currentPlayer.id && (
                  <span className="isMe">You</span>
                )}
              </div>
              <span className="player-username">{partyDatas.players[0]?.username}</span>
            </div>
          </div>
          <div className="position third">
            <div className="player">
              <img src={partyDatas.players[2]?.profile} alt="" className="profile" />
              <div className="player-data">
                {partyDatas.players[2]?.id === currentPlayer.id && (
                  <span className="isMe">You</span>
                )}
              </div>
              <span className="player-username">{partyDatas.players[2]?.username}</span>
            </div>
          </div>
        </div>
        <div className="player-scoreboard">
            <h3>Scoreboard</h3>
            <ul>
              {partyDatas.players.map((player, index) => (
                <li
                  key={player.id}
                  className={`px-2 mb-1 py-1 d-flex aic jcsb ${currentPlayer.id === player.id ? 'me' : ''}`}
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? "rgba(0, 0, 0, 0.5)"
                        : "rgba(0, 0, 0, 0)",
                  }}
                >
                  <div className="left d-flex aic jcc">
                    <span className="position">{index + 1}. </span>
                    <img
                      src={player.profile}
                      alt=""
                      height="35px"
                      width="35px"
                      className="mr-2"
                    />
                    <span>{player.username}</span>
                  </div>
                  <div className="right">
                    <span className="mx-2">{player.score}</span>
                  </div>
                </li>
              ))}
            </ul>
        </div>
        <div className="player-actions">
          <button onClick={() => RestartGame()} disabled={!(currentPlayer.id === partyDatas.host.id) && !newGame}>Rejouer</button>
          <button onClick={() => navigate('/')}>Quitter la partie</button>
        </div>
      </main>
    </>
  );
}
