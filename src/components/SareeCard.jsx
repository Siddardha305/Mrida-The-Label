"use client";

import React, { useState, useTransition } from 'react';
import CardImage from './CardImage';
import CardTags from './CardTags';
import CardContent from './CardContent';
import CardPrice from './CardPrice';
import CardActions from './CardActions';

export default function SareeCard({ saree, isAdmin, onEdit, onDelete, onToggleStatus, currency = 'INR' }) {
  const { id, code, name, price, status, fabric, color, instagramUrl, imageUrl, description, message } = saree;
  const [isPending, startTransition] = useTransition();

  // Convert and format price based on selected currency
  const displayPrice = currency === 'USD' ? Math.round(price / 83) : price;
  const formattedPrice = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(displayPrice);

  const [copied, setCopied] = useState(false);

  const fallbackCopyText = (text) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
  };

  const handleCopyMessage = (e) => {
    e.stopPropagation();
    const shareText = message || 
      `✨ *Mrida The Label* ✨\n🌸 *${name}*\n🛍️ *Code:* ${code}\n🧶 *Fabric:* ${fabric}\n🎨 *Color:* ${color}\n💰 *Price:* ₹${price.toLocaleString('en-IN')}\n\n📲 DM us or visit @mrida_thelabel to order!`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.warn("Navigator clipboard failed, trying fallback:", err);
        fallbackCopyText(shareText);
      });
    } else {
      fallbackCopyText(shareText);
    }
  };

  const handleToggleStatus = (e) => {
    e.stopPropagation();
    if (!isAdmin) return;
    startTransition(async () => {
      await onToggleStatus(id);
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(saree);
  };

  return (
    <article className="saree-card" id={`saree-card-${id}`}>
      <CardImage 
        imageUrl={imageUrl} 
        name={name} 
        code={code} 
        status={status} 
        isAdmin={isAdmin} 
        isPending={isPending} 
        onToggleStatus={handleToggleStatus} 
      />

      <div className="card-content">
        <CardTags fabric={fabric} color={color} />
        <CardContent name={name} description={description} />

        <div className="card-footer">
          <CardPrice formattedPrice={formattedPrice} />
          <CardActions 
            isAdmin={isAdmin} 
            copied={copied} 
            onCopyMessage={handleCopyMessage} 
            onEdit={() => onEdit(saree)} 
            onDelete={handleDelete} 
            instagramUrl={instagramUrl} 
            id={id} 
            name={name} 
          />
        </div>
      </div>
    </article>
  );
}
