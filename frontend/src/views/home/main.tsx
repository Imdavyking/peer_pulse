// pages/index.tsx or Home.tsx

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ThreeBackground = () => (
  <Canvas className="absolute inset-0 z-0">
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <OrbitControls enableZoom={false} />
    <mesh rotation={[90, 0, 20]}>
      <torusKnotGeometry args={[10, 3, 100, 16]} />
      <meshStandardMaterial color="#6b21a8" wireframe />
    </mesh>
  </Canvas>
);

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">
      <ThreeBackground />

      <div className="relative z-10">
        <header className="text-center py-24 px-4">
          <motion.h1
            className="text-6xl font-extrabold text-purple-400 drop-shadow-lg mb-6"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Polkalend
          </motion.h1>

          <motion.p
            className="text-xl max-w-2xl mx-auto text-indigo-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            A decentralized protocol offering{" "}
            <strong>interest-free loans</strong> on the{" "}
            <span className="text-pink-400">Polkadot</span> blockchain. Backed
            by over-collateralized debt positions.
          </motion.p>
        </header>

        {/* About Section */}
        <section className="py-20 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div
            className="bg-white/10 p-8 rounded-2xl shadow-lg backdrop-blur-md"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-purple-300 mb-4">
              Why Polkalend?
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li>🔐 No interest — truly DeFi</li>
              <li>⚖️ Fully collateralized using DOT or stablecoins</li>
              <li>💸 Borrow Tokens against your locked assets</li>
              <li>💼 No credit score, no central authority</li>
            </ul>
          </motion.div>

          {/* How It Works */}
          <motion.div
            className="bg-white/10 p-8 rounded-2xl shadow-lg backdrop-blur-md"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-indigo-300 mb-4">
              How It Works
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li>Deposit your DOT or stablecoins</li>
              <li>Open a loan by locking your collateral</li>
              <li>Receive Tokens in your wallet</li>
              <li>Repay anytime and withdraw your collateral</li>
            </ol>
          </motion.div>
        </section>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-24 mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Link
            to="/create-loan"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-xl font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            Launch App
          </Link>
        </motion.div>

        <footer className="text-center text-gray-500 text-sm pb-8">
          Built with ❤️ for the Polkadot ecosystem
        </footer>
      </div>
    </div>
  );
}
