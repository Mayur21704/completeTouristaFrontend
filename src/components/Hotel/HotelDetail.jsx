

// import { setSelectedRoomWithHotel } from "@/src/store/hotelReducer";
// import {
//   AnimatePresence,
//   motion,
//   useScroll,
//   useTransform,
// } from "framer-motion";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import L from "leaflet";
// import { Bed, Check, Info, Maximize2, Star } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Autoplay,
//   EffectCoverflow,
//   Navigation,
//   Pagination,
// } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import Location from "./Location";

// import "leaflet/dist/leaflet.css";
// import "swiper/css";
// import "swiper/css/effect-coverflow";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// // Fix Leaflet default icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// gsap.registerPlugin(ScrollTrigger);

// const HotelDetail = () => {
//   const headerRef = useRef(null);
//   const contentRef = useRef(null);
//   const [activeImage, setActiveImage] = useState(0);
//   const [activeRoom, setActiveRoom] = useState(0);
//   const { scrollYProgress } = useScroll();
//   const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

//   const dispatch = useDispatch();
//   const hotel = useSelector((state) => state.hotel.selectedHotel);
//   const { numberOfNights, adults, children } = useSelector(
//     (state) => state.hotel.filters
//   );
//   const navigate = useNavigate();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveImage((prev) => (prev + 1) % hotel.hotelImages.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const header = headerRef.current;
//     const content = contentRef.current;
//     const tl = gsap.timeline();

//     tl.fromTo(
//       header,
//       { opacity: 0, y: -100 },
//       {
//         opacity: 1,
//         y: 0,
//         duration: 1,
//         ease: "power3.out",
//       }
//     );

//     const sections = content.children;
//     Array.from(sections).forEach((section) => {
//       gsap.fromTo(
//         section,
//         { opacity: 0, y: 50 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.8,
//           scrollTrigger: {
//             trigger: section,
//             start: "top center+=100",
//             end: "bottom center",
//             toggleActions: "play none none reverse",
//           },
//         }
//       );
//     });

//     return () => {
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, []);

//   const fadeInUp = {
//     initial: { opacity: 0, y: 60 },
//     animate: { opacity: 1, y: 0 },
//     transition: { duration: 0.6 },
//   };

//   const handleBookNow = (hotel, room, offer) => {
//     dispatch(setSelectedRoomWithHotel({ hotel, room, offer }));
//     navigate(`/booking/${hotel.hotelId}/${room.roomType}`);
//   };

//   return (
//     <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
//       {/* Hero Section */}
//       <motion.div
//         ref={headerRef}
//         style={{ opacity }}
//         className="relative h-screen overflow-hidden"
//       >
//         {/* Background Image Slider */}
//         <AnimatePresence initial={false}>
//           <motion.div
//             key={activeImage}
//             initial={{ opacity: 0, scale: 1.1 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             transition={{ duration: 1 }}
//             className="absolute inset-0"
//           >
//             <img
//               src={hotel.hotelImages[activeImage]}
//               alt=""
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
//           </motion.div>
//         </AnimatePresence>

//         {/* Image Navigation */}
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
//           {hotel.hotelImages.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setActiveImage(index)}
//               className={`h-1.5 rounded-full transition-all duration-300 ${
//                 activeImage === index
//                   ? "bg-white w-12"
//                   : "bg-white/50 w-6 hover:bg-white/75"
//               }`}
//             />
//           ))}
//         </div>

//         {/* Content Overlay */}
//         <div className="absolute inset-0 flex flex-col justify-between py-20 px-8 md:px-16 z-10">
//           {/* Top Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="flex justify-between items-start"
//           >
//             <div className="flex items-center space-x-4">
//               <span className="flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white">
//                 <Star className="mr-2 text-yellow-400" size={20} />
//                 <span className="font-medium">
//                   {hotel.reviews.totalRatings}/5 Rating
//                 </span>
//               </span>
//             </div>
//           </motion.div>

//           {/* Center Content */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.3 }}
//             className="text-center text-white space-y-8"
//           >
//             <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
//               {hotel.name}
//             </h1>
//             <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light">
//               Experience luxury and comfort in the heart of the city
//             </p>
//           </motion.div>

//           {/* Quick Info */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.7 }}
//             className="grid grid-cols-2 md:grid-cols-4 gap-6"
//           >
//             {hotel.amenities.slice(0, 4).map((amenity, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{
//                   scale: 1.02,
//                   backgroundColor: "rgba(255, 255, 255, 0.15)",
//                 }}
//                 className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-white text-center transition-all duration-300"
//               >
//                 <Check className="mx-auto mb-3" size={24} />
//                 <span className="font-medium">{amenity}</span>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </motion.div>

