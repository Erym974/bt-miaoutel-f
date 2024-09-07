import React, { useEffect, useState } from "react";
import ProfileCustomizer from "../../Component/ProfileCustomizer";
import { ProfileType } from "../../Types/ProfileType";
import { socket } from "../../socket";
import { PlayerType } from "../../Types/PlayerType";
import { PartyType } from "../../Types/PartyType";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



export default function Host() {

    const [profile, setProfile] = useState<ProfileType>()

    const navigate = useNavigate();

    const NewPlayerHandler = () => {
        socket.emit("create_player");
      };

      const HostGame = () => {
        if (!profile || !profile.username) return toast.error("Veuillez renseigner un pseudonyme");
        socket.emit("host_game", profile);
      };

    useEffect(() => {
        if (!socket) return;
    
        NewPlayerHandler();
    
        socket.on('response#create_player', (player: PlayerType) => {
          localStorage.setItem("player", JSON.stringify(player));
        });
    
        socket.on("response#host_game", (partyDatas: PartyType) => {
          if (!partyDatas)
            return toast.error(
              "Une erreur est survenue lors de la création de la partie"
            );
          navigate(`/party/${partyDatas.id}`);
        });

    
        return () => {
          socket.off("response#host_game");
        };
      }, [socket]);

  return (
    <>
      <header>
        <div className="titles">
          <h1>Héberger une partie</h1>
        </div>
      </header>
      <main>
        <ProfileCustomizer setProfile={setProfile} profile={profile} />
        <button onClick={() => HostGame()}>Héberger la partie</button>
      </main>
    </>
  );
}
