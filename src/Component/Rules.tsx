import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";

import './styles/rules.scss'

export default function Rules() {

    const [showRules, setShowRules] = useState<boolean>(false);

  return (
    <div className="rules">
        <button onClick={() => setShowRules(!showRules)}>Règles</button>
        <div className={`rules-dialog ${!showRules ? 'd-none' : ''}`}>
            <div className="rules-content">
                <section className="rules-header">
                    <h1>Règles conseillé </h1>
                    <div className="close-rules">
                        <IoMdClose onClick={() => setShowRules(false)}/>
                    </div>
                </section>
                <section className="rules-main">
                    <ul>
                        <li>Obtenir le maximum de points pour gagner</li>
                        <li>1 point par bonne réponse</li>
                        <li>Pour les musiques, 1 point pour l'artiste et 1 point pour le titre</li>
                        <li>[Optionnel] : -1 pour par mauvaise réponse</li>
                    </ul>
                </section>
            </div>
        </div>
    </div>
  )
}
