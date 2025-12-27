'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, Environment, SoftShadows, ContactShadows, Html } from '@react-three/drei'
import * as THREE from 'three'

// Robot Component
function Robot({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    mode = 'hero',
    serviceIndex = 0,
    onLoaded
}: {
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
    mode?: 'hero' | 'vision' | 'services' | 'featureless' | 'contact' | 'cta'
    serviceIndex?: number
    onLoaded?: () => void
}) {
    const group = useRef<THREE.Group>(null)
    // Load model from public/model/robot2.glb
    const { nodes, materials, animations } = useGLTF('/model/robot2.glb') as any
    const { actions, names } = useAnimations(animations, group)

    // Animation State
    const [phase, setPhase] = useState<'entrance' | 'idle' | 'running'>('entrance')
    const [showGreeting, setShowGreeting] = useState(false)

    // Track if entrance has triggered
    const hasEntered = useRef(false)

    // Debug: check names
    useEffect(() => {
        if (names.length) console.log("Animation Names:", names)
    }, [names])

    // Sequence Logic
    useEffect(() => {
        if (!actions) return

        // If NOT in Hero mode (Vision, Services, etc.), stop baked animations
        // This allows manual useFrame logic to take full control without conflict.
        if (mode !== 'hero') {
            Object.values(actions).forEach(action => action?.fadeOut(0.3))
            return
        }

        // Wait for animations to be ready
        if (names.length === 0) {
            // If no animations at all, maybe we just do the text part?
            if (phase === 'entrance' && !hasEntered.current) {
                hasEntered.current = true
                setShowGreeting(true)
                setTimeout(() => speak("Hii, Buddy"), 500)
                setTimeout(() => {
                    setShowGreeting(false)
                    setPhase('idle')
                }, 4000)
            }
            return
        }

        if (phase === 'entrance' && !hasEntered.current) {
            hasEntered.current = true

            // Find "wave" animation case-insensitive
            const waveName = names.find(n => n.toLowerCase().includes('wave')) ||
                names.find(n => n.toLowerCase().includes('greet')) ||
                names.find(n => n.toLowerCase().includes('hello')) ||
                // Fallback to the second animation if available (often action), else first
                names[1] ||
                names[0]

            const celebrateAnim = actions[waveName || '']

            // Force rotation to face the camera
            if (group.current) {
                group.current.rotation.y = rotation[1]
            }

            if (celebrateAnim) {
                // Stop any other playing animations
                Object.values(actions).forEach(action => action?.stop())

                // Play wave
                celebrateAnim.reset().fadeIn(0.5).setLoop(THREE.LoopRepeat, 5).play()
            }

            // Show Greeting Text regardless of animation success
            setShowGreeting(true)

            // Audio
            setTimeout(() => {
                speak("Hii, Buddy")
            }, 500)

            // Transition to Idle
            setTimeout(() => {
                setShowGreeting(false)
                setPhase('idle')
            }, 4000)
        }
        else if (phase === 'idle') {
            const idleName = names.find(n => n.toLowerCase().includes('idle')) || names[0]
            const idleAnim = actions[idleName || '']

            // Fade out others
            Object.values(actions).forEach(a => a !== idleAnim && a?.fadeOut(0.5))

            if (idleAnim) {
                idleAnim.reset().fadeIn(0.5).play()
            }
        }

    }, [phase, actions, names, mode])

    const rightHandRef = useRef<THREE.Group>(null)
    const leftHandRef = useRef<THREE.Group>(null)
    const mouthRef = useRef<THREE.Group>(null)

    // Manual Animation Logic
    useFrame((state) => {
        const t = state.clock.elapsedTime

        // Vision Mode: Raise Hands and Smile
        if (mode === 'vision') {
            if (rightHandRef.current) {
                // Raise Right Arm HIGHER
                // Lift: X rotation. -3.0 is higher up.
                rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, -3.5, 0.1)
                // Spread: Z rotation.
                rightHandRef.current.rotation.z = THREE.MathUtils.lerp(rightHandRef.current.rotation.z, 0.8, 0.1)
            }
            if (leftHandRef.current) {
                // Raise Left Arm HIGHER
                // Lift: X rotation. -3.0 matches right arm.
                leftHandRef.current.rotation.x = THREE.MathUtils.lerp(leftHandRef.current.rotation.x, -3.5, 0.1)

                // Spread: Z rotation. 
                // -Math.PI - 0.8 moves it "up/out" mirroring the right side.
                leftHandRef.current.rotation.z = THREE.MathUtils.lerp(leftHandRef.current.rotation.z, -Math.PI - 0.8, 0.1)
            }
            if (mouthRef.current) {
                // Happy Smile
                mouthRef.current.scale.z = THREE.MathUtils.lerp(mouthRef.current.scale.z, 3.5, 0.1)
                mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 1.2, 0.1)
            }
            // Keep body facing forward
            if (group.current) {
                group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, 0.1)
            }
        }
        // Services Mode: 7 Different Animations based on Scroll Index
        else if (mode === 'services') {
            if (group.current) {
                // Base rotation (controlled by parent mostly, but we use 0 here)
                const baseRot = 0

                // Defaults (Neutral State)
                let tgtRotY = baseRot
                let tgtRotZ = 0
                let tgtRotX = 0
                let tgtPosX = position[0]
                let tgtPosY = position[1]

                switch (serviceIndex) {
                    case 0: // 1. Slow 360 Spin
                        tgtRotY = baseRot + t * 2
                        tgtPosY = position[1] + Math.sin(t * 2) * 0.1
                        break;
                    case 1: // 2. Happy Bounce
                        tgtRotY = baseRot
                        tgtPosY = position[1] + Math.abs(Math.sin(t * 5)) * 0.5
                        break;
                    case 2: // 3. Side to Side Sway (Tick Tock)
                        tgtRotY = baseRot
                        tgtRotZ = Math.sin(t * 3) * 0.2
                        break;
                    case 3: // 4. Figure 8 Hover (Infinity Loop)
                        tgtRotY = baseRot
                        tgtPosX = position[0] + Math.cos(t * 1.5) * 0.3
                        tgtPosY = position[1] + Math.sin(t * 3) * 0.1
                        // tgtRotX defaults to 0
                        break;
                    case 4: // 5. Scanning Sweep (Looking left/right)
                        tgtRotY = baseRot + Math.sin(t * 1.5) * 0.8
                        break;
                    case 5: // 6. Excited Side Hops (Lateral Jump)
                        tgtRotY = baseRot
                        tgtPosX = position[0] + Math.sin(t * 5) * 0.3
                        tgtPosY = position[1] + Math.abs(Math.cos(t * 5)) * 0.2
                        break;
                    case 6: // 7. Fast Excitement Spin
                        tgtRotY = baseRot + Math.sin(t * 5) * 3
                        tgtPosY = position[1]
                        break;
                    default:
                        tgtRotY = baseRot
                }

                // Smoothly Interpolate EVERYTHING
                const DAMPING = 0.1
                group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, tgtRotX, DAMPING)
                group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, tgtRotY, DAMPING)
                group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, tgtRotZ, DAMPING)

                group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tgtPosX, DAMPING)
                group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, tgtPosY, DAMPING)
            }
            // Ensure hands are reset if not used
            if (rightHandRef.current) {
                // Gentle arm swing for all services
                rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, Math.sin(t * 3) * 0.5, 0.1)
                // Reset Spread (from Vision) - Hold slightly out (0.2 for improved symmetry)
                rightHandRef.current.rotation.z = THREE.MathUtils.lerp(rightHandRef.current.rotation.z, 0.2, 0.1)
            }
            if (leftHandRef.current) {
                leftHandRef.current.rotation.x = THREE.MathUtils.lerp(leftHandRef.current.rotation.x, Math.sin(t * 3 + Math.PI) * 0.5, 0.1)
                // Reset Spread (from Vision) - Hold slightly out (-PI - 0.4)
                leftHandRef.current.rotation.z = THREE.MathUtils.lerp(leftHandRef.current.rotation.z, -Math.PI - 0.4, 0.1)
            }
            if (mouthRef.current) {
                // Reset mouth from happy smile
                mouthRef.current.scale.z = THREE.MathUtils.lerp(mouthRef.current.scale.z, 1, 0.1)
                mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 1, 0.1)
            }
        }
        // Featureless Mode: Just face forward, no special Move
        else if (mode === 'featureless') {
            if (group.current) {
                // Reset body rotation to 0
                group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, 0.1)
                group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1)
                // Reset position offsets from animations
                group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, position[1], 0.1)
                group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, position[0], 0.1)
            }
            // Be sure to reset hands if coming from somewhere else
            if (rightHandRef.current) {
                rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, 0, 0.1)
                rightHandRef.current.rotation.z = THREE.MathUtils.lerp(rightHandRef.current.rotation.z, 0.2, 0.1)
            }
            if (leftHandRef.current) {
                leftHandRef.current.rotation.x = THREE.MathUtils.lerp(leftHandRef.current.rotation.x, 0, 0.1)
                leftHandRef.current.rotation.z = THREE.MathUtils.lerp(leftHandRef.current.rotation.z, -Math.PI - 0.4, 0.1)
            }
        }
        // Contact Mode: Face the content from the right
        else if (mode === 'contact') {
            if (group.current) {
                // Determine base rotation in parent Logic, but here we smooth internal parts
                group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, 0.1)
                // Reset body tilt
                group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1)
                group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, 0.1)

                // STICKY: No float, position controlled by ScrollManager
                // Reset any offsets from Services mode
                group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, position[1], 0.1)
                group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, position[0], 0.1)
            }
            if (rightHandRef.current) {
                rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, 0, 0.1)
                rightHandRef.current.rotation.z = THREE.MathUtils.lerp(rightHandRef.current.rotation.z, 0.2, 0.1)
            }
            if (leftHandRef.current) {
                leftHandRef.current.rotation.x = THREE.MathUtils.lerp(leftHandRef.current.rotation.x, 0, 0.1)
                leftHandRef.current.rotation.z = THREE.MathUtils.lerp(leftHandRef.current.rotation.z, -Math.PI - 0.4, 0.1)
            }
        }
        // CTA Mode: Face right (from left side)
        else if (mode === 'cta') {
            if (group.current) {
                group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0.5, 0.1)
                group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1)
                group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, 0.1)

                // Fixed position (no float)
                // Reset any offsets
                group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, position[1], 0.1)
                group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, position[0], 0.1)
            }
            if (rightHandRef.current) {
                rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, 0, 0.1)
                rightHandRef.current.rotation.z = THREE.MathUtils.lerp(rightHandRef.current.rotation.z, 0.2, 0.1)
            }
            if (leftHandRef.current) {
                leftHandRef.current.rotation.x = THREE.MathUtils.lerp(leftHandRef.current.rotation.x, 0, 0.1)
                leftHandRef.current.rotation.z = THREE.MathUtils.lerp(leftHandRef.current.rotation.z, -Math.PI - 0.4, 0.1)
            }
        }
        // Entrance Phase: Wave Hand and Smile
        else if (phase === 'entrance') {
            if (rightHandRef.current) {
                // Realistic Wave:
                // 1. Lift Arm: Rotate around X axis (assuming arm pivot) to raise it.
                // Target X rotation: around -2.5 radians (to lift arm up high).
                const targetLift = -2.5
                rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, targetLift, 0.05)

                // 2. Wave: Rotate around Z axis (side to side).
                // We want the wave to start mainly after the arm is lifting.
                // Wave amplitude: 0.5 radians. Speed: 8.
                const wave = Math.sin(t * 10) * 0.6 + 0.5 // +0.5 to keep hand open visibly
                rightHandRef.current.rotation.z = THREE.MathUtils.lerp(rightHandRef.current.rotation.z, wave, 0.1)

                // 3. Small adjustments
                // Slight Y rotation to angle the palm?
                rightHandRef.current.rotation.y = THREE.MathUtils.lerp(rightHandRef.current.rotation.y, -0.5, 0.05)
            }
            if (mouthRef.current) {
                // Smile Effect: 
                // Scale Z (width) wider to smile.
                // Scale Y (height) slightly to look happy/open.
                // Original scale approx: [1, 1, 2.881] (Z is width based on typical Blender axes)
                const smileIntensity = (Math.sin(t * 8) + 1) * 0.5 // 0 to 1

                // Widen (Z) from 2.881 to ~3.5
                const targetZ = 2.881 * (1 + smileIntensity * 0.2)
                // Heighten (Y) slightly? Or thin it? Let's heighten for "opening"
                const targetY = 1 * (1 + smileIntensity * 0.3)

                mouthRef.current.scale.z = THREE.MathUtils.lerp(mouthRef.current.scale.z, targetZ, 0.1)
                mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, targetY, 0.1)
            }
        }
        // Idle Phase: Gentle Float
        else if (phase === 'idle') {
            if (group.current) {
                group.current.position.y = position[1] + Math.sin(t) * 0.1
                group.current.rotation.y = rotation[1] + Math.sin(t * 0.5) * 0.05
            }
            // Reset hand to natural pos
            if (rightHandRef.current) {
                rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, 0, 0.05)
                rightHandRef.current.rotation.z = THREE.MathUtils.lerp(rightHandRef.current.rotation.z, 0, 0.05)
                rightHandRef.current.rotation.y = THREE.MathUtils.lerp(rightHandRef.current.rotation.y, -0.064, 0.05)
            }
            // Reset left hand
            if (leftHandRef.current) {
                leftHandRef.current.rotation.x = THREE.MathUtils.lerp(leftHandRef.current.rotation.x, 0, 0.05)
                leftHandRef.current.rotation.z = THREE.MathUtils.lerp(leftHandRef.current.rotation.z, -Math.PI, 0.05)
            }
            // Reset mouth
            if (mouthRef.current) {
                mouthRef.current.scale.z = THREE.MathUtils.lerp(mouthRef.current.scale.z, 2.881, 0.1)
                mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 1, 0.1)
            }
        }
    })

    // ... (keep existing voice logic)

    // Voice
    const speak = (text: string) => {
        // ... (keep logic)
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            // ...
            // Just keeping existing speak logic in mind, no changes needed to function itself unless we want to sync mouth more precisely
            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.rate = 1.1
            utterance.pitch = 1.2
            const voices = window.speechSynthesis.getVoices()
            const preferred = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'))
                || voices.find(v => v.lang.startsWith('en'))
            if (preferred) utterance.voice = preferred
            window.speechSynthesis.speak(utterance)
        }
    }

    return (
        <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
            <group name="Sketchfab_Scene">
                {/* Vision Mode Text Overlays */}
                {mode === 'vision' && (
                    <>
                        {/* Left Side: VISION */}
                        <Html
                            position={[-0.4, 0.9, 0]}
                            center
                            distanceFactor={8}
                            zIndexRange={[100, 0]}
                            style={{ pointerEvents: 'none' }}
                        >
                            <div className="animate-in fade-in zoom-in duration-500">
                                <h3 className="text-green-600  text-sm tracking-wider">VISION</h3>
                            </div>
                        </Html>

                        {/* Right Side: MISSION */}
                        <Html
                            position={[0.4, 0.9, 0]}
                            center
                            distanceFactor={8}
                            zIndexRange={[100, 0]}
                            style={{ pointerEvents: 'none' }}
                        >
                            <div className="animate-in fade-in zoom-in duration-500">
                                <h3 className="text-green-600  text-sm tracking-wider">MISSION</h3>
                            </div>
                        </Html>
                    </>
                )}

                {/* ... (Html greeting) ... */}
                {
                    showGreeting && (
                        <Html
                            position={[0.6, 1.0, 0]}
                            center
                            distanceFactor={10}
                            zIndexRange={[100, 0]}
                            style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
                        >
                            <div className="bg-white/90 dark:bg-black/90 px-4 py-2 rounded-full border border-primary/50 backdrop-blur-sm animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500 shadow-xl">
                                <p className="text-primary font-bold text-lg flex items-center gap-2">
                                    <span>Hii, Buddy</span>
                                    <span className="animate-bounce">👋</span>
                                </p>
                            </div>
                        </Html>
                    )
                }

                <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.246}>
                    <group
                        name="a45b6f53b9cc462a82863bb5898bf730fbx"
                        rotation={[Math.PI / 2, 0, 0]}
                        scale={0.01}>
                        <group name="Object_2">
                            <group name="RootNode">
                                <group
                                    name="Robot_Origin"
                                    position={[0, 9.763, 0]}
                                    rotation={[-Math.PI / 2, 0, 0]}
                                    scale={100}>
                                    <group name="Robot" position={[0, 0, 0.051]}>
                                        {/* ... meshes ... */}
                                        <mesh
                                            name="Robot_White_Glossy_0"
                                            castShadow
                                            receiveShadow
                                            geometry={nodes.Robot_White_Glossy_0.geometry}
                                            material={materials.White_Glossy}
                                        />
                                        <mesh
                                            name="Robot_Blue_Light_0"
                                            castShadow
                                            receiveShadow
                                            geometry={nodes.Robot_Blue_Light_0.geometry}
                                            material={materials.Blue_Light}
                                        />
                                        <mesh
                                            name="Robot_Black_Matt_0"
                                            castShadow
                                            receiveShadow
                                            geometry={nodes.Robot_Black_Matt_0.geometry}
                                            material={materials.Black_Matt}
                                        />
                                    </group>
                                    <group ref={mouthRef} name="Mouth" position={[0, -0.504, 2.573]} scale={[1, 1, 2.881]}>
                                        <mesh
                                            name="Mouth_Blue_Light_0"
                                            castShadow
                                            receiveShadow
                                            geometry={nodes.Mouth_Blue_Light_0.geometry}
                                            material={materials.Blue_Light}
                                        />
                                    </group>

                                    {/* ... Wave eyes things ... */}
                                    <group name="Wave" position={[0, 0, 0.113]} scale={[1, 1, 0.186]}>
                                        <mesh
                                            name="Wave_Blue_Light_0"
                                            castShadow
                                            receiveShadow
                                            geometry={nodes.Wave_Blue_Light_0.geometry}
                                            material={materials.Blue_Light}
                                        />
                                    </group>
                                    <group name="Wave002" position={[0, 0, 0.879]} scale={[1, 1, 0.889]}>
                                        <mesh
                                            name="Wave002_Blue_Light_0"
                                            castShadow
                                            receiveShadow
                                            geometry={nodes.Wave002_Blue_Light_0.geometry}
                                            material={materials.Blue_Light}
                                        />
                                    </group>
                                    <group name="Wave001" position={[0, 0, -0.089]} scale={[1, 1, 0.001]}>
                                        <mesh
                                            name="Wave001_Blue_Light_0"
                                            castShadow
                                            receiveShadow
                                            geometry={nodes.Wave001_Blue_Light_0.geometry}
                                            material={materials.Blue_Light}
                                        />
                                    </group>
                                    <group name="Wave003" position={[0, 0, 0.511]} scale={[1, 1, 0.552]}>
                                        <mesh
                                            name="Wave003_Blue_Light_0"
                                            castShadow
                                            receiveShadow
                                            geometry={nodes.Wave003_Blue_Light_0.geometry}
                                            material={materials.Blue_Light}
                                        />
                                    </group>
                                    <group name="Waves" position={[0, 0, 1]} scale={[1, 1, 0.747]} />

                                    <group name="Ears" position={[0, 0, 2.967]}>
                                        <mesh
                                            name="Ears_Black_Matt_0"
                                            castShadow
                                            receiveShadow
                                            geometry={nodes.Ears_Black_Matt_0.geometry}
                                            material={materials.Black_Matt}
                                        />
                                    </group>
                                    <group name="Empty" position={[0, -0.06, 2.786]}>
                                        <group name="Eyes" position={[0, -0.431, 0.076]}>
                                            <mesh
                                                name="Eyes_Blue_Light_0"
                                                castShadow
                                                receiveShadow
                                                geometry={nodes.Eyes_Blue_Light_0.geometry}
                                                material={materials.Blue_Light}
                                            />
                                        </group>
                                    </group>
                                    <group ref={rightHandRef} name="Hand_origin" position={[0.723, 0, 2.015]} rotation={[0, -0.064, 0]}>
                                        <group name="hANDS" position={[-0.723, 0, -1.963]}>

                                            <mesh
                                                name="hANDS_White_Glossy_0"
                                                castShadow
                                                receiveShadow
                                                geometry={nodes.hANDS_White_Glossy_0.geometry}
                                                material={materials.White_Glossy}
                                            />
                                        </group>
                                    </group>
                                    <group
                                        ref={leftHandRef}
                                        name="Hand_origin002"
                                        position={[-0.723, 0, 2.015]}
                                        rotation={[0, 0.064, -Math.PI]}>
                                        <group name="hANDS002" position={[-0.723, 0, -1.963]}>
                                            <mesh
                                                name="hANDS002_White_Glossy_0"
                                                castShadow
                                                receiveShadow
                                                geometry={nodes.hANDS002_White_Glossy_0.geometry}
                                                material={materials.White_Glossy}
                                            />
                                        </group>
                                    </group>
                                </group>
                            </group>
                        </group>
                    </group>
                </group>
            </group >
        </group >
    )
}

