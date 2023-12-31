import * as THREE from "three"
import { Environment, useTexture } from "@react-three/drei"
import { Physics, useSphere } from "@react-three/cannon"
import { EffectComposer, N8AO, SMAA } from "@react-three/postprocessing"
import { useFrame, useThree } from "@react-three/fiber"


const rfs = THREE.MathUtils.randFloatSpread
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const baubleMaterial = new THREE.MeshStandardMaterial({ color: "#8c85c9", roughness: 0, envMapIntensity: 2 })


export default function Experience() {
  return (
    <>
        <Physics gravity={[0, 2, 0]} iterations={10}>
        <Pointer />
        <Collection />
        </Physics>
        <Environment preset="night" />
        <EffectComposer disableNormalPass multisampling={0}>
          <N8AO halfRes color="black" aoRadius={2} intensity={1} aoSamples={6} denoiseSamples={4} />
          <SMAA />
        </EffectComposer>
    </>
  )
}

function Collection({ mat = new THREE.Matrix4(), vec = new THREE.Vector3(), ...props }) {
    // const texture = useTexture("/smiley.jpg")
    const [ref, api] = useSphere(() => ({ args: [1], mass: 1, angularDamping: 0.1, linearDamping: 0.65, position: [rfs(20), rfs(20), rfs(20)] }))
    useFrame((state) => {
      for (let i = 0; i < 40; i++) {
        ref.current.getMatrixAt(i, mat)
        api.at(i).applyForce(vec.setFromMatrixPosition(mat).normalize().multiplyScalar(-40).toArray(), [0, 0, 0])
      }
    })
    return <instancedMesh ref={ref} castShadow receiveShadow args={[null, null, 40]} geometry={sphereGeometry} material={baubleMaterial} /> //material-map={texture}
  }
  

  function Pointer() {
    const viewport = useThree((state) => state.viewport)
    const [, api] = useSphere(() => ({ type: "Kinematic", args: [3], position: [0, 0, 0] }))
    return useFrame((state) => api.position.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0))
  }
  
 