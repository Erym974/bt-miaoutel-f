import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "./home.scss";
import { socket } from "../../socket";
import { PartyType } from "../../Types/PartyType";
import OTPInput from "../../Component/OTPInput";
import Rules from "../../Component/Rules";

export default function Home() {

  const [partyId, setPartyId] = useState("");

  const navigate = useNavigate();

  const HostGame = () => {
    navigate("/host");
  };

  const JoinGame = () => {
    if (partyId.length > 0) {
      socket.emit("check_party", { id: partyId });
    } else {
      toast.error("Veuillez renseigner un code d'invitation valide");
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("response#check_party", (partyDatas: PartyType) => {
      if (!partyDatas) {
        toast.error("La partie n'existe pas");
      } else {
        navigate(`/join/${partyDatas.id}`);
      }
    });

    return () => {
      socket.off("response#check_party");
    };
  }, [socket]);

  return (
    <div id="home">
      <header>
        <div className="border"></div>
        <div className="titles">
          <h1>Blind Test</h1>
        </div>
        <div className="border actions">
          <Rules />
        </div>
      </header>
      <main>
        <div className="join">
          <h2>Code de la partie : </h2>
          <OTPInput length={6} setCode={setPartyId} />
          <button className="mt-2" onClick={() => JoinGame()}>
            Rejoindre une partie
          </button>
        </div>
        <hr />
        <div className="host">
          <button onClick={() => HostGame()}>Créer une partie</button>
        </div>
      </main>
    </div>
  );
}
