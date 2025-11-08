// Grid Configuration for Destination Page
// This file makes it easy to customize the grid layout without touching component code

export const DESTINATION_GRID_CONFIG = {
  // Grid layout settings
  grid: {
    columns: 6,
    rows: 3,
    gap: '1rem',
    margin: {
      top: '2rem',
      left: '6%',
      right: '6%'
    }
  },
  
  // Responsive breakpoints
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px'
  },
  
  // Card configurations for each position
  cards: [
    // Row 1
    {
      id: 'card-1',
      position: { row: 1, col: 1, span: 1 },
      size: { width: '120%', height: 'auto' },
      type: 'latest-post'
    },
    {
      id: 'card-2', 
      position: { row: 1, col: 3, span: 1 },
      size: { width: '120%', height: 'auto' },
      type: 'latest-post'
    },
    
    // Row 2
    {
      id: 'card-3',
      position: { row: 2, col: 1, span: 1 },
      size: { width: '100%', height: 'auto' },
      type: 'latest-post'
    },
    {
      id: 'card-4',
      position: { row: 2, col: 3, span: 2 },
      size: { width: '100%', height: '150px' },
      type: 'latest-post'
    },
    {
      id: 'card-5',
      position: { row: 2, col: 6, span: 1 },
      size: { width: '100%', height: '200px' },
      type: 'custom',
      content: {
        title: "Discover Hidden Gems: Sri Lanka's Secret Beaches",
        description: "Explore the untouched beauty of Sri Lanka's hidden coastal treasures.",
        image: "/ltpost1.png",
        button: { text: "Tour", style: "outline" },
        metadata: { readTime: "8 min read", category: "Travel Guide" }
      }
    },
    
    // Row 3
    {
      id: 'card-6',
      position: { row: 3, col: 1, span: 3 },
      size: { width: '100%', height: 'auto' },
      type: 'latest-post'
    },
    {
      id: 'card-7',
      position: { row: 3, col: 4, span: 3 },
      size: { width: '100%', height: 'auto' },
      type: 'latest-post'
    }
  ],
  
  // Responsive configurations
  responsive: {
    mobile: {
      columns: 1,
      cards: [
        { id: 'card-1', position: { row: 1, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
        { id: 'card-2', position: { row: 2, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
        { id: 'card-3', position: { row: 3, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
        { id: 'card-4', position: { row: 4, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
        { id: 'card-5', position: { row: 5, col: 1, span: 1 }, size: { width: '100%', height: '200px' }, type: 'custom', content: { title: "Discover Hidden Gems: Sri Lanka's Secret Beaches", description: "Explore the untouched beauty of Sri Lanka's hidden coastal treasures.", image: "/ltpost1.png", button: { text: "Tour", style: "outline" }, metadata: { readTime: "8 min read", category: "Travel Guide" } } },
        { id: 'card-6', position: { row: 6, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
        { id: 'card-7', position: { row: 7, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' }
      ]
    },
    tablet: {
      columns: 3,
      cards: [
        { id: 'card-1', position: { row: 1, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
        { id: 'card-2', position: { row: 1, col: 2, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
        { id: 'card-3', position: { row: 1, col: 3, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
        { id: 'card-4', position: { row: 2, col: 1, span: 2 }, size: { width: '100%', height: '150px' }, type: 'latest-post' },
        { id: 'card-5', position: { row: 2, col: 3, span: 1 }, size: { width: '100%', height: '200px' }, type: 'custom', content: { title: "Discover Hidden Gems: Sri Lanka's Secret Beaches", description: "Explore the untouched beauty of Sri Lanka's hidden coastal treasures.", image: "/ltpost1.png", button: { text: "Tour", style: "outline" }, metadata: { readTime: "8 min read", category: "Travel Guide" } } },
        { id: 'card-6', position: { row: 3, col: 1, span: 2 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
        { id: 'card-7', position: { row: 3, col: 3, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' }
      ]
    }
  }
};

// Alternative grid configurations for different layouts
export const ALTERNATIVE_GRID_CONFIGS = {
  // Simple 2x2 grid
  simple: {
    grid: { columns: 2, rows: 2, gap: '1rem', margin: { top: '2rem', left: '6%', right: '6%' } },
    breakpoints: { mobile: '768px', tablet: '1024px', desktop: '1200px' },
    cards: [
      { id: 'card-1', position: { row: 1, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
      { id: 'card-2', position: { row: 1, col: 2, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
      { id: 'card-3', position: { row: 2, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
      { id: 'card-4', position: { row: 2, col: 2, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' }
    ],
    responsive: {
      mobile: {
        columns: 1,
        cards: [
          { id: 'card-1', position: { row: 1, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
          { id: 'card-2', position: { row: 2, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
          { id: 'card-3', position: { row: 3, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
          { id: 'card-4', position: { row: 4, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' }
        ]
      }
    }
  },
  
  // Masonry-style grid
  masonry: {
    grid: { columns: 4, rows: 4, gap: '1rem', margin: { top: '2rem', left: '6%', right: '6%' } },
    breakpoints: { mobile: '768px', tablet: '1024px', desktop: '1200px' },
    cards: [
      { id: 'card-1', position: { row: 1, col: 1, span: 2 }, size: { width: '100%', height: '200px' }, type: 'latest-post' },
      { id: 'card-2', position: { row: 1, col: 3, span: 1 }, size: { width: '100%', height: '150px' }, type: 'latest-post' },
      { id: 'card-3', position: { row: 1, col: 4, span: 1 }, size: { width: '100%', height: '150px' }, type: 'latest-post' },
      { id: 'card-4', position: { row: 2, col: 1, span: 1 }, size: { width: '100%', height: '180px' }, type: 'latest-post' },
      { id: 'card-5', position: { row: 2, col: 2, span: 1 }, size: { width: '100%', height: '180px' }, type: 'latest-post' },
      { id: 'card-6', position: { row: 2, col: 3, span: 2 }, size: { width: '100%', height: '200px' }, type: 'latest-post' }
    ],
    responsive: {
      mobile: {
        columns: 1,
        cards: [
          { id: 'card-1', position: { row: 1, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
          { id: 'card-2', position: { row: 2, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
          { id: 'card-3', position: { row: 3, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
          { id: 'card-4', position: { row: 4, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
          { id: 'card-5', position: { row: 5, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' },
          { id: 'card-6', position: { row: 6, col: 1, span: 1 }, size: { width: '100%', height: 'auto' }, type: 'latest-post' }
        ]
      }
    }
  }
};

// Helper functions for easy customization
export const createCustomCard = (id, position, size, content) => ({
  id,
  position,
  size,
  type: 'custom',
  content
});

export const createLatestPostCard = (id, position, size) => ({
  id,
  position,
  size,
  type: 'latest-post'
});

// Example usage:
// import { DESTINATION_GRID_CONFIG, ALTERNATIVE_GRID_CONFIGS, createCustomCard } from './config/gridConfig';
// 
// // Use default config
// <DestinationGrid config={DESTINATION_GRID_CONFIG} />
// 
// // Use alternative config
// <DestinationGrid config={ALTERNATIVE_GRID_CONFIGS.simple} />
// 
// // Add custom cards
// const customCards = [
//   createCustomCard('custom-1', { row: 1, col: 1, span: 1 }, { width: '100%', height: '200px' }, {
//     title: "Custom Title",
//     description: "Custom description",
//     image: "/custom-image.jpg",
//     button: { text: "Learn More", style: "outline" },
//     metadata: { readTime: "5 min read", category: "Custom" }
//   })
// ];
// <DestinationGrid config={DESTINATION_GRID_CONFIG} customCards={customCards} />

