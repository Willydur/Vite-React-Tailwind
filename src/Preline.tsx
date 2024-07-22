// PrelineScriptLoader.jsx
import { useEffect } from "react";

const PrelineScriptLoader = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "node_modules/preline/dist/preline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default PrelineScriptLoader;
