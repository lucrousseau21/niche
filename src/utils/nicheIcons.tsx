import React from "react";
import { BsCurrencyBitcoin, BsGraphUp } from "react-icons/bs";
import {
  FaRobot,
  FaLaptopCode,
  FaBalanceScale,
  FaMoneyBillWave,
} from "react-icons/fa";

export const getNicheIcon = (nicheName: string): React.ReactNode => {
  if (!nicheName) return <FaLaptopCode className="text-3xl text-gray-400" />;

  switch (nicheName.toLowerCase()) {
    case "crypto":
      return <BsCurrencyBitcoin className="text-3xl" />;
    case "intelligence artificielle":
    case "ia":
      return <FaRobot className="text-3xl" />;
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
      return <FaLaptopCode className="text-3xl text-gray-400" />;
  }
};
