'use client'

import { motion } from "framer-motion";

const DropdownFramerCard = ({
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
  setHovered
}) => {
  return (
    <motion.div
      onMouseEnter={() => setHovered && setHovered(id)}
      onMouseLeave={() => setHovered && setHovered(null)}
      onClick={() => setSelected && setSelected(selected === id ? null : id)}
      whileHover={{
        scale: 1.2,
        zIndex: 10,
        transition: { duration: 0.2 }
      }}
      animate={{
        scale: selected === id ? 1.05 : 1,
        zIndex: selected === id ? 5 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.3
      }}
      style={{
        width: '110px',
        height: '140px',
        opacity: 1,
        padding: '10px 12px',
        gap: '3px',
        borderRadius: '8px',
        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%), url('${image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      {/* Top Left Category Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 'auto' }}>
        <button style={{
          width: '35px',
          height: '12px',
          borderRadius: '6px',
          border: '0.5px solid #FFFFFF',
          padding: '3px',
          background: 'transparent',
          color: '#FFFFFF',
          fontSize: '5px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          {category}
        </button>
      </div>

      {/* Title + Description */}
      <div style={{ width: '80px', height: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 'auto' }}>
        <h3 style={{
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: '12px',
          lineHeight: '16px',
          color: '#FFFFFF',
          margin: 0,
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
        }}>
          {title}
        </h3>
        {selected === id && ( // only show description when selected
          <p style={{
            fontSize: '5px',
            color: '#FFFFFF',
            margin: 0,
            lineHeight: '1.5',
            textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.7)'
          }}>
            {description}
          </p>
        )}
      </div>

      {/* Metadata Bottom Right */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '4px', color: '#FFFFFF', textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.7)' }}>
          <span>{readTime}</span>
          <span>|</span>
          <span>{date}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DropdownFramerCard;