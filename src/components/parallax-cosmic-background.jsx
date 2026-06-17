import React, { useEffect, useState } from "react";

const CosmicParallaxBg = ({
  head,
  text,
  loop = true,
  className = "",
}) => {
  const [smallStars, setSmallStars] = useState("");
  const [mediumStars, setMediumStars] = useState("");
  const [bigStars, setBigStars] = useState("");

  const textParts = text.split(",").map((part) => part.trim());

  const generateStarBoxShadow = (count) => {
    let shadows = [];

    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 2000);
      const y = Math.floor(Math.random() * 2000);
      shadows.push(`${x}px ${y}px #FFF`);
    }

    return shadows.join(", ");
  };

  useEffect(() => {
    setSmallStars(generateStarBoxShadow(700));
    setMediumStars(generateStarBoxShadow(200));
    setBigStars(generateStarBoxShadow(100));

    document.documentElement.style.setProperty(
      "--animation-iteration",
      loop ? "infinite" : "1"
    );
  }, [loop]);

  return (
    <div className={`cosmic-parallax-container ${className}`}>
      <div
        id="stars"
        style={{ boxShadow: smallStars }}
        className="cosmic-stars"
      />

      <div
        id="stars2"
        style={{ boxShadow: mediumStars }}
        className="cosmic-stars-medium"
      />

      <div
        id="stars3"
        style={{ boxShadow: bigStars }}
        className="cosmic-stars-large"
      />

      <div id="horizon">
        <div className="glow"></div>
      </div>

      <div id="earth"></div>

      <div id="title">{head.toUpperCase()}</div>

      <div id="subtitle">
        {textParts.map((part, index) => (
          <React.Fragment key={index}>
            <span className={`subtitle-part-${index + 1}`}>
              {part.toUpperCase()}
            </span>
            {index < textParts.length - 1 && " "}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CosmicParallaxBg;