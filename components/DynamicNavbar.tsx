"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DropdownFramerCard from "./DropdownFramerCard";
import { categoriesApi } from "@/lib/api";
import { Category } from "@/types";

export default function DynamicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [chevronHovered, setChevronHovered] = useState<string | null>(null);
  const [hoveredDropdownItem, setHoveredDropdownItem] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

          // Fetch categories on component mount
          useEffect(() => {
            const fetchCategories = async () => {
              try {
                const response = await categoriesApi.getCategoryTree();
                if (response.success) {
                  // Sort categories by order field
                  const sortedCategories = response.data.sort((a, b) => (a.order || 0) - (b.order || 0));
                  setCategories(sortedCategories);
                }
              } catch (error) {
                console.error('Error fetching categories:', error);
              } finally {
                setLoading(false);
              }
            };

            fetchCategories();
          }, []);

  // Check for invalid category URLs and redirect if needed
  useEffect(() => {
    if (categories.length > 0 && pathname.startsWith('/category/')) {
      const currentSlug = pathname.replace('/category/', '');
      const categoryExists = categories.some(cat => cat.slug === currentSlug);
      
      if (!categoryExists) {
        // Try to find a category with a similar name (case-insensitive)
        const similarCategory = categories.find(cat => 
          cat.name.toLowerCase().replace(/[^a-z0-9]/g, '') === 
          currentSlug.toLowerCase().replace(/[^a-z0-9]/g, '')
        );
        
        if (similarCategory) {
          // Redirect to the correct URL
          router.replace(`/category/${similarCategory.slug}`);
        }
      }
    }
  }, [categories, pathname, router]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (open && !(event.target as Element).closest(".mobile-menu-container")) {
        setOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout, open]);

  const handleMouseEnter = (categoryName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setActiveDropdown(categoryName);
    setChevronHovered(categoryName);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
      setChevronHovered(null);
      setHoveredDropdownItem(null);
    }, 100);
    setHoverTimeout(timeout);
  };

  const isActive = (category: Category) => {
    if (category.slug === 'destinations' && pathname === '/destination') return true;
    if (category.slug === 'experiences' && pathname === '/vacation') return true;
    if (category.slug === 'vacations' && pathname === '/vacation') return true;
    if (category.slug === 'stay' && pathname === '/Tour') return true;
    
    // Check if we're on a category page
    if (pathname.startsWith('/category/')) {
      const currentSlug = pathname.replace('/category/', '');
      return currentSlug === category.slug;
    }
    
    return false;
  };


  // Generate cards for categories (similar to current navbar structure)
  const generateCategoryCards = (category: Category) => {
    const cardTemplates: { [key: string]: any[] } = {
      destinations: [
        {
          id: "destinations-card-1",
          image: "/framer2.png",
          title: "Europe",
          description: "Explore historic cities and cultures",
          category: "Travel",
          readTime: "5 min read",
          date: "Dec 14, 2024",
        },
        {
          id: "destinations-card-2",
          image: "/framer3.png",
          title: "Asia",
          description: "Discover ancient traditions and modern cities",
          category: "Travel",
          readTime: "6 min read",
          date: "Dec 13, 2024",
        },
        {
          id: "destinations-card-3",
          image: "/framer1.png",
          title: "Americas",
          description: "From North to South America adventures",
          category: "Travel",
          readTime: "4 min read",
          date: "Dec 12, 2024",
        },
        {
          id: "destinations-card-4",
          image: "/framer2.png",
          title: "Africa & Oceania",
          description: "Wildlife, beaches, and unique landscapes",
          category: "Travel",
          readTime: "7 min read",
          date: "Dec 11, 2024",
        },
      ],
      experiences: [
        {
          id: "experiences-card-1",
          image: "/framer1.png",
          title: "Adventure Tours",
          description: "Thrilling outdoor experiences",
          category: "Adventure",
          readTime: "4 min read",
          date: "Dec 15, 2024",
        },
        {
          id: "experiences-card-2",
          image: "/framer2.png",
          title: "Cultural Immersion",
          description: "Authentic local experiences",
          category: "Culture",
          readTime: "5 min read",
          date: "Dec 14, 2024",
        },
        {
          id: "experiences-card-3",
          image: "/framer3.png",
          title: "Luxury Retreats",
          description: "Premium travel experiences",
          category: "Luxury",
          readTime: "6 min read",
          date: "Dec 13, 2024",
        },
        {
          id: "experiences-card-4",
          image: "/framer1.png",
          title: "Wellness Journeys",
          description: "Mind, body, and soul renewal",
          category: "Wellness",
          readTime: "5 min read",
          date: "Dec 12, 2024",
        },
      ],
      stay: [
        {
          id: "stay-card-1",
          image: "/framer2.png",
          title: "Luxury Hotels",
          description: "5-star accommodations worldwide",
          category: "Hotels",
          readTime: "4 min read",
          date: "Dec 15, 2024",
        },
        {
          id: "stay-card-2",
          image: "/framer3.png",
          title: "Boutique Resorts",
          description: "Unique and intimate stays",
          category: "Resorts",
          readTime: "5 min read",
          date: "Dec 14, 2024",
        },
        {
          id: "stay-card-3",
          image: "/framer1.png",
          title: "Villa Rentals",
          description: "Private homes and villas",
          category: "Villas",
          readTime: "6 min read",
          date: "Dec 13, 2024",
        },
        {
          id: "stay-card-4",
          image: "/framer2.png",
          title: "Unique Stays",
          description: "Extraordinary accommodations",
          category: "Unique",
          readTime: "5 min read",
          date: "Dec 12, 2024",
        },
      ],
      cruise: [
        {
          id: "cruise-card-1",
          image: "/framer1.png",
          title: "Ocean Cruises",
          description: "Majestic sea voyages",
          category: "Ocean",
          readTime: "4 min read",
          date: "Dec 15, 2024",
        },
        {
          id: "cruise-card-2",
          image: "/framer2.png",
          title: "River Cruises",
          description: "Intimate river journeys",
          category: "River",
          readTime: "5 min read",
          date: "Dec 14, 2024",
        },
        {
          id: "cruise-card-3",
          image: "/framer3.png",
          title: "Expedition Cruises",
          description: "Adventure and exploration",
          category: "Expedition",
          readTime: "6 min read",
          date: "Dec 13, 2024",
        },
        {
          id: "cruise-card-4",
          image: "/framer1.png",
          title: "Cruise Reviews",
          description: "Expert insights and tips",
          category: "Reviews",
          readTime: "5 min read",
          date: "Dec 12, 2024",
        },
      ],
      inspiration: [
        {
          id: "inspiration-card-1",
          image: "/framer2.png",
          title: "Travel Guides",
          description: "Comprehensive destination guides",
          category: "Guides",
          readTime: "4 min read",
          date: "Dec 15, 2024",
        },
        {
          id: "inspiration-card-2",
          image: "/framer3.png",
          title: "Travel Stories",
          description: "Inspiring travel narratives",
          category: "Stories",
          readTime: "5 min read",
          date: "Dec 14, 2024",
        },
        {
          id: "inspiration-card-3",
          image: "/framer1.png",
          title: "Photo Journeys",
          description: "Visual travel experiences",
          category: "Photography",
          readTime: "6 min read",
          date: "Dec 13, 2024",
        },
        {
          id: "inspiration-card-4",
          image: "/framer2.png",
          title: "Bucket Lists",
          description: "Must-see destinations",
          category: "Bucket List",
          readTime: "5 min read",
          date: "Dec 12, 2024",
        },
      ],
    };

    return cardTemplates[category.slug] || [];
  };

  if (loading) {
    return (
      <header className="fixed inset-x-0 top-0 z-[9999] w-full pb-4">
        <div className="container relative flex h-24 items-center">
          <Link href="/" className="relative z-50 flex items-center mt-6 ml-2 md:ml-0">
            <Image
              src="/icon.png"
              alt="For the Love of Travel Logo"
              width={180}
              height={60}
              className="h-16 w-auto"
              priority
            />
          </Link>
          <div className="hidden md:block absolute left-[240px] right-32 mt-6">
            <div className="w-full flex items-center justify-center rounded-[18px] px-8 py-4 bg-white/40 backdrop-blur-[20px] border border-white/35">
              <div className="text-gray-600">Loading navigation...</div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[9999] w-full pb-4"
      initial={{ y: 0 }}
      animate={{
        y: 0,
        backgroundColor: open
          ? "rgba(255,255,255,0.15)"
          : isScrolled
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0)",
        backdropFilter: open ? "blur(20px)" : isScrolled ? "blur(20px)" : "blur(0px)",
        borderBottomColor: open
          ? "rgba(255,255,255,0.2)"
          : isScrolled
          ? "rgba(255,255,255,0.1)"
          : "rgba(255,255,255,0)",
        borderBottomWidth: open || isScrolled ? "1px" : "0px",
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        backgroundColor: { duration: 0.3 },
        backdropFilter: { duration: 0.3 },
        borderBottomColor: { duration: 0.3 },
      }}
    >
      <div className="container relative flex h-24 items-center">
        {/* Logo */}
        <Link href="/" className="relative z-50 flex items-center mt-6 ml-2 md:ml-0">
          <Image
            src="/icon.png"
            alt="For the Love of Travel Logo"
            width={180}
            height={60}
            className="h-16 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:block absolute left-[240px] right-32 mt-6">
          <motion.nav
            className="relative w-full flex items-center justify-between rounded-[18px] px-8 py-4"
            animate={{
              backgroundColor: "rgba(255,255,255,0.4)",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: isScrolled ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.35)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "none",
            } as any}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
              backgroundColor: { duration: 0.2 },
              borderColor: { duration: 0.2 },
              backdropFilter: { duration: 0.2 },
            }}
          >
            {/* DESKTOP NAVIGATION LINKS */}
            <div className="flex items-center gap-8">
              {/* Home Link */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Link
                  href="/"
                  className={[
                    "text-sm font-medium transition-all duration-300 ease-out",
                    pathname === "/" ? "text-brand-gold font-semibold" : "text-black hover:text-brand-gold",
                  ].join(" ")}
                >
                  Home
                </Link>
              </motion.div>

              {/* Simple Posts Link */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Link
                  href="/simple"
                  className={[
                    "text-sm font-medium transition-all duration-300 ease-out",
                    pathname === "/simple" ? "text-brand-gold font-semibold" : "text-black hover:text-brand-gold",
                  ].join(" ")}
                >
                  Simple Posts
                </Link>
              </motion.div>

              {/* Dynamic Category Links */}
              {categories.map((category) => {
                const isDropdownOpen = activeDropdown === category.name;
                const hasChildren = category.children && category.children.length > 0;
                const cards = generateCategoryCards(category);

                return (
                  <motion.div
                    key={category._id}
                    className="relative"
                    onMouseEnter={() => {
                      if (hoverTimeout) {
                        clearTimeout(hoverTimeout);
                        setHoverTimeout(null);
                      }
                      setActiveDropdown(category.name);
                      setChevronHovered(category.name);
                    }}
                    onMouseLeave={() => {
                      const timeout = setTimeout(() => {
                        setActiveDropdown(null);
                        setChevronHovered(null);
                        setHoveredDropdownItem(null);
                      }, 100);
                      setHoverTimeout(timeout);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Link
                      href={category.slug === 'destinations' ? '/destination' : 
                            category.slug === 'experiences' ? '/vacation' :
                            category.slug === 'vacations' ? '/vacation' :
                            category.slug === 'stay' ? '/Tour' :
                            `/category/${category.slug}`}
                      className={[
                        "text-sm font-medium transition-all duration-300 ease-out",
                        isActive(category) ? "text-brand-gold font-semibold" : "text-black hover:text-brand-gold",
                      ].join(" ")}
                    >
                      {category.name}
                    </Link>

                    {/* Desktop dropdown */}
                    <AnimatePresence>
                      {isDropdownOpen && hasChildren && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.9, rotateX: -10 }}
                          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                          exit={{ opacity: 0, y: 15, scale: 0.9, rotateX: -10 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                          className="absolute top-full left-0 mt-2 z-50"
                          style={{ display: "flex", gap: "10px" }}
                        >
                          <div
                            className="w-56 rounded-2xl shadow-2xl overflow-hidden"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.25)",
                              borderWidth: "1px",
                              borderStyle: "solid",
                              borderColor: "rgba(255,255,255,0.4)",
                              backdropFilter: "blur(20px)",
                              WebkitBackdropFilter: "blur(20px)",
                              boxShadow:
                                "0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.05)",
                            }}
                          >
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            <div className="py-3">
                              {category.children?.map((child, index) => (
                                <motion.div
                                  key={child._id}
                                  initial={{ opacity: 0, x: -15, y: 5 }}
                                  animate={{ opacity: 1, x: 0, y: 0 }}
                                  transition={{
                                    delay: index * 0.08,
                                    duration: 0.3,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                  }}
                                >
                                  <Link
                                    href={`/category/${child.slug}`}
                                    className={`group relative block px-5 py-3 text-sm font-medium transition-all duration-300 ease-out ${
                                      hoveredDropdownItem === `${category.name}-${child.name}`
                                        ? "text-brand-gold bg-white/20 shadow-sm"
                                        : "text-gray-900 hover:text-brand-gold hover:bg-white/15"
                                    }`}
                                    onMouseEnter={() => {
                                      if (hoverTimeout) {
                                        clearTimeout(hoverTimeout);
                                        setHoverTimeout(null);
                                      }
                                      setHoveredDropdownItem(`${category.name}-${child.name}`);
                                    }}
                                    onMouseLeave={() => {
                                      const timeout = setTimeout(() => {
                                        setHoveredDropdownItem(null);
                                      }, 50);
                                      setHoverTimeout(timeout);
                                    }}
                                  >
                                    <motion.div
                                      className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold rounded-r-full"
                                      initial={{ scaleY: 0 }}
                                      animate={{
                                        scaleY:
                                          hoveredDropdownItem === `${category.name}-${child.name}` ? 1 : 0,
                                      }}
                                      transition={{ duration: 0.2 }}
                                    />
                                    <span className="relative z-10 capitalize tracking-wide">
                                      {child.name}
                                    </span>
                                    <motion.div
                                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gold opacity-0"
                                      animate={{
                                        opacity:
                                          hoveredDropdownItem === `${category.name}-${child.name}` ? 1 : 0,
                                        x:
                                          hoveredDropdownItem === `${category.name}-${child.name}` ? 0 : -5,
                                      }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      →
                                    </motion.div>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Card preview */}
                          {chevronHovered === category.name && cards.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                gap: "4px",
                                width: "192px",
                                height: "72px",
                                padding: "4px",
                              }}
                            >
                              {cards.map((card) => {
                                const isSelected = selectedCard === card.id;
                                const isHovered = hoveredCard === card.id;

                                return (
                                  <motion.div
                                    key={card.id}
                                    style={{
                                      width: "44px",
                                      height: "65px",
                                      opacity: 1,
                                      borderRadius: "3px",
                                      padding: "3px 5px",
                                      gap: "3px",
                                      backgroundColor: "rgba(255,255,255,0.2)",
                                      borderWidth: "1px",
                                      borderStyle: "solid",
                                      borderColor: "rgba(255,255,255,0.35)",
                                      backdropFilter: "blur(20px)",
                                      WebkitBackdropFilter: "blur(20px)",
                                      boxShadow: "none",
                                      filter: "none",
                                      zIndex: isSelected ? 10 : isHovered ? 5 : 1,
                                    }}
                                    animate={{
                                      scale: isSelected ? 1.1 : isHovered ? 0.95 : 1,
                                      y: isSelected ? -4 : 0,
                                    }}
                                    whileHover={{
                                      scale: 0.95,
                                      transition: { duration: 0.2, ease: "easeOut" },
                                    }}
                                    whileTap={{ scale: 0.8 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    onClick={() => setSelectedCard(isSelected ? null : card.id)}
                                  >
                                    <DropdownFramerCard
                                      id={card.id}
                                      image={card.image}
                                      title={card.title}
                                      description={card.description}
                                      category={card.category}
                                      readTime={card.readTime}
                                      date={card.date}
                                      selected={selectedCard}
                                      setSelected={setSelectedCard}
                                      hovered={hoveredCard}
                                      setHovered={setHoveredCard}
                                    />
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Desktop search */}
            <div
              className="flex items-center gap-3 w-56 justify-end"
              onMouseEnter={() => setSearchOpen(true)}
              onMouseLeave={() => setSearchOpen(false)}
            >
              <AnimatePresence initial={false}>
                {searchOpen && (
                  <motion.div
                    key="nav-search-container"
                    className="relative"
                    initial={{ width: 0, opacity: 0, scale: 0.8 }}
                    animate={{ width: 200, opacity: 1, scale: 1 }}
                    exit={{
                      width: 0,
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.2 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 35,
                    }}
                  >
                    <div
                      className="relative w-full h-10 rounded-full overflow-hidden"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: "rgba(255,255,255,0.3)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Search destinations..."
                        className="w-full h-full px-4 pr-10 bg-transparent text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
                        autoFocus
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Search className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!searchOpen && (
                <motion.button
                  className="p-2 rounded-full transition-all duration-300 ease-out hover:bg-white/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="w-5 h-5 text-gray-700" />
                </motion.button>
              )}
            </div>
          </motion.nav>
        </div>

        {/* Mobile menu button */}
        <motion.button
          onClick={() => setOpen(!open)}
          className="md:hidden relative z-50 p-2 rounded-full transition-all duration-300 ease-out hover:bg-white/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-gray-700" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-[20px] border-t border-white/20 mobile-menu-container"
          >
            <div className="container py-6">
              <nav className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href="/"
                    className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ease-out rounded-lg ${
                      pathname === "/"
                        ? "text-brand-gold bg-white/20"
                        : "text-gray-700 hover:text-brand-gold hover:bg-white/10"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    Home
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Link
                    href="/simple"
                    className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ease-out rounded-lg ${
                      pathname === "/simple"
                        ? "text-brand-gold bg-white/20"
                        : "text-gray-700 hover:text-brand-gold hover:bg-white/10"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    Simple Posts
                  </Link>
                </motion.div>

                {categories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={category.slug === 'destinations' ? '/destination' : 
                            category.slug === 'experiences' ? '/vacation' :
                            category.slug === 'vacations' ? '/vacation' :
                            category.slug === 'stay' ? '/Tour' :
                            `/category/${category.slug}`}
                      className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ease-out rounded-lg ${
                        isActive(category)
                          ? "text-brand-gold bg-white/20"
                          : "text-gray-700 hover:text-brand-gold hover:bg-white/10"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {category.name}
                    </Link>
                    
                    {category.children && category.children.length > 0 && (
                      <div className="ml-4 mt-2 space-y-1">
                        {category.children.map((child, childIndex) => (
                          <motion.div
                            key={child._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + index * 0.05 + childIndex * 0.02 }}
                          >
                            <Link
                              href={`/category/${child.slug}`}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-brand-gold hover:bg-white/10 transition-all duration-300 ease-out rounded-lg"
                              onClick={() => setOpen(false)}
                            >
                              {child.name}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
