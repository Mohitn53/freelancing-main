import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  'All', 'Shirt', 'Cap', 'Trouser', 'Shorts', 'Shoe', 'Sock', 'Jacket', 'Hoodie', 'Glasses', 'Watch'
];

const CategoryFilters = () => {
  const [active, setActive] = useState('All');

  return (
    <div style={styles.container}>
      <div className="container" style={styles.scrollWrapper}>
        <div style={styles.filterList}>
          {CATEGORIES.map(category => {
            const isActive = active === category;
            return (
              <motion.button
                key={category}
                onClick={() => setActive(category)}
                style={{
                  ...styles.pill,
                  ...(isActive ? styles.pillActive : styles.pillInactive)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                {category}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '32px 0 16px 0',
  },
  scrollWrapper: {
    overflowX: 'auto',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none',  // IE 10+
  },
  filterList: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    width: 'max-content',
    padding: '8px 0'
  },
  pill: {
    padding: '10px 24px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'background-color 0.3s, color 0.3s',
  },
  pillActive: {
    backgroundColor: '#111',
    color: '#fff',
  },
  pillInactive: {
    backgroundColor: '#f5f5f5',
    color: '#555',
  }
};

export default CategoryFilters;
