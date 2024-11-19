import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // Pacote leve do tsparticles
import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";

const ParticlesBackground = ({className} : {className?: string | undefined} ) => {
  const [init, setInit] = useState(false);

  // Inicializa o mecanismo do tsParticles apenas uma vez
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // Carrega apenas as funcionalidades necessárias para reduzir o tamanho do bundle
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {};

  // Configurações das partículas
  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "#fff", // Cor do fundo
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: "push", // Adiciona partículas ao clicar
          },
          onHover: {
            enable: true,
            mode: "bubble", // Repele partículas ao passar o mouse
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          bubble: {
            distance: 250,
            size: 20,
            opacity: 1,
            duration: 2,
          },
          grab: {
            distance: 400,
          }
        },
      },
      particles: {
        color: {
          value: "#000", // Cor das partículas
        },
        links: {
          color: "#000", // Cor das linhas conectadas
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 3,
        },
        move: {
          direction: MoveDirection.none, // Direção do movimento
          enable: true,
          outModes: {
            default: OutMode.out, // Sai da tela e reaparece
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true, // Garante densidade proporcional ao tamanho do canvas
          },
          value: 133, // Número de partículas
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle", // Formato das partículas
        },
        size: {
          value: { min: 1, max: 5 }, // Tamanho variável
        },
      },
      detectRetina: true, // Suporte a monitores Retina
    }),
    []
  );

  if (init) {
    return (
      <div className={className}>
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options}
        />
      </div>
    );
  }

  return <></>;
};

export default ParticlesBackground;
