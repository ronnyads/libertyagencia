import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[99997] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #00D4FF, #7C3AED, #00D4FF)",
      }}
    />
  );
};

export default ScrollProgress;
