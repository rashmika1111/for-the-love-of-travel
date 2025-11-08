'use client'

import { motion } from "framer-motion";

const FramerCard = ({ 
  id,
  image = "/framer1.png", 
  title = "Framer Card Title", 
  description = "This is a description of the framer card content that provides more details about the topic.",
  category = "Tour",
  readTime = "5 min read",
  date = "Dec 15, 2024",
  selected,
  setSelected,
  hovered,
  setHovered,
  index = 0
}) => {
  return (
    <motion.div
      onMouseEnter={() => setHovered && setHovered(id)}
      onMouseLeave={() => setHovered && setHovered(null)}
      onClick={() => setSelected && setSelected(selected === id ? null : id)}
      initial={{ 
        opacity: 0, 
        y: 50, 
        scale: 0.8,
        rotateY: -15
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: selected === id ? 1.05 : 1,
        rotateY: 0,
        zIndex: selected === id ? 5 : 1,
      }}
      whileHover={{ 
        scale: 1.08,
        y: -15,
        rotateY: 8,
        zIndex: 10,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2)',
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          duration: 0.4
        }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        duration: 0.6,
        delay: index * 0.15
      }}
      className="w-full max-w-xs sm:w-72 lg:w-[291.87px] h-80 sm:h-96 lg:h-[353.5px] p-4 sm:p-6 lg:p-7 gap-2 lg:gap-2 rounded-2xl flex flex-col relative overflow-hidden cursor-pointer shadow-lg backdrop-blur-sm border border-white/10"
      style={{
        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%), url('${image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Top Left Category Button */}
      <div className="flex justify-start mb-auto">
        <button className="w-20 sm:w-24 lg:w-[88.55px] h-6 sm:h-7 lg:h-[28.34px] rounded-2xl border border-white px-2 sm:px-3 lg:px-2 bg-transparent text-white text-xs sm:text-sm lg:text-xs font-medium cursor-pointer hover:bg-white hover:text-black transition-colors duration-200">
          {category}
        </button>
      </div>

      {/* Title + Description */}
      <div className="w-full flex flex-col justify-center mb-auto">
        <h3 className="font-inter font-semibold text-lg sm:text-xl lg:text-2xl xl:text-3xl leading-tight text-white mb-2 text-shadow-lg">
          {title}
        </h3>
        {selected === id && ( // only show description when selected
          <p className="text-xs sm:text-sm text-white leading-relaxed text-shadow-md">
            {description}
          </p>
        )}
      </div>

      {/* Metadata Bottom Right */}
      <div className="flex justify-end items-end">
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white text-shadow-md">
          <span>{readTime}</span>
          <span>|</span>
          <span>{date}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FramerCard;
