import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

const LoadingIndicator: React.FC = () => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1); // 1 → 2 → 3 → 1 …
    }, 500); // 0.5秒ごとに更新

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "2rem",
        fontFamily: "monospace",
      }}
    >
      Loading{".".repeat(dotCount)}
    </Box>
  );
};

export default LoadingIndicator;