//       {/* Content Section */}
//       <div ref={contentRef} className="container mx-auto px-4 py-24 space-y-32">
//         {/* Room Gallery */}
//         <motion.section {...fadeInUp} className="relative">
//           <h2 className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
//             Our Luxurious Rooms
//           </h2>
//           <Swiper
//             effect="coverflow"
//             grabCursor={true}
//             centeredSlides={true}
//             slidesPerView={1.5}
//             spaceBetween={40}
//             autoplay={{
//               delay: 3000,
//               disableOnInteraction: false,
//             }}
//             coverflowEffect={{
//               rotate: 20,
//               stretch: 0,
//               depth: 200,
//               modifier: 1,
//               slideShadows: true,
//             }}
//             pagination={{ clickable: true }}
//             navigation={true}
//             modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
//             className="h-[600px]"
//             breakpoints={{
//               640: {
//                 slidesPerView: 1.8,
//               },
//               1024: {
//                 slidesPerView: 2.5,
//               },
//             }}
//             onSlideChange={(swiper) => setActiveRoom(swiper.activeIndex)}
//           >
//             {hotel.rooms.map((room, index) => (
//               <SwiperSlide key={index}>
//                 <motion.div
//                   className="relative h-full rounded-2xl overflow-hidden shadow-2xl"
//                   whileHover={{ scale: 1.02 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <img
//                     src={room.images[0]}
//                     alt={room.roomType}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-10">
//                     <div className="text-white">
//                       <h3 className="text-3xl font-bold mb-4">
//                         {room.roomType}
//                       </h3>
//                       <p className="text-lg opacity-90 font-light">
//                         {room.description}
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </motion.section>

//         {/* Room Details with Sticky Layout */}
//         <motion.section {...fadeInUp} className="space-y-32">
//           {hotel.rooms.map((room, index) => (
//             <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
//               {/* Left Side - Room Details (Sticky) */}
//               <div className="lg:sticky lg:top-8 space-y-10 bg-white rounded-3xl p-12 shadow-xl shadow-gray-100/50 self-start">
//                 <div>
//                   <h3 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
//                     {room.roomType}
//                   </h3>
//                   <p className="text-gray-600 text-lg leading-relaxed font-light">
//                     {room.description}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-8">
//                   <div className="bg-gray-50 p-8 rounded-2xl">
//                     <Maximize2 className="mb-4 text-gray-600" size={24} />
//                     <h4 className="font-semibold text-lg mb-2">Room Size</h4>
//                     <p className="text-gray-700 text-2xl">{room.roomSize}</p>
//                   </div>
//                   <div className="bg-gray-50 p-8 rounded-2xl">
//                     <Bed className="mb-4 text-gray-600" size={24} />
//                     <h4 className="font-semibold text-lg mb-2">Bed Type</h4>
//                     <p className="text-gray-700 text-2xl">{room.bedType}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="font-semibold text-2xl mb-6">
//                     Room Highlights
//                   </h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     {room.highlights.map((highlight, i) => (
//                       <motion.div
//                         key={i}
//                         className="flex items-center bg-gray-50 p-4 rounded-xl"
//                         whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
//                       >
//                         <Check size={20} className="text-green-500 mr-3" />
//                         <span className="text-gray-700">{highlight}</span>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Right Side - Offers */}
//               <div className="space-y-8">
//                 {room.offers.map((offer, i) => (
//                   <motion.div
//                     key={i}
//                     whileHover={{ scale: 1.01 }}
//                     className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100"
//                   >
//                     <div className="flex justify-between items-start mb-8">
//                       <div>
//                         <h4 className="text-2xl font-bold text-gray-800 mb-3">
//                           {offer.roomType}
//                         </h4>
//                         <p className="text-gray-600 font-light">
//                           {offer.description}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="space-y-8">
//                       <div className="bg-gray-50 p-6 rounded-xl">
//                         <div className="flex items-end justify-between mb-4">
//                           <div>
//                             <p className="text-4xl font-bold text-gray-800">
//                               ₹{offer.price.discounted}
//                               <span className="text-sm ml-2 text-gray-500">
//                                 per night
//                               </span>
//                             </p>
//                             <p className="text-sm text-gray-600 mt-2">
//                               {adults} Adults + {children} Children
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <p className="text-sm text-gray-500 mb-1">
//                               Total for {numberOfNights} nights
//                             </p>
//                             <p className="text-2xl font-semibold text-gray-800">
//                               ₹{offer.price.total}
//                             </p>
//                           </div>
//                         </div>
//                         <motion.button
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                           onClick={() => handleBookNow(hotel, room, offer)}
//                           className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
//                         >
//                           Book Now
//                         </motion.button>
//                       </div>

