"use client";

import { useEffect, useState } from "react";

const useClientY = () => {
  const [clientY, setClientY] = useState<number>(0);

  const handleGetClientY = () => {
    const top = window.scrollY;

    setClientY(top);
  };

  useEffect(() => {
    handleGetClientY();
    window.addEventListener("scroll", handleGetClientY);

    return () => window.removeEventListener("scroll", handleGetClientY);
  }, []);

  return clientY;
};

export default useClientY;
