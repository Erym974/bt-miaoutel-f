import React, { useEffect, useState } from "react";
import ProfileCustomizer from "../../Component/ProfileCustomizer";
import { ProfileType } from "../../Types/ProfileType";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../socket";
import { PlayerType } from "../../Types/PlayerType";
import { PartyType } from "../../Types/PartyType";
import { toast } from "react-toastify";

export default function Join() {

    const [profile, setProfile] = useState<ProfileType>()
    const [partyDatas, setPartyDatas] = useState<PartyType>()

    const navigate = useNavigate();
    const { gameId } = useParams();

    const JoinGame = () => {
        console.log(profile);
        if (!profile || !profile.username) return toast.error("Veuillez renseigner un pseudonyme");
        if(!partyDatas) return toast.error("La partie n'existe pas");
        socket.emit("join_party", { id: partyDatas.id, profile });
    };

    const NewPlayerHandler = () => {
        socket.emit("create_player");
    };

    useEffect(() => {
        if(!gameId) return;
        socket.emit("check_party", { id: gameId });
    }, [gameId])

    useEffect(() => {
        if (!socket) return;
    
        NewPlayerHandler();
    
        socket.on('response#create_player', (player: PlayerType) => {
          localStorage.setItem("player", JSON.stringify(player));
        });
    
        socket.on("response#join_party", (partyDatas: PartyType) => {
          if (!partyDatas) {
            toast.error("La partie n'existe pas")
            return navigate(`/`);
          } else {
              navigate(`/party/${partyDatas.id}`);
          }
        });
    
        socket.on("response#check_party", (partyDatas: PartyType) => {
          if (!partyDatas) {
            toast.error("La partie n'existe pas");
            return navigate(`/`);
          } else {
            setPartyDatas(partyDatas);
          }
        });
    
        return () => {
          socket.off("response#host_game");
          socket.off("response#join_party");
          socket.off("response#check_party");
        };
      }, [socket]);

  return (
    <>
      <header>
        <div className="titles">
          <h1>Rejoindre la partie de {partyDatas?.host.username}</h1>
        </div>
      </header>
      <main>
        <ProfileCustomizer setProfile={setProfile} profile={profile} />
        <button onClick={() => JoinGame()}>Rejoindre la partie</button>
      </main>
    </>
  );
}
