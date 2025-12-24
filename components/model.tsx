"use client"

import React, { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, useAnimations } from "@react-three/drei"
import type { Group } from "three"

// Raw Model (from user). Keeps exact structure but typed for TSX.
export function Model(props: any) {
  const group = useRef<Group>()
  const gltf = useGLTF("/model/cute_home_robot.glb") as any
  const { nodes, materials, animations, scene } = gltf
  useAnimations(animations, group as any)

  // If the GLB has the expected node structure, render it as before.
  const hasDetailedNodes = nodes && nodes.Object_7
  if (hasDetailedNodes) {
    return (
      <group ref={group as any} {...props} dispose={null}>
        <group name="Sketchfab_Scene">
          <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={1}>
            <group name="edca9fd234644d5480a540acc91ca584fbx" rotation={[Math.PI / 2, 0, 0]}>
              <group name="Object_2">
                <group name="RootNode">
                  <group name="Object_4">
                    <primitive object={nodes._rootJoint} />
                    <skinnedMesh
                      name="Object_7"
                      geometry={nodes.Object_7.geometry}
                      material={materials.M_Metal1}
                      skeleton={nodes.Object_7.skeleton}
                    />
                    <skinnedMesh
                      name="Object_8"
                      geometry={nodes.Object_8.geometry}
                      material={materials.M_Pantalla1}
                      skeleton={nodes.Object_8.skeleton}
                    />
                    <skinnedMesh
                      name="Object_9"
                      geometry={nodes.Object_9.geometry}
                      material={materials.M_Pantalla2}
                      skeleton={nodes.Object_9.skeleton}
                    />
                    <skinnedMesh
                      name="Object_10"
                      geometry={nodes.Object_10.geometry}
                      material={materials.M_Rueda}
                      skeleton={nodes.Object_10.skeleton}
                    />
                    <group name="Object_6" position={[0, 10, 0]} rotation={[-Math.PI / 2, 0, 0]} />
                    <group name="Robo" position={[0, 10, 0]} rotation={[-Math.PI / 2, 0, 0]} />
                    <group
                      name="Cylinder001"
                      position={[-0.121, 0, -0.603]}
                      rotation={[-Math.PI / 2, 0, 0]}
                    >
                      <mesh
                        name="Cylinder001_M_Suelo_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.Cylinder001_M_Suelo_0.geometry}
                        material={materials.M_Suelo}
                      />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    )
  }

  // Fallback: render the whole GLTF scene as a primitive so arbitrary GLBs load.
  return (
    <group ref={group as any} {...props} dispose={null}>
      {scene ? (
        <primitive object={scene} rotation={[-Math.PI / 2, 0, 0]} scale={1} />
      ) : (
        <mesh>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial color="#90cdf4" />
        </mesh>
      )}
    </group>
  )
}

  useGLTF.preload("/model/cute_home_robot.glb")

// A small viewer wrapper that sits inside the navbar. It handles hover state
// and applies a simple celebration animation (spin + bob + pulse) when hovered.
type ViewerProps = {
  className?: string
  position?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
  size?: string | number
}

export default function ModelViewer({ className, position = [0, -0.2, 0], scale = 1, rotation = [0, 0, 0], size = '2.5rem' }: ViewerProps) {
  const parent = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  // Animated model must run inside the R3F Canvas context. Create a
  // child component that uses `useFrame` and is rendered inside Canvas.
  function AnimatedModel({ hovered, pos, rot, scl }: { hovered: boolean; pos: [number, number, number]; rot: [number, number, number]; scl: number }) {
    const ref = useRef<Group>(null)
    const basePos = useRef<[number, number, number]>(pos)
    const baseRot = useRef<[number, number, number]>(rot)
    const baseScl = useRef<number>(scl)

    // Initialize transforms on mount
    React.useEffect(() => {
      basePos.current = pos
      baseRot.current = rot
      baseScl.current = scl
      if (ref.current) {
        ref.current.position.set(pos[0], pos[1], pos[2])
        ref.current.rotation.set(rot[0], rot[1], rot[2])
        ref.current.scale.set(scl, scl, scl)
      }
    }, [pos, rot, scl])

    useFrame((state, delta) => {
      if (!ref.current) return
      const t = state.clock.elapsedTime
      // bob offset adds on top of base Y
      const bob = hovered ? 0.12 + Math.abs(Math.sin(t * 12)) * 0.08 : Math.sin(t * 1.5) * 0.01
      // rotation increment (spin)
      ref.current.rotation.y += delta * (hovered ? 4 : 0.6)
      // apply position relative to base Y
      ref.current.position.y = basePos.current[1] + bob
      // scale relative to base scale
      const s = baseScl.current * (hovered ? 1.05 + Math.sin(t * 20) * 0.04 : 1)
      ref.current.scale.set(s, s, s)
    })

    return (
      <group ref={ref as any}>
        <Model />
      </group>
    )
  }

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        display: "block",
        cursor: "pointer",
        position: "fixed",
        top: "0.5rem",
        left: "0.5rem",
        zIndex: 60,
        pointerEvents: "auto",
      }}
      aria-hidden
    >
      <Canvas style={{ width: '100%', height: '100%' }} shadows dpr={[1, 2]} camera={{ position: [0, 0.9, 2.2], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight intensity={0.8} position={[4, 4, 4]} />
        <Suspense fallback={null}>
          <AnimatedModel hovered={hovered} pos={position} rot={rotation} scl={scale} />
        </Suspense>
      </Canvas>
    </div>
  )
}
