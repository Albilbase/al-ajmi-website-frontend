
"use client";

import React from 'react';
import { motion } from 'framer-motion';


export default function DashboardOverview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          background: 'linear-gradient(135deg, #000000 0%, #1e293b 100%)',
          padding: '3rem',
          borderRadius: '1.5rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Welcome to Alajmi Admin Panel</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '700px', fontSize: '1.1rem', lineHeight: '1.6' }}>
            This is your central control hub. From here, you can manage all website sections, update content, and oversee various site modules. Select a section from the sidebar to begin editing.
          </p>
        </div>
        
        {/* Background Decorative Shape */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(220,20,60,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
      </motion.div>

      {/* Simplified Empty Area */}
      <div style={{ 
        padding: '4rem', 
        border: '2px dashed #e2e8f0', 
        borderRadius: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        color: '#94a3b8'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '600' }}> cards or any sec </div>
        <p style={{ marginTop: '0.5rem' }}>here :)</p>
      </div>
    </div>
  );
}
