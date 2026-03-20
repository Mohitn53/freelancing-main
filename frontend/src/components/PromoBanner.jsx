import React from 'react';
import { motion } from 'framer-motion';

const PromoBanner = () => {
  return (
    <motion.section 
      style={styles.banner}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <img 
        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80" 
        alt="Promo Background" 
        style={styles.bg}
        className="bg-cover"
      />
      <div style={styles.overlay} />
      
      <div style={styles.content}>
        <h2 style={styles.heading}>Grab Exciting Deals and Special Promos Today, Don't Miss Out!</h2>
        <p style={styles.subtext}>
          Take advantage of today's special promotions with a variety of attractive offers such as discounts and exclusive offers. Get it soon before it runs out.
        </p>
        <button className="btn btn-white" style={styles.btn}>Grab Now</button>
      </div>
    </motion.section>
  );
};

const styles = {
  banner: {
    position: 'relative',
    height: '400px',
    borderRadius: '32px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '80px 0',
    textAlign: 'center'
  },
  bg: {
    filter: 'brightness(0.6)'
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
    zIndex: 1
  },
  content: {
    position: 'relative',
    zIndex: 2,
    color: '#fff',
    maxWidth: '800px',
    padding: '0 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px'
  },
  heading: {
    fontSize: 'clamp(32px, 4vw, 48px)',
    lineHeight: 1.2,
    textTransform: 'none',
    marginBottom: '0'
  },
  subtext: {
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    color: '#ddd',
    lineHeight: 1.6,
    maxWidth: '600px'
  },
  btn: {
    marginTop: '8px'
  }
};

export default PromoBanner;
