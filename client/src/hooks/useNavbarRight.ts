import { useEffect, useState } from "react";

export function useNavbarRightOffset(active: boolean): number {
  const [offset, setOffset] = useState(16);

  useEffect(() => {
    if (!active) {
      setOffset(16);
      return;
    }

    const measure = () => {
      const pill = document.getElementById("navbar-pill");
      if (pill) {
        const vw = document.documentElement.clientWidth || window.innerWidth;
        setOffset(Math.max(0, vw - pill.getBoundingClientRect().right));
      }
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });

    const t = window.setTimeout(measure, 100);
    const t2 = window.setTimeout(measure, 400);

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [active]);

  return offset;
}
