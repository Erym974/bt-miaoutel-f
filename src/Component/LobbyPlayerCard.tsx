import { PlayerType } from "../Types/PlayerType";
import { MdPersonRemove } from "react-icons/md";
import { FaCrown } from "react-icons/fa6";
import { PartyType } from "../Types/PartyType";

interface PlayerCardType {
    party: PartyType,
    player: PlayerType,
    currentPlayer: PlayerType,
    KickPlayer: (player: PlayerType) => void,
    PromotePlayer: (player: PlayerType) => void,
}

export default function LobbyPlayerCard({ party, player, currentPlayer, KickPlayer, PromotePlayer } : PlayerCardType) {
  return (
    <div className="player" key={player.id}>
      <img src={player.profile} alt="" className="profile" />
      <div className="player-data">
        {player.id === currentPlayer.id && <span className="isMe">You</span>}
        {player.id === party.host.id && (
          <span className="isHost">Host</span>
        )}
      </div>
      {currentPlayer.id === party.host.id &&
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
  );
}
