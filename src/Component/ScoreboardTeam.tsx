import { TeamType } from "../Types/TeamType";

interface ScoreboardTeamType {
  team: TeamType;
}

import './styles/ScoreboardTeam.scss'

export default function ScoreboardTeam({ team }: ScoreboardTeamType) {
  return (
    <>
      <div className="team-scoreboard">
        <div className="vignette" style={{ boxShadow: `0 0 15px ${team.color} inset` }}></div>
        <div className="left">
          <span className="mx-2">{team.name}</span>
        </div>
        <div className="right">
          <span className="mx-2">{team.score}</span>
        </div>
      </div>
    </>
  );
}
