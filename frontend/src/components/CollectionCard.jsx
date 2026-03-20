import React from 'react';
import { motion } from 'framer-motion';

const CollectionCard = ({ title, image }) => {
  return (
    <motion.div 
      style={styles.card}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <img src={image} alt={title} style={styles.image} className="bg-cover" />
      <div style={styles.overlay} />
      <h3 style={styles.title}>{title}</h3>
    </motion.div>
  );
};

const styles = {
  card: {
    position: 'relative',
    height: '400px',
    borderRadius: '24px',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#eee'
  },
  image: {
    transition: 'transform 0.6s ease'
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)',
    zIndex: 1
  },
  title: {
    position: 'absolute',
    bottom: '32px',
    left: '32px',
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '28px',
    textTransform: 'none',
    zIndex: 2,
    margin: 0
  }
};

export default CollectionCard;
