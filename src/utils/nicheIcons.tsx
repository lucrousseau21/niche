import React from "react";
import { BsCurrencyBitcoin, BsGraphUp } from "react-icons/bs";
import {
  FaRobot,
  FaLaptopCode,
  FaBalanceScale,
  FaMoneyBillWave,
  FaPalette,
} from "react-icons/fa";
import { HiOutlineColorSwatch } from "react-icons/hi";

export const getNicheIcon = (nicheName: string): React.ReactNode => {
  if (!nicheName) return <FaLaptopCode className="text-3xl text-gray-400" />;

  const key = nicheName.toLowerCase();

  if (
    key.includes("fullstack") ||
    key.includes("web3") ||
    key.includes("développement")
  ) {
    return <FaLaptopCode className="text-3xl" />;
  }
  if (
    key.includes("intelligence artificielle") ||
    key.includes("ia") ||
    key.includes("data")
  ) {
    return <FaRobot className="text-3xl" />;
  }
  if (key.includes("design") || key.includes("ux") || key.includes("interface")) {
    return <FaPalette className="text-3xl" />;
  }

  switch (key) {
    case "crypto":
      return <BsCurrencyBitcoin className="text-3xl" />;
    case "droit":
      return <FaBalanceScale className="text-3xl" />;
    case "marketing":
      return <BsGraphUp className="text-3xl" />;
    case "finance":
      return <FaMoneyBillWave className="text-3xl" />;
    case "tech":
    case "technologie":
      return <FaLaptopCode className="text-3xl" />;
    default:
      return <HiOutlineColorSwatch className="text-3xl text-gray-400" />;
  }
};
