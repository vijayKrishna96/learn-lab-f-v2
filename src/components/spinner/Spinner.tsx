// components/Loader/Loader.tsx

// Spinner.tsx
import React from "react";
import { Loader } from "lucide-react";

const Spinner: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = "",
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader size={size} className="animate-spin" />
    </div>
  );
};

export default Spinner;
