"use client";

import React, { useState, useEffect } from 'react';

const FABRICS = ["Silk", "Banarasi Silk", "Organza", "Georgette", "Linen", "Chiffon", "Cotton", "Crepe", "Satin", "Net", "Other"];
const STATUSES = [
  { value: "available", label: "Available" },
  { value: "pre_order", label: "Pre-order" },
  { value: "out_of_stock", label: "Out of Stock" }
];

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const maxDimension = 800;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function SareeForm({ saree, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    price: '',
    status: 'available',
    fabric: 'Silk',
    color: '',
    instagramUrl: '',
    imageUrl: '',
    description: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMessageEditedByUser, setIsMessageEditedByUser] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, imageUrl: "Please select a valid image file" }));
      return;
    }
    
    try {
      const compressedBase64 = await compressImage(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: compressedBase64
      }));
      setErrors(prev => ({ ...prev, imageUrl: null }));
    } catch (err) {
      console.error("Image compression error:", err);
      setErrors(prev => ({ ...prev, imageUrl: "Failed to compress image. Try another." }));
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };

  const generateTemplateMessage = (data) => {
    const statusLabel = data.status === 'available' ? 'Available' : data.status === 'pre_order' ? 'Pre-order' : 'Out of Stock';
    const formattedPrice = data.price ? `₹${Number(data.price).toLocaleString('en-IN')}` : 'TBD';
    return `✨ *Mrida The Label* ✨\n` +
           `🌸 *${data.name || 'Unnamed Saree'}*\n` +
           `🛍️ *Code:* ${data.code || 'Pending'}\n` +
           `🧶 *Fabric:* ${data.fabric || 'Silk'}\n` +
           `🎨 *Color:* ${data.color || 'N/A'}\n` +
           `💰 *Price:* ${formattedPrice}\n` +
           `📌 *Status:* ${statusLabel}\n\n` +
           `📝 *Details:* ${data.description || 'N/A'}\n\n` +
           `📲 DM us or visit @mrida_thelabel to order!`;
  };

  useEffect(() => {
    if (saree) {
      setFormData({
        code: saree.code || '',
        name: saree.name || '',
        price: saree.price || '',
        status: saree.status || 'available',
        fabric: saree.fabric || 'Silk',
        color: saree.color || '',
        instagramUrl: saree.instagramUrl || '',
        imageUrl: saree.imageUrl || '',
        description: saree.description || '',
        message: saree.message || ''
      });
      setIsMessageEditedByUser(!!saree.message);
    } else {
      const initialCode = `MTL-${Math.floor(1000 + Math.random() * 9000)}`;
      const defaultData = {
        code: initialCode,
        name: '',
        price: '',
        status: 'available',
        fabric: 'Silk',
        color: '',
        instagramUrl: '',
        imageUrl: '',
        description: '',
        message: ''
      };
      defaultData.message = generateTemplateMessage(defaultData);
      setFormData(defaultData);
      setIsMessageEditedByUser(false);
    }
  }, [saree]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const nextData = {
        ...prev,
        [name]: value
      };
      
      let messageEdited = isMessageEditedByUser;
      if (name === 'message') {
        messageEdited = true;
        setIsMessageEditedByUser(true);
      }
      
      if (!messageEdited) {
        nextData.message = generateTemplateMessage(nextData);
      }
      
      return nextData;
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = "Saree code is required";
    if (!formData.name.trim()) newErrors.name = "Saree name is required";
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (!formData.color.trim()) newErrors.color = "Color is required";
    
    // Validate Instagram URL if provided
    if (formData.instagramUrl && !formData.instagramUrl.startsWith("http")) {
      newErrors.instagramUrl = "Must be a valid URL starting with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ form: "An error occurred while saving the saree." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{saree ? "Edit Saree Details" : "Add New Saree design"}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {errors.form && (
            <div style={{ color: 'var(--status-out-of-stock)', marginBottom: '1rem', fontWeight: 600 }}>
              {errors.form}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="form-code">Saree Code *</label>
              <input
                type="text"
                name="code"
                id="form-code"
                value={formData.code}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., SW-KAN-08"
                required
              />
              {errors.code && <span style={{ color: 'var(--status-out-of-stock)', fontSize: '0.75rem' }}>{errors.code}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="form-price">Price (INR ₹) *</label>
              <input
                type="number"
                name="price"
                id="form-price"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 7500"
                min="1"
                required
              />
              {errors.price && <span style={{ color: 'var(--status-out-of-stock)', fontSize: '0.75rem' }}>{errors.price}</span>}
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="form-name">Saree Name *</label>
              <input
                type="text"
                name="name"
                id="form-name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Royal Crimson Kanchipuram Silk Saree"
                required
              />
              {errors.name && <span style={{ color: 'var(--status-out-of-stock)', fontSize: '0.75rem' }}>{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="form-fabric">Fabric *</label>
              <select
                name="fabric"
                id="form-fabric"
                value={formData.fabric}
                onChange={handleChange}
                className="form-input select-input"
                style={{ width: '100%' }}
              >
                {FABRICS.map(fab => (
                  <option key={fab} value={fab}>{fab}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="form-color">Color *</label>
              <input
                type="text"
                name="color"
                id="form-color"
                value={formData.color}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Emerald Green / Ruby Red"
                required
              />
              {errors.color && <span style={{ color: 'var(--status-out-of-stock)', fontSize: '0.75rem' }}>{errors.color}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="form-status">Availability Status</label>
              <select
                name="status"
                id="form-status"
                value={formData.status}
                onChange={handleChange}
                className="form-input select-input"
                style={{ width: '100%' }}
              >
                {STATUSES.map(stat => (
                  <option key={stat.value} value={stat.value}>{stat.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Saree Image *</label>
              
              <div 
                className="image-upload-zone"
                onClick={() => document.getElementById('file-input').click()}
                style={{
                  border: '2px dashed var(--card-border)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(var(--primary-rgb), 0.01)',
                  transition: 'var(--transition-smooth)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  minHeight: '140px'
                }}
              >
                <input 
                  type="file" 
                  id="file-input" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange}
                />
                
                {formData.imageUrl ? (
                  <div style={{ position: 'relative', width: '100%', maxWidth: '240px', margin: '0 auto' }} onClick={(e) => e.stopPropagation()}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={formData.imageUrl} 
                      alt="Saree Preview" 
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--card-border)' }}
                    />
                    <button 
                      type="button" 
                      onClick={handleRemoveImage}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: 'var(--status-out-of-stock)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        lineHeight: 1
                      }}
                      title="Remove Image"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)', opacity: 0.7 }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click or Tap to Upload Saree Photo</span>
                    <span style={{ fontSize: '0.72rem', opacity: 0.5 }}>Supports camera photos, JPG, PNG. Dynamic client-side compression enabled.</span>
                  </>
                )}
              </div>
              {errors.imageUrl && <span style={{ color: 'var(--status-out-of-stock)', fontSize: '0.75rem' }}>{errors.imageUrl}</span>}
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="form-instagramUrl">Instagram Post URL</label>
              <input
                type="url"
                name="instagramUrl"
                id="form-instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., https://www.instagram.com/p/..."
              />
              {errors.instagramUrl && <span style={{ color: 'var(--status-out-of-stock)', fontSize: '0.75rem' }}>{errors.instagramUrl}</span>}
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="form-description">Description / Styling notes</label>
              <textarea
                name="description"
                id="form-description"
                value={formData.description}
                onChange={handleChange}
                className="form-input form-textarea"
                placeholder="Describe borders, zari work, styling ideas, blouse inclusion, etc."
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="form-message" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Share Message (WhatsApp/Insta)</span>
                <span style={{ fontSize: '0.75rem', color: isMessageEditedByUser ? 'var(--primary)' : 'var(--status-available)', fontWeight: 600 }}>
                  {isMessageEditedByUser ? "⚡ Custom Edit Mode" : "🪄 Auto-generating Template"}
                </span>
              </label>
              <textarea
                name="message"
                id="form-message"
                value={formData.message}
                onChange={handleChange}
                className="form-input form-textarea"
                style={{ minHeight: '130px', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.4' }}
                placeholder="Message that is easy to copy later..."
              />
              <span style={{ fontSize: '0.72rem', opacity: 0.5, marginTop: '0.2rem', display: 'block' }}>
                Note: Leaving it auto-generated will sync edits from the fields above.
              </span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Saree"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
