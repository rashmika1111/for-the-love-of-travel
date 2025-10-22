"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PinnedImageOverlay from "./PinnedImageOverlay";

export default function ArticleWithPinnedImage() {
  // Build your article "cards" as JSX bodies so all your existing markup/animations stay intact.
  const articles = [
    {
      title: "Embarking on the Journey",
      body: (
        <motion.div
          className="mb-6 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="text-gray-900 sm:text-gray-800 leading-relaxed text-base sm:text-lg md:text-xl" style={{ fontFamily: "Inter" }}>
            <span className="float-left mr-3 text-6xl sm:text-7xl lg:text-8xl font-semibold leading-none text-gray-900">
              E
            </span>
            mbarking on the journey through the significant trends in recreation for designers,
            as predicted by the industry, reveals a dynamic landscape of innovation and creativity.
            From immersive experiences to sustainable practices, these trends shape the future of design
            and inspire professionals to push the boundaries of their craft.
          </p>
        </motion.div>
      ),
      meta: "Intro",
    },
    {
      title: "Complete Paragraph Block",
      body: (
        <motion.div
          className="mb-6 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="text-gray-900 sm:text-gray-800 leading-relaxed mb-4 sm:mb-8 text-base sm:text-lg md:text-xl" style={{ fontFamily: "Inter" }}>
            Recreation isn't just about leisure anymore; it's about pushing boundaries, exploring new horizons, and finding inspiration in unexpected places. As we step into 2024, the design industry is abuzz with anticipation for the latest trends shaping recreational activities for designers. From adrenaline-pumping adventures to serene wellness retreats, designers are seeking diverse experiences to fuel their creativity and enhance their well-being.
          </p>
          <p className="text-gray-900 sm:text-gray-800 leading-relaxed mb-4 sm:mb-8 text-base sm:text-lg md:text-xl" style={{ fontFamily: "Inter" }}>
            One of the most talked-about trends predicted for 2024 is the rise of extreme off-road experiences, with desert dune buggying leading the pack. Picture this: the vast expanse of golden sand dunes stretching as far as the eye can see, the roar of the engine as you navigate the rugged terrain, and the exhilarating rush of adrenaline as you conquer each sandy slope. Dune buggying in the desert promises an unforgettable adventure that combines thrill-seeking with awe-inspiring natural beauty.
          </p>
          <p className="text-gray-900 sm:text-gray-800 leading-relaxed mb-4 sm:mb-8 text-base sm:text-lg md:text-xl" style={{ fontFamily: "Inter" }}>
            These recreational trends are not just about having fun; they represent a fundamental shift in how designers approach their work. By stepping outside their comfort zones and embracing new experiences, designers are discovering fresh perspectives that translate into innovative solutions. The connection between recreation and creativity becomes evident as designers return from these adventures with renewed energy, fresh ideas, and a deeper understanding of the delicate balance of the natural world.
          </p>
        </motion.div>
      ),
      meta: "Trends • 2024",
    },
    {
      title: "Boat Image",
      body: (
        <motion.div
          className="my-8 sm:my-16"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Image
            src="/images/48b45fddefe25c7d2666ffca16947645b38eada5.png"
            alt="Travel destination image"
            width={600}
            height={450}
            className="w-full h-auto object-contain rounded-lg shadow-lg"
          />
        </motion.div>
      ),
      meta: "Figure 1",
    },
    {
      title: "Complete Article Below Image",
      body: (
        <motion.div
          className="mb-6 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="text-gray-900 sm:text-gray-800 leading-relaxed text-base sm:text-lg md:text-xl" style={{ fontFamily: "Inter" }}>
            <span className="float-left mr-3 text-6xl sm:text-7xl lg:text-8xl font-semibold leading-none text-gray-900">E</span>
            mbarking on the journey through the significant trends in recreation for designers,
            as predicted by the industry, reveals a dynamic landscape of innovation and creativity.
            From immersive experiences to sustainable practices, these trends shape the future of design
            and inspire professionals to push the boundaries of their craft.
          </p>
          <p className="text-gray-900 sm:text-gray-800 leading-relaxed mb-4 sm:mb-8 text-base sm:text-lg md:text-xl" style={{ fontFamily: "Inter" }}>
            Recreation isn't just about leisure anymore; it's about pushing boundaries, exploring new horizons, and finding inspiration in unexpected places. As we step into 2024, the design industry is abuzz with anticipation for the latest trends shaping recreational activities for designers. From adrenaline-pumping adventures to serene wellness retreats, designers are seeking diverse experiences to fuel their creativity and enhance their well-being.
          </p>
          <p className="text-gray-900 sm:text-gray-800 leading-relaxed mb-4 sm:mb-8 text-base sm:text-lg md:text-xl" style={{ fontFamily: "Inter" }}>
            One of the most talked-about trends predicted for 2024 is the rise of extreme off-road experiences, with desert dune buggying leading the pack. Picture this: the vast expanse of golden sand dunes stretching as far as the eye can see, the roar of the engine as you navigate the rugged terrain, and the exhilarating rush of adrenaline as you conquer each sandy slope. Dune buggying in the desert promises an unforgettable adventure that combines thrill-seeking with awe-inspiring natural beauty.
          </p>
          <p className="text-gray-900 sm:text-gray-800 leading-relaxed mb-4 sm:mb-8 text-base sm:text-lg md:text-xl" style={{ fontFamily: "Inter" }}>
            These recreational trends are not just about having fun; they represent a fundamental shift in how designers approach their work. By stepping outside their comfort zones and embracing new experiences, designers are discovering fresh perspectives that translate into innovative solutions. The connection between recreation and creativity becomes evident as designers return from these adventures with renewed energy, fresh ideas, and a deeper understanding of the delicate balance of the natural world.
          </p>
        </motion.div>
      ),
    },
    {
      title: "Additional Content for Scrolling",
      body: (
        <motion.div
          className="mb-6 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="text-gray-900 sm:text-gray-800 leading-relaxed mb-4 sm:mb-8 text-base sm:text-lg md:text-xl" style={{ fontFamily: "Inter" }}>
            The evolution of recreational activities for designers reflects a broader cultural shift towards experiential learning and personal growth. As the boundaries between work and play continue to blur, designers are finding innovative ways to integrate their professional development with their personal interests and passions.
          </p>
          <p className="text-gray-900 sm:text-gray-800 leading-relaxed mb-4 sm:mb-8 text-base sm:text-lg md:text-xl" style={{ fontFamily: "Inter" }}>
            This trend towards adventure-based recreation is not just about physical challenges; it's about mental resilience, creative problem-solving, and the ability to adapt to unexpected situations. These skills are directly transferable to the design process, where creativity often emerges from the ability to navigate uncertainty and find innovative solutions to complex problems.
          </p>
        </motion.div>
      ),
    },
    {
      title: "Looking Ahead",
      body: (
        <motion.div
          className="mb-6 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="text-gray-900 sm:text-gray-800 leading-relaxed mb-4 sm:mb-8 text-base sm:text-lg md:text-xl" style={{ fontFamily: "Inter" }}>
            The connection between outdoor recreation and design innovation is becoming increasingly apparent as more professionals seek inspiration from natural environments. The organic shapes, textures, and patterns found in nature often serve as the foundation for breakthrough design concepts that resonate with users on a fundamental level.
          </p>
          <p className="text-gray-900 sm:text-gray-800 leading-relaxed mb-4 sm:mb-8 text-base sm:text-lg md:text-xl" style={{ fontFamily: "Inter" }}>
            As we look towards the future, the integration of recreational activities into professional development will likely become even more sophisticated. Virtual reality experiences, augmented reality adventures, and other technological innovations will create new opportunities for designers to explore, learn, and grow in ways that were previously unimaginable.
          </p>
        </motion.div>
      ),
    },
  ];

  return (
    <PinnedImageOverlay
      imageUrl="/images/fda08960788ac48d0e9729d96349d66cce42cefd.png"
      imageAlt="Travel destination image"
      scrim
      viewportVh={100}
      // The component is resilient: if `articles` is undefined/null it won't crash.
      articles={articles}
      images={[
        "/images/fda08960788ac48d0e9729d96349d66cce42cefd.png",
        "/images/48b45fddefe25c7d2666ffca16947645b38eada5.png",
        "/images/74654a8f67369b797c8fb2e96a533fd515fb2939.jpg"
      ]}
      lead={
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight">
          The city of Porto is full of sky-high lookouts and rooftop bars that afford expansive views, yet the most memorable and unique vistas are those at street level.
        </h2>
      }
    />
  );
}
