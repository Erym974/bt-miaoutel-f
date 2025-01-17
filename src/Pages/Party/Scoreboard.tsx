import { useEffect, useState } from "react";

import "./scoreboard.scss";
import { PlayerType } from "../../Types/PlayerType";
import { GameMode, PartyType } from "../../Types/PartyType";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import ConfettiComponent from "../../Component/ConfettiComponent";

interface ScoreboardProps {
  partyDatas: PartyType;
  currentPlayer: PlayerType;
}

export default function Scoreboard({
  partyDatas,
  currentPlayer,
}: ScoreboardProps) {
  const navigate = useNavigate();

  const [newGame, setNewGame] = useState<PartyType>();

  const RestartGame = () => {
    socket.emit("restart", {
      id: partyDatas.id,
      newParty: newGame ? newGame.id : undefined,
    });
  };

  useEffect(() => {
    socket.on("response#restart", OnGameRestarting);
    socket.on("new_game_available", OnNewGameAvailable);

    return () => {
      socket.off("response#restart");
    };
  }, []);

  const OnGameRestarting = (newParty: PartyType) => {
    if (newParty) return navigate(`/party/${newParty.id}`);
  };

  const OnNewGameAvailable = (newParty: PartyType) => {
    setNewGame(newParty);
  };

  const findPlayerTeam = (player: PlayerType) => {
    return partyDatas.teams.find((team) =>
      team.players.find((p) => p === player.id)
    );
  };

  return (
    <>
      <ConfettiComponent />
      <main id="scoreboard">
        <div className="podium">
          <div className="position second">
          <div className={`player ${partyDatas.mode === GameMode.Team ? `team` : "individual"}`}
              style={{
                borderColor:
                (partyDatas.mode === GameMode.Team && partyDatas.scoreboard[1])
                    ? findPlayerTeam(partyDatas.scoreboard[1]).color
                    : "",
              }}
            >
              <img
                src={partyDatas.scoreboard[1]?.profile}
                alt=""
                className="profile"
              />
              <div className="player-data">
                {partyDatas.scoreboard[1]?.id === currentPlayer.id && (
                  <span className="isMe">You</span>
                )}
              </div>
              <span className="player-username">
                {partyDatas.scoreboard[1]?.username}
              </span>
            </div>
          </div>
          <div className="position first">
          <div className={`player ${partyDatas.mode === GameMode.Team ? `team` : "individual"}`}
              style={{
                borderColor:
                  (partyDatas.mode === GameMode.Team && partyDatas.scoreboard[0])
                    ? findPlayerTeam(partyDatas.scoreboard[0]).color
                    : "",
              }}
            >
              <img
                src={partyDatas.scoreboard[0]?.profile}
                alt=""
                className="profile"
              />
              <div className="player-data">
                {partyDatas.scoreboard[0]?.id === currentPlayer.id && (
                  <span className="isMe">You</span>
                )}
              </div>
              <span className="player-username">
                {partyDatas.scoreboard[0]?.username}
              </span>
            </div>
          </div>
          <div className="position third">
          <div className={`player ${partyDatas.mode === GameMode.Team ? `team` : "individual"}`}
              style={{
                borderColor:
                (partyDatas.mode === GameMode.Team && partyDatas.scoreboard[2])
                    ? findPlayerTeam(partyDatas.scoreboard[2]).color
                    : "",
              }}
            >
              <img
                src={partyDatas.scoreboard[2]?.profile}
                alt=""
                className="profile"
              />
              <div className="player-data">
                {partyDatas.scoreboard[2]?.id === currentPlayer.id && (
                  <span className="isMe">You</span>
                )}
              </div>
              <span className="player-username">
                {partyDatas.scoreboard[2]?.username}
              </span>
            </div>
          </div>
        </div>
        {partyDatas.mode === GameMode.Team && <div className="teams-scoreboard">
          <h3 className="mb-2">Equipes</h3>
          <ul>
            {partyDatas.teams.sort((a, b) => b.score - a.score).map((team, index) => (
              <li
                key={team.name}
                className={`px-2 mb-1 py-1 d-flex aic jcsb`}
                style={{
                  backgroundColor:
                    index % 2 === 0 ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)",
                }}
              >
                <div className="left d-flex aic jcc">
                  <span className="position">{index + 1}. </span>
                  <span style={{ color: team.color, fontWeight: 900 }}>{team.name}</span>
                </div>
                <div className="right">
                  <span className="mx-2">{team.score}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>}
        <div className="player-scoreboard">
          <h3 className="mb-2">Scoreboard</h3>
          <ul>
            {partyDatas.scoreboard.map((player, index) => (
              <li
                key={player.id}
                className={`px-2 mb-1 py-1 d-flex aic jcsb ${
                  currentPlayer.id === player.id ? "me" : ""
                }`}
                style={{
                  backgroundColor:
                    index % 2 === 0 ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)",
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
                  <span>{player.username} {partyDatas.mode === GameMode.Team && <span className="player-badge" style={{ backgroundColor: findPlayerTeam(player).color }}>{findPlayerTeam(player).name}</span>}</span>
                </div>
                <div className="right">
                  <span className="mx-2">{player.score}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="player-actions">
          <button
            onClick={() => RestartGame()}
            disabled={!(currentPlayer.id === partyDatas.host.id) && !newGame}
          >
            Rejouer
          </button>
          <button onClick={() => navigate("/")}>Quitter la partie</button>
        </div>
      </main>
    </>
  );
}
