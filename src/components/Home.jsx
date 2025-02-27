import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronRight,
  Compass,
  Globe2,
  Hotel,
  Plane,
  Shield,
  Star,
  Wind,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/effect-creative";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const planeRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation for the globe
      gsap.to(globeRef.current, {
        y: 20,
        rotation: 360,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Flying plane animation
      gsap.to(planeRef.current, {
        x: "random(-20, 20)",
        y: "random(-20, 20)",
        rotation: "random(-10, 10)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Parallax sections
      gsap.utils.toArray(".parallax-section").forEach((section, i) => {
        const depth = i * 0.2;

        gsap.to(section, {
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
          y: `${depth * 100}%`,
          ease: "none",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-blue-900 via-blue-600 to-blue-400 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div
          style={{ y, opacity }}
          className="text-center text-white z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
            className="relative inline-block mb-12"
          >
            <Globe2 ref={globeRef} className="w-24 h-24 text-white/90" />
            <motion.div
              ref={planeRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Plane className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
          >
            Explore Beyond
          </motion.h1>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-2xl text-blue-100 mb-16 max-w-2xl mx-auto"
          >
            Your journey to extraordinary destinations begins with a single
            click
          </motion.p>

          <div className="flex gap-8 justify-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              onClick={() => navigate("/flightSearch")}
              className="group cursor-pointer"
            >
              <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl overflow-hidden transition-all duration-500 group-hover:bg-white/20 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
                <Plane className="w-12 h-12 text-white mb-4 relative z-10 transform transition-transform group-hover:rotate-12" />
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
                  Flight Booking
                </h3>
                <p className="text-blue-100 mb-4 relative z-10">
                  Discover seamless air travel
                </p>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center text-white/80 group-hover:text-white"
                >
                  <span>Book Now</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              onClick={() => navigate("/hotelSearch")}
              className="group cursor-pointer"
            >
              <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl overflow-hidden transition-all duration-500 group-hover:bg-white/20 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
                <Hotel className="w-12 h-12 text-white mb-4 relative z-10 transform transition-transform group-hover:rotate-12" />
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
                  Hotel Booking
                </h3>
                <p className="text-blue-100 mb-4 relative z-10">
                  Find your perfect stay
                </p>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center text-white/80 group-hover:text-white"
                >
                  <span>Book Now</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Experience Section */}
      <section className="relative py-32 parallax-section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center text-white mb-16"
          >
            <h2 className="text-6xl font-bold mb-6">Travel Experience</h2>
            <p className="text-xl text-blue-100">
              Redefining your journey with premium services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Compass,
                title: "Expert Guidance",
                desc: "24/7 travel assistance",
              },
              {
                icon: Shield,
                title: "Secure Booking",
                desc: "Safe and protected",
              },
              {
                icon: Wind,
                title: "Flexible Plans",
                desc: "Easy modifications",
              },
              { icon: Star, title: "Best Deals", desc: "Premium experiences" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-3xl transform transition-transform group-hover:scale-105" />
                <div className="relative p-8 text-center">
                  <item.icon className="w-12 h-12 text-white mx-auto mb-6 transform transition-transform group-hover:rotate-12" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-blue-100">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-32 parallax-section">
        <div className="container mx-auto px-4">
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30" />
            <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl font-bold mb-8"
              >
                Ready to Begin Your Journey?
              </motion.h2>
              <p className="text-xl text-blue-100 mb-12">
                Join thousands of travelers who trust us for their adventures
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Exploring
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
