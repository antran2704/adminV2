import { useState, useEffect } from "react";

interface windowDimensionProps {
  width: number | undefined;
  height: number | undefined;
}
const useWindowDimensions = (): windowDimensionProps => {
  const [windowDimension, setWindowDimension] = useState<windowDimensionProps>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize(): void {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowDimension;
};

export default useWindowDimensions;
