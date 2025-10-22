import React from 'react';

const PopularPostCard = ({ 
  image = "/popular1.jpg", 
  title = "Popular Post Title", 
  description = "This is a description of the popular post content that provides more details about the topic.",
  category = "Travel",
  readTime = "5 min read",
  date = "Dec 15, 2024"
}) => {
  return (
    <div 
      className="w-full max-w-4xl lg:w-[879px] h-auto lg:h-[275px] border border-gray-200 rounded-xl p-3 lg:p-4 bg-white flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-6"
      style={{ transform: 'scale(1.45)' }}
    >
      {/* Image Section */}
      <div className="w-full lg:w-[372px] h-48 lg:h-[251px] rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-[467px] h-auto lg:h-[251px] flex flex-col justify-between gap-2 lg:gap-3 p-1 lg:p-2">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <span className="bg-[#D2AD3F] text-white px-3 py-1 rounded-full text-xs font-medium">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-black leading-tight mb-2 lg:mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 lg:mb-4 flex-grow">
          {description}
        </p>

        {/* Bottom Section - Date and Read Time */}
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xs text-gray-500">
            {date}
          </span>
          <span className="text-xs text-gray-500">
            {readTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PopularPostCard;
