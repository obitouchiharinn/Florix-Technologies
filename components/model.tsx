"use client"

import React, { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, useAnimations } from "@react-three/drei"
import type { Group } from "three"

// Raw Model (from user). Keeps exact structure but typed for TSX.
export function Model(props: any) {
  const group = useRef<Group>()
  const { nodes, materials, animations } = useGLTF("/scene.gltf") as any
  const { actions } = useAnimations(animations, group as any)
  return (
    <group ref={group as any} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.057}>
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

useGLTF.preload("/scene.gltf")

// A small viewer wrapper that sits inside the navbar. It handles hover state
// and applies a simple celebration animation (spin + bob + pulse) when hovered.
export default function ModelViewer({ className }: { className?: string }) {
  const parent = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (!parent.current) return
    const t = state.clock.elapsedTime
    if (hovered) {
      // energetic celebration
      parent.current.rotation.y = parent.current.rotation.y + delta * 4
      parent.current.position.y = 0.12 + Math.abs(Math.sin(t * 12)) * 0.08
      const s = 1.05 + Math.sin(t * 20) * 0.04
      parent.current.scale.set(s, s, s)
    } else {
      // idle gentle rotation
      parent.current.rotation.y = parent.current.rotation.y + delta * 0.6
      parent.current.position.y = 0
      parent.current.scale.set(1, 1, 1)
    }
  })

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: "1.75rem", height: "1.75rem", display: "inline-block", cursor: "pointer" }}
      aria-hidden
    >
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.5, 3.5], fov: 30 }}>
        <ambientLight intensity={0.6} />
        <directionalLight intensity={0.6} position={[5, 5, 5]} />
        <Suspense fallback={null}>
          <group ref={parent as any} rotation={[0, 0, 0]} position={[0, -0.2, 0]}>
            <Model />
          </group>
        </Suspense>
      </Canvas>
    </div>
  )
}
