'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { GameEvent } from '@/interfaces';

interface ParticleFieldProps {
  lastEvent: GameEvent | null;
}

function ParticleField({ lastEvent }: ParticleFieldProps) {
  const ref = useRef<THREE.Points>(null);
  const [particleColor, setParticleColor] = useState('#6366f1');
  const [intensity, setIntensity] = useState(0.6);

  const particles = useMemo(() => {
    const positions = new Float32Array(2500 * 3);
    for (let i = 0; i < 2500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return positions;
  }, []);

  useEffect(() => {
    if (!lastEvent) return;

    switch (lastEvent.type) {
      case 'match':
        setParticleColor('#22c55e');
        setIntensity(0.9);
        setTimeout(() => {
          setParticleColor('#6366f1');
          setIntensity(0.6);
        }, 500);
        break;
      case 'combo':
        setParticleColor('#a855f7');
        setIntensity(1);
        setTimeout(() => {
          setParticleColor('#6366f1');
          setIntensity(0.6);
        }, 700);
        break;
      case 'error':
        setParticleColor('#ef4444');
        setIntensity(0.8);
        setTimeout(() => {
          setParticleColor('#6366f1');
          setIntensity(0.6);
        }, 400);
        break;
      case 'victory':
        setParticleColor('#fbbf24');
        setIntensity(1);
        break;
      case 'powerUp':
        setParticleColor('#f59e0b');
        setIntensity(1);
        setTimeout(() => {
          setParticleColor('#6366f1');
          setIntensity(0.6);
        }, 1000);
        break;
      case 'gameOver':
        setParticleColor('#64748b');
        setIntensity(0.3);
        break;
    }
  }, [lastEvent]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.03;
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Points
      ref={ref}
      positions={particles}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color={particleColor}
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={intensity}
      />
    </Points>
  );
}

interface GridPlaneProps {
  lastEvent: GameEvent | null;
}

function GridPlane({ lastEvent }: GridPlaneProps) {
  const ref = useRef<THREE.Mesh>(null);
  const [gridColor, setGridColor] = useState('#3b82f6');

  useEffect(() => {
    if (!lastEvent) return;

    switch (lastEvent.type) {
      case 'match':
      case 'combo':
        setGridColor('#22c55e');
        setTimeout(() => setGridColor('#3b82f6'), 500);
        break;
      case 'error':
        setGridColor('#ef4444');
        setTimeout(() => setGridColor('#3b82f6'), 300);
        break;
      case 'victory':
        setGridColor('#fbbf24');
        break;
      case 'powerUp':
        setGridColor('#f59e0b');
        setTimeout(() => setGridColor('#3b82f6'), 1000);
        break;
    }
  }, [lastEvent]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x =
        -Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <mesh
      ref={ref}
      position={[0, -2, -5]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[35, 35, 35, 35]} />
      <meshBasicMaterial
        color={gridColor}
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

interface CameraShakeProps {
  lastEvent: GameEvent | null;
}

function CameraShake({ lastEvent }: CameraShakeProps) {
  const { camera } = useThree();
  const originalPosition = useRef(new THREE.Vector3(0, 0, 8));

  useEffect(() => {
    if (!lastEvent) return;

    if (lastEvent.type === 'error') {
      const shake = () => {
        const shakeIntensity = 0.15;
        const duration = 300;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          if (elapsed < duration) {
            const progress = elapsed / duration;
            const decay = 1 - progress;
            camera.position.x =
              originalPosition.current.x +
              (Math.random() - 0.5) * shakeIntensity * decay;
            camera.position.y =
              originalPosition.current.y +
              (Math.random() - 0.5) * shakeIntensity * decay;
            requestAnimationFrame(animate);
          } else {
            camera.position.copy(originalPosition.current);
          }
        };
        animate();
      };
      shake();
    }
  }, [lastEvent, camera]);

  return null;
}

interface Background3DProps {
  lastEvent?: GameEvent | null;
}

export function Background3D({ lastEvent = null }: Background3DProps) {
  return (
    <div className='fixed inset-0 -z-10'>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField lastEvent={lastEvent} />
        <GridPlane lastEvent={lastEvent} />
        <CameraShake lastEvent={lastEvent} />
      </Canvas>
    </div>
  );
}
