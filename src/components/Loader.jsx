// src/components/Loader.jsx

import CosmicParallaxBg from "../components/CosmicParallaxBg";

const Loader = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <CosmicParallaxBg
        head="Gokul"
        text="Portfolio Loading..."
        loop={true}
      />
    </div>
  );
};

export default Loader;