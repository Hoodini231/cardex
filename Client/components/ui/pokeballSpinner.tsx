"use client";

import React from "react";
import "@/app/globals.css"; // Ensure this import exists if styles are global

interface PokeballSpinnerProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
}

const PokeballSpinner: React.FC<PokeballSpinnerProps> = ({
  size = "medium",
  showText = true,
}) => {
  const sizeClass =
    size === "small"
      ? "spinnerSmall"
      : size === "large"
      ? "spinnerLarge"
      : "spinnerMedium";

  return (
    <div className="spinnerContainer">
      <div className={`spinner ${sizeClass}`}>
        <div className="pokeballTop" />
        <div className="pokeballBottom" />
        <div className="pokeballMiddle" />
        <div className="pokeballInner" />
      </div>
      {showText && <div className="loadingText">Loading...</div>}
    </div>
  );
};

export default PokeballSpinner;
