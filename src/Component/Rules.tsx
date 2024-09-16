import { useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { MdOutlineQuestionMark } from "react-icons/md";
import ReactMarkdown from 'react-markdown';

import './styles/rules.scss'

export default function Rules() {

    const [showRules, setShowRules] = useState<boolean>(false);
    const [md, setMd] = useState("");

    useEffect(() => {
        fetch("/help.md")
        .then((response) => response.text())
        .then((text) => {
            setMd(text);
        });
    }, [])

  return (
    <div className="rules">
        <button className="p-2" onClick={() => setShowRules(!showRules)}>
            <MdOutlineQuestionMark style={{ fontSize: 20 }} />
        </button>
        <div className={`rules-dialog ${!showRules ? 'd-none' : ''}`}>
            <div className="rules-content" style={{ textAlign: 'left' }}>
                <div className="close-rules">
                    <IoMdClose onClick={() => setShowRules(false)}/>
                </div>
                <ReactMarkdown>{md}</ReactMarkdown>
            </div>
        </div>
    </div>
  )
}
