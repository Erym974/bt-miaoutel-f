import { useEffect } from "react";

import { confetti } from '@tsparticles/confetti';

export default function ConfettiComponent() {

    const duration = 5 * 1000, animationEnd = Date.now() + duration, defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    useEffect(() => {

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
          
            if (timeLeft <= 0) {
              return clearInterval(interval);
            }
          
            const particleCount = 20 * (timeLeft / duration);

            confetti(
              Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
              })
            );
            confetti(
              Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
              })
            );
          }, 250);

        return () => {
            clearInterval(interval);
        }
      }, []);

  return (
    <>
    </>
  );
}