//                       <div className="border-t pt-8">
//                         <h5 className="font-semibold text-xl mb-6">
//                           Inclusions:
//                         </h5>
//                         <div className="grid grid-cols-2 gap-4">
//                           {offer.inclusions.map((inclusion, idx) => (
//                             <motion.div
//                               key={idx}
//                               className="flex items-center p-4 bg-gray-50 rounded-xl"
//                               whileHover={{
//                                 scale: 1.02,
//                                 backgroundColor: "#f8fafc",
//                               }}
//                             >
//                               <Check className="w-5 h-5 mr-3 text-green-500" />
//                               <span className="text-gray-700 font-light">
//                                 {inclusion.text}
//                               </span>
//                             </motion.div>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="flex items-center text-sm text-gray-600 bg-blue-50 p-5 rounded-xl">
//                         <Info
//                           size={20}
//                           className="mr-3 text-blue-600 flex-shrink-0"
//                         />
//                         <p>{offer.cancellationPolicy}</p>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </motion.section>

//         {/* Location Section */}
//         <Location />

//         {/* Amenities Section */}
//         <motion.section {...fadeInUp} className="mb-16">
//           <h2 className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
//             Hotel Amenities
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {hotel.amenities.map((amenity, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
//                 className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-100/50 flex items-center transition-all duration-300"
//               >
//                 <Check className="text-green-500 mr-4" size={24} />
//                 <span className="text-gray-700 font-medium">{amenity}</span>
//               </motion.div>
//             ))}
//           </div>
//         </motion.section>
//       </div>
//     </div>
//   );
// };

// export default HotelDetail;





{
  /* I'll provide the complete updated code with responsive styling. However, due to length limits in this response, I need to split it into multiple parts. Let me know if you'd like to see the full implementation and I'll provide it in subsequent responses. */
}

import { setSelectedRoomWithHotel } from "@/src/store/hotelReducer";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import L from "leaflet";
import { Bed, Check, Info, Maximize2, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Location from "./Location";

import "leaflet/dist/leaflet.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

gsap.registerPlugin(ScrollTrigger);

const HotelDetail = () => {
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeRoom, setActiveRoom] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const dispatch = useDispatch();
  const hotel = useSelector((state) => state.hotel.selectedHotel);
  const { numberOfNights, adults, children } = useSelector(
    (state) => state.hotel.filters
  );
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % hotel.hotelImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    const content = contentRef.current;
    const tl = gsap.timeline();

    tl.fromTo(
      header,
      { opacity: 0, y: -100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }
    );

    const sections = content.children;
    Array.from(sections).forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top center+=100",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const handleBookNow = (hotel, room, offer) => {
    dispatch(setSelectedRoomWithHotel({ hotel, room, offer }));
    navigate(`/booking/${hotel.hotelId}/${room.roomType}`);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <motion.div
        ref={headerRef}
        style={{ opacity }}
        className="relative h-[80vh] md:h-screen overflow-hidden"
      >
        {/* Background Image Slider */}
        <AnimatePresence initial={false}>
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={hotel.hotelImages[activeImage]}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
          </motion.div>
        </AnimatePresence>

        {/* Image Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-20">
          {hotel.hotelImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeImage === index
                  ? "bg-white w-8 md:w-12"
                  : "bg-white/50 w-4 md:w-6 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between py-12 md:py-20 px-4 md:px-8 lg:px-16 z-10">
          {/* Top Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between items-start"
          >
            <div className="flex items-center space-x-4">
              <span className="flex items-center bg-white/10 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-full text-white">
                <Star className="mr-2 text-yellow-400" size={16} md:size={20} />
                <span className="text-sm md:text-base font-medium">
                  {hotel.reviews.totalRatings}/5 Rating
                </span>
              </span>
            </div>
          </motion.div>

          {/* Center Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center text-white space-y-4 md:space-y-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              {hotel.name}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto font-light px-4">
              Experience luxury and comfort in the heart of the city
            </p>
          </motion.div>

          {/* Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6"
          >
            {hotel.amenities.slice(0, 4).map((amenity, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                }}
                className="bg-white/10 backdrop-blur-md p-3 md:p-6 rounded-xl md:rounded-2xl text-white text-center transition-all duration-300"
              >
                <Check
                  className="mx-auto mb-2 md:mb-3"
                  size={20}
                  md:size={24}
                />
                <span className="text-sm md:text-base font-medium">
                  {amenity}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div
        ref={contentRef}
        className="container mx-auto px-4 py-16 md:py-24 space-y-16 md:space-y-32"
      >
        {/* Room Gallery */}
        <motion.section {...fadeInUp} className="relative">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Our Luxurious Rooms
          </h2>
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1.2}
            spaceBetween={20}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 20,
              stretch: 0,
              depth: 200,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="h-[400px] md:h-[600px]"
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 2.5,
                spaceBetween: 40,
              },
            }}
            onSlideChange={(swiper) => setActiveRoom(swiper.activeIndex)}
          >
            {hotel.rooms.map((room, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="relative h-full rounded-xl md:rounded-2xl overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={room.images[0]}
                    alt={room.roomType}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-6 md:p-10">
                    <div className="text-white">
                      <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">
                        {room.roomType}
                      </h3>
                      <p className="text-sm md:text-lg opacity-90 font-light">
                        {room.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.section>

        {/* Room Details with Sticky Layout */}
        <motion.section {...fadeInUp} className="space-y-16 md:space-y-32">
          {hotel.rooms.map((room, index) => (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16"
            >
              {/* Left Side - Room Details (Sticky) */}
              <div className="lg:sticky lg:top-8 space-y-6 md:space-y-10 bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl shadow-gray-100/50 self-start">
                <div>
                  <h3 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                    {room.roomType}
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light">
                    {room.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-8">
                  <div className="bg-gray-50 p-4 md:p-8 rounded-xl md:rounded-2xl">
                    <Maximize2
                      className="mb-3 md:mb-4 text-gray-600"
                      size={20}
                      md:size={24}
                    />
                    <h4 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                      Room Size
                    </h4>
                    <p className="text-xl md:text-2xl text-gray-700">
                      {room.roomSize}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 md:p-8 rounded-xl md:rounded-2xl">
                    <Bed
                      className="mb-3 md:mb-4 text-gray-600"
                      size={20}
                      md:size={24}
                    />
                    <h4 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                      Bed Type
                    </h4>
                    <p className="text-xl md:text-2xl text-gray-700">
                      {room.bedType}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xl md:text-2xl mb-4 md:mb-6">
                    Room Highlights
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {room.highlights.map((highlight, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center bg-gray-50 p-3 md:p-4 rounded-lg md:rounded-xl"
                        whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                      >
                        <Check
                          size={16}
                          md:size={20}
                          className="text-green-500 mr-2 md:mr-3"
                        />
                        <span className="text-sm md:text-base text-gray-700">
                          {highlight}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Offers */}
              <div className="space-y-6 md:space-y-8">
                {room.offers.map((offer, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white p-6 md:p-10 rounded-xl md:rounded-2xl shadow-lg border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0 mb-6 md:mb-8">
                      <div>
                        <h4 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
                          {offer.roomType}
                        </h4>
                        <p className="text-sm md:text-base text-gray-600 font-light">
                          {offer.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6 md:space-y-8">
                      <div className="bg-gray-50 p-4 md:p-6 rounded-xl">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-0 mb-4">
                          <div>
                            <p className="text-2xl md:text-4xl font-bold text-gray-800">
                              ₹{offer.price.discounted}
                              <span className="text-xs md:text-sm ml-2 text-gray-500">
                                per night
                              </span>
                            </p>
                            <p className="text-xs md:text-sm text-gray-600 mt-2">
                              {adults} Adults + {children} Children
                            </p>
                          </div>
                          <div className="text-left md:text-right">
                            <p className="text-xs md:text-sm text-gray-500 mb-1">
                              Total for {numberOfNights} nights
                            </p>
                            <p className="text-xl md:text-2xl font-semibold text-gray-800">
                              ₹{offer.price.total}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleBookNow(hotel, room, offer)}
                          className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-lg md:rounded-xl text-base md:text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                        >
                          Book Now
                        </motion.button>
                      </div>

                      <div className="border-t pt-6 md:pt-8">
                        <h5 className="font-semibold text-lg md:text-xl mb-4 md:mb-6">
                          Inclusions:
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          {offer.inclusions.map((inclusion, idx) => (
                            <motion.div
                              key={idx}
                              className="flex items-center p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl"
                              whileHover={{
                                scale: 1.02,
                                backgroundColor: "#f8fafc",
                              }}
                            >
                              <Check className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-green-500" />
                              <span className="text-sm md:text-base text-gray-700 font-light">
                                {inclusion.text}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center text-xs md:text-sm text-gray-600 bg-blue-50 p-4 md:p-5 rounded-lg md:rounded-xl">
                        <Info
                          size={16}
                          md:size={20}
                          className="mr-2 md:mr-3 text-blue-600 flex-shrink-0"
                        />
                        <p>{offer.cancellationPolicy}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.section>

        {/* Location Section */}
        <Location />

        {/* Amenities Section */}
        <motion.section {...fadeInUp} className="mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Hotel Amenities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {hotel.amenities.map((amenity, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                className="bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg shadow-gray-100/50 flex items-center transition-all duration-300"
              >
                <Check
                  className="text-green-500 mr-3 md:mr-4"
                  size={20}
                  md:size={24}
                />
                <span className="text-sm md:text-base text-gray-700 font-medium">
                  {amenity}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HotelDetail;