// Main Export
export default function HeroRobot({
    heroRef,
    visionRef,
    servicesRef,
    contactRef,
    ctaRef
}: {
    heroRef?: React.RefObject<HTMLElement | null>,
    visionRef?: React.RefObject<HTMLElement | null>,
    servicesRef?: React.RefObject<HTMLElement | null>,
    contactRef?: React.RefObject<HTMLElement | null>,
    ctaRef?: React.RefObject<HTMLElement | null>
}) {
    // We'll manage the robot's "global" position/rotation/scale via a parent group in the canvas
    // Or simpler: We pass the scroll logic DOWN to the Robot component or handle simple position props here.
    // Actually, let's keep the Canvas fixed full screen, and move the Robot inside the canvas based on scroll.

    return (
        <div className="fixed inset-0 z-30 pointer-events-none select-none overflow-hidden">
            <Canvas
                shadows
                camera={{ position: [0, 0, 10], fov: 40 }} // Adjusted camera for better overlay control
                style={{ width: '100vw', height: '100vh' }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={2.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={3} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={2} />
                <Environment preset="studio" />

                <Environment preset="studio" />

                <ScrollManager heroRef={heroRef} visionRef={visionRef} servicesRef={servicesRef} contactRef={contactRef} ctaRef={ctaRef} />
            </Canvas>
        </div>
    )
}

function ScrollManager({
    heroRef,
    visionRef,
    servicesRef,
    contactRef,
    ctaRef
}: {
    heroRef?: React.RefObject<HTMLElement | null>,
    visionRef?: React.RefObject<HTMLElement | null>,
    servicesRef?: React.RefObject<HTMLElement | null>,
    contactRef?: React.RefObject<HTMLElement | null>,
    ctaRef?: React.RefObject<HTMLElement | null>
}) {
    const robotGroup = useRef<THREE.Group>(null)
    const [targetState, setTargetState] = useState<'hero' | 'vision' | 'services' | 'featureless' | 'contact' | 'cta'>('hero')
    const [serviceIndex, setServiceIndex] = useState(0)
    const isLocked = useRef(false) // Lock mechanism
    const { viewport } = useThree()

    // Real-time Scroll Handling (No Debounce for Super Smooth)
    useEffect(() => {
        let ticking = false

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    checkPosition()
                    ticking = false
                })
                ticking = true
            }
        }

        const checkPosition = () => {
            if (isLocked.current) return // Stop checks if locked

            const viewportHeight = window.innerHeight
            const isMobile = window.innerWidth < 768

            // -1. Check CTA (Absolute Bottom Priority - "Ready to transform presence")
            if (ctaRef?.current) {
                const rect = ctaRef.current.getBoundingClientRect()
                // Check if visible (Relaxed condition: As soon as it enters view)
                if (rect.top < viewportHeight && rect.bottom > 0) {
                    setTargetState('cta')
                    isLocked.current = true // LOCK IT
                    return
                }
            }

            // 0. Check Contact (Bottom-most relevant)
            // Skip on Mobile: Robot should stay fixed in Services (then scroll away) until CTA
            if (contactRef?.current && !isMobile) {
                const rect = contactRef.current.getBoundingClientRect()
                // Check if visible
                if (rect.top < viewportHeight * 0.9 && rect.bottom > viewportHeight * 0.1) {
                    setTargetState('contact')
                    return
                }
            }

            // 1. Check Services (Bottom-most priority after contact)
            if (servicesRef?.current) {
                const rect = servicesRef.current.getBoundingClientRect()
                // If top is crossing up into view (e.g. < 80%) and bottom is still visible
                if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
                    setTargetState('services')

                    // Calculate Service Index (0-6) based on scroll progress
                    const scrolled = viewportHeight - rect.top
                    const totalScrollable = rect.height
                    const rawProgress = scrolled / totalScrollable

                    // Clamp 0-1
                    const progress = Math.max(0, Math.min(1, rawProgress))

                    // Map to 0-6
                    const idx = Math.floor(progress * 7)
                    setServiceIndex(Math.min(6, Math.max(0, idx)))

                    return
                }

                // New Logic: If we scrolled PAST the services section (bottom is way up)
                if (rect.bottom <= viewportHeight * 0.2) {
                    setTargetState('featureless')
                    return
                }
            }

            // 2. Check Vision
            if (visionRef?.current) {
                const rect = visionRef.current.getBoundingClientRect()
                if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
                    setTargetState('vision')
                    return
                }
            }

            // 3. Default to Hero
            // If we scrolled way back up, go back to hero
            // Check if near top
            if (window.scrollY < viewportHeight * 0.5) {
                setTargetState('hero')
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [visionRef, servicesRef, contactRef, ctaRef])


    useFrame((state, delta) => {
        if (!robotGroup.current) return

        const isMobile = window.innerWidth < 768

        // Define Positions
        // 1. Hero Position (Base)
        const desktopHeroPos = new THREE.Vector3(-6.1, -0.34, -0.4)
        const mobileHeroPos = new THREE.Vector3(-1.2, 1.9, 0)

        const heroPos = isMobile ? mobileHeroPos : desktopHeroPos
        const heroScale = isMobile ? 0.9 : 2.4

        // 2. Vision Position (Target)
        const desktopVisionPos = new THREE.Vector3(0, -0.5, 2.0)
        const mobileVisionPos = new THREE.Vector3(0, -0.7, 1.0) // Higher and smaller on mobile

        const visionPos = isMobile ? mobileVisionPos : desktopVisionPos
        const visionScaleVal = isMobile ? 1.0 : 2.4

        // 3. Services Position
        const desktopServicesPos = new THREE.Vector3(-4.5, -1.6, 2.0) // Left side
        const mobileServicesPos = new THREE.Vector3(0, 0.9, 1.0) // Top Center on mobile

        const servicesPos = isMobile ? mobileServicesPos : desktopServicesPos
        const servicesScaleVal = isMobile ? 1.0 : 2.4

        // 4. Contact Position
        const desktopContactPos = new THREE.Vector3(4.5, -1.8, 1.8) // Right side
        const mobileContactPos = new THREE.Vector3(0, -1.5, 1.0) // Center

        const contactPos = isMobile ? mobileContactPos : desktopContactPos
        const contactScaleVal = isMobile ? 1.0 : 2.4

        // 5. CTA Position
        const desktopCtaPos = new THREE.Vector3(-3.5, -0.6, 2.9) // Left Side
        const mobileCtaPos = new THREE.Vector3(0, 1.2, 2.0) // Center - Moved UP above text for mobile

        const ctaPos = isMobile ? mobileCtaPos : desktopCtaPos
        const ctaScaleVal = isMobile ? 1.0 : 2.4

        // Determine destination based on current Target State
        let targetPos: THREE.Vector3
        let targetScaleVal: number
        let targetRotY: number

        if (targetState === 'cta') {
            targetPos = ctaPos.clone()
            targetScaleVal = ctaScaleVal
            // Face slightly towards user/content (right)
            targetRotY = isMobile ? 0 : 0.5

            // Sticky Logic: LOCK to the Section
            if (ctaRef?.current) {
                const rect = ctaRef!.current!.getBoundingClientRect()
                const vh = window.innerHeight

                // Align relative to screen center
                // When element is centered, offset is 0
                const elementCenter = rect.top + rect.height / 2
                const screenCenter = vh / 2
                const pixelOffset = elementCenter - screenCenter

                // In Three.js, +Y is up. In DOM, +Y is down.
                // We inverse the offset
                const worldOffset = -(pixelOffset / vh) * viewport.height

                targetPos.y += worldOffset
            }
        } else if (targetState === 'contact') {
            targetPos = contactPos.clone()
            targetScaleVal = contactScaleVal
            // Face slightly towards user/content (left)
            targetRotY = -0.5

            // Sticky Logic: Track the Contact Section
            if (contactRef?.current) {
                const rect = contactRef.current.getBoundingClientRect()
                const vh = window.innerHeight

                // Align relative to screen center
                // When element is centered, offset is 0
                const elementCenter = rect.top + rect.height / 2
                const screenCenter = vh / 2
                const pixelOffset = elementCenter - screenCenter

                // In Three.js, +Y is up. In DOM, +Y is down.
                // We inverse the offset
                const worldOffset = -(pixelOffset / vh) * viewport.height

                targetPos.y += worldOffset
            }

        } else if (targetState === 'services') {
            // Services: Attached to Services Section (Fixed Overlay)
            targetPos = servicesPos.clone()
            targetScaleVal = servicesScaleVal
            // Face slightly right to look at content
            targetRotY = isMobile ? 0 : 0.5

            // Note: We do NOT calculate a vertical shift here because the Services 
            // section is very tall. Centering it would push the robot off-screen.
            // We keep it fixed in the viewport.

        } else if (targetState === 'featureless') {
            // "Sticky" Exit: Track the Services section as it scrolls up
            targetPos = servicesPos.clone()
            targetScaleVal = servicesScaleVal
            targetRotY = 0 // Face Forward

            if (servicesRef?.current) {
                const rect = servicesRef.current.getBoundingClientRect()
                const vh = window.innerHeight
                // We exit services when rect.bottom <= 0.2 * vh
                // Calculate how far up we have moved past that point
                // difference in pixels (Positive as we scroll down)
                const pixelDiff = (vh * 0.2) - rect.bottom

                // Convert to World Units (approximate based on viewport height)
                // This assumes orthographic-like behavior or close enough perspective
                const worldDiff = (pixelDiff / vh) * viewport.height

                targetPos.y += worldDiff
            } else {
                // Fallback if ref missing
                targetPos = new THREE.Vector3(-4.5, 12, 2.0)
            }

        } else if (targetState === 'vision') {
            // Vision: Attached to Vision Section
            targetPos = visionPos.clone()
            targetScaleVal = visionScaleVal
            targetRotY = 0

            // Calculate Vision section offset to make robot stick to it during scroll
            if (visionRef?.current) {
                const rect = visionRef.current.getBoundingClientRect()
                // Center of the Vision section relative to viewport top
                const elementCenterY = rect.top + (rect.height / 2)
                const viewportCenterY = window.innerHeight / 2

                // Difference in pixels (Positive if element is below center)
                const diffPx = elementCenterY - viewportCenterY

                // Convert to 3D units
                // Note: Three.js Y is UP (Positive), Screen Y is DOWN (Positive).
                // If element is below center (Positive diff), Robot should be below center (Negative Y shift).
                const unitPerPx = viewport.height / window.innerHeight
                const shiftY = -(diffPx * unitPerPx)

                targetPos.y += shiftY
            }
        } else {
            // Hero: Simulate absolute positioning by scrolling UP with page
            // Calculate how many 3D units we have scrolled
            // scrollY / innerHeight = % of screen scrolled
            // % * viewport.height = 3D vertical units to shift
            const scrollRatio = window.scrollY / window.innerHeight
            const verticalShift = scrollRatio * viewport.height

            // If we scroll DOWN, page goes UP. So robot should go UP (Positive Y)
            targetPos = heroPos.clone()
            targetPos.y += verticalShift

            targetScaleVal = heroScale
            targetRotY = 0.6
        }

        // Smoothly Interpolate
        const lambda = 2.5

        // Position: Snap Y for sticky states to prevent scroll lag
        // Only CTA needs perfect snap as it is an overlay. Contact can use smooth lerp.
        if (targetState === 'cta') {
            robotGroup.current.position.x = THREE.MathUtils.lerp(robotGroup.current.position.x, targetPos.x, lambda * delta)
            robotGroup.current.position.z = THREE.MathUtils.lerp(robotGroup.current.position.z, targetPos.z, lambda * delta)
            robotGroup.current.position.y = targetPos.y
        } else {
            robotGroup.current.position.lerp(targetPos, lambda * delta)
        }

        const currentScale = THREE.MathUtils.lerp(robotGroup.current.scale.x, targetScaleVal, lambda * delta)
        robotGroup.current.scale.set(currentScale, currentScale, currentScale)

        const currentRot = THREE.MathUtils.lerp(robotGroup.current.rotation.y, targetRotY, lambda * delta)
        robotGroup.current.rotation.y = currentRot
    })

    return (
        <group ref={robotGroup}>
            <Robot rotation={[0, 0, 0]} mode={targetState === 'services' ? 'services' : (targetState === 'featureless' ? 'featureless' : targetState)} serviceIndex={serviceIndex} />
        </group>
    )
}

// ... Preload remains down here
useGLTF.preload('/model/robot2.glb')
