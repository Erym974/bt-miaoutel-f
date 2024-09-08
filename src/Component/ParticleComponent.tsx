import { Fragment, useEffect } from "react";

import Particles, { initParticlesEngine } from "@tsparticles/react";

import SnowEffect from "./.././Particles/SnowEffect.js";
import { loadSlim } from "@tsparticles/slim";

export default function ParticleComponent() {
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }, []);

  return (
    <div>
      <Particles id="tsparticles" options={SnowEffect} />
    </div>
  );
}
