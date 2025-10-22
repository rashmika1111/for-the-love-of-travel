export default function NewSection({ image = "/news1.png" }) {
  return (
    <div className="w-full max-w-lg lg:w-[495px] p-6 lg:p-8 bg-white border border-gray-200 rounded-3xl flex flex-col gap-6 lg:gap-8">
      {/* Header Section with Title and Description */}
      <div className="text-center mb-4 lg:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-3 lg:mb-4">
          Featured Destination
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
          Discover the hidden gems of Sri Lanka with our exclusive travel experiences
        </p>
      </div>

      {/* Main Card */}
      <div 
        className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden relative flex flex-col justify-between p-4 lg:p-6 mx-auto"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) -2.14%, rgba(0,0,0,0.55) 64.58%), url('${image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Tours Button */}
        <div className="self-start">
          <button className="px-3 py-2 rounded-xl border border-white bg-transparent text-white text-xs font-medium cursor-pointer hover:bg-white hover:text-black transition-colors duration-200">
            Tours
          </button>
        </div>

        {/* Content Section */}
        <div className="text-white text-left">
          {/* Main Title */}
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 lg:mb-3 leading-tight">
            Waves & Whispers: Sri Lanka's Hidden Coves
          </h2>
          
          {/* Description */}
          <p className="text-sm sm:text-base opacity-90 mb-3 lg:mb-4 leading-relaxed">
            A barefoot journey through quiet blue shores
          </p>

          {/* Metadata */}
          <div className="text-xs sm:text-sm opacity-80 flex items-center gap-2">
            <span>14 min read</span>
            <span>|</span>
            <span>May 28, 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}