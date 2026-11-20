import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export const Customize = () => {
    return (
        <div>
            <h1>3D 커스터마이징 테스트</h1>

            <div
                style={{
                    width: "100%",
                    height: "600px",
                    background: "#eeeeee",
                }}
            >
                <Canvas camera={{ position: [3, 3, 5] }}>
                    <ambientLight intensity={0.8} />

                    <directionalLight
                        position={[5, 5, 5]}
                        intensity={3}
                    />

                    <mesh>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color="#d71920" />
                    </mesh>

                    <OrbitControls
                        enableZoom
                        enableRotate
                        enablePan
                    />
                </Canvas>
            </div>
        </div>
    );
};