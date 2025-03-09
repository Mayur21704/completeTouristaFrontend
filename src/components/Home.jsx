import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ChevronRight,
  Hotel,
  MapPin,
  Mountain,
  Plane,
  Shield,
  Star,
  Sun,
  Wind,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial loading animation
      const tl = gsap.timeline({ onComplete: () => setIsLoaded(true) });

      tl.from(".hero-image", {
        scale: 1.2,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
      })
        .from(
          ".hero-text",
          {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=1.5"
        )
        .from(
          ".hero-subtitle",
          {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .from(
          ".hero-button",
          {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.6"
        );

      // Parallax scrolling effects
      gsap.utils.toArray(".parallax").forEach((section) => {
        gsap.to(section, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Reveal animations for sections
      gsap.utils.toArray(".reveal-section").forEach((section) => {
        gsap.from(section, {
          y: 100,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-white overflow-hidden"
    >
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 hero-image">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
            alt="Travel landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ y }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1
            ref={headerRef}
            className="hero-text text-8xl font-bold mb-6 leading-tight"
          >
            Discover Your
            <br />
            Next Adventure
          </h1>
          <p className="hero-subtitle text-xl mb-12 max-w-2xl mx-auto">
            Embark on a journey of discovery through breathtaking landscapes and
            unforgettable experiences
          </p>
          <div className="flex gap-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/flights")}
              className="hero-button bg-white text-black px-8 py-4 rounded-full text-lg font-medium inline-flex items-center gap-3 hover:gap-4 transition-all duration-300"
            >
              <Plane className="w-5 h-5" />
              Book Flights
              <ChevronRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/hotels")}
              className="hero-button bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-medium inline-flex items-center gap-3 hover:gap-4 transition-all duration-300"
            >
              <Hotel className="w-5 h-5" />
              Find Hotels
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-2 h-2 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Destinations */}
      <section className="py-32 px-4 reveal-section">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-bold mb-6">Featured Destinations</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore our handpicked selection of extraordinary locations
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=2070&auto=format&fit=crop",
                title: "Swiss Alps",
                location: "Switzerland",
                icon: Mountain,
              },
              {
                image:
                  "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2074&auto=format&fit=crop",
                title: "Santorini",
                location: "Greece",
                icon: Sun,
              },
              {
                image:
                  "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070&auto=format&fit=crop",
                title: "Machu Picchu",
                location: "Peru",
                icon: MapPin,
              },
            ].map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-96 object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 text-white">
                    <destination.icon className="w-8 h-8 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">
                      {destination.title}
                    </h3>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {destination.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gray-50 reveal-section">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-bold mb-8">
                Travel with
                <br />
                Confidence
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                Experience worry-free travel with our premium services and
                dedicated support team available 24/7.
              </p>
              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "Secure Booking",
                    desc: "Safe and protected transactions",
                  },
                  {
                    icon: Wind,
                    title: "Flexible Plans",
                    desc: "Easy modifications and cancellations",
                  },
                  {
                    icon: Star,
                    title: "Premium Service",
                    desc: "24/7 customer support worldwide",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="flex items-start gap-4"
                  >
                    <div className="p-3 bg-white rounded-2xl shadow-md">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
                alt="Travel experience"
                className="w-full h-[600px] object-cover rounded-3xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <Plane className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Next Flight</p>
                    <p className="font-semibold">Paris → Rome</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <p className="text-sm text-gray-600">On Schedule</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 reveal-section">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-blue-600 text-white">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop"
                alt="Background"
                className="w-full h-full object-cover mix-blend-overlay opacity-20"
              />
            </div>
            <div className="relative z-10 py-24 px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-5xl font-bold mb-8">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-xl mb-12 max-w-2xl mx-auto">
                  Join thousands of travelers who trust us for their adventures
                </p>
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
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
