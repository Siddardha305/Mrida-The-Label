"use client";

import React from 'react';

export default function StatsHeader({ sarees, currency = 'INR' }) {
  const totalSarees = sarees.length;
  
  const availableCount = sarees.filter(s => s.status === 'available').length;
  const outOfStockCount = sarees.filter(s => s.status === 'out_of_stock').length;
  const preOrderCount = sarees.filter(s => s.status === 'pre_order').length;
  
  // Calculate total inventory value of active sarees (available + pre-order)
  const totalValue = sarees
    .filter(s => s.status !== 'out_of_stock')
    .reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  // Format value dynamically based on currency
  const displayValue = currency === 'USD' ? Math.round(totalValue / 83) : totalValue;
  const formattedValue = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(displayValue);

  return (
    <section className="metrics-grid">
      <div className="metric-card accented" id="stat-total-value">
        <span className="metric-label">Active Value ({currency})</span>
        <span className="metric-value" style={{ color: 'var(--primary)' }}>{formattedValue}</span>
        <span className="metric-footer">Available & Pre-order stock value</span>
      </div>

      <div className="metric-card" id="stat-total-count">
        <span className="metric-label">Total Catalog</span>
        <span className="metric-value">{totalSarees}</span>
        <span className="metric-footer">Saree designs listed</span>
      </div>

      <div className="metric-card" id="stat-available-count">
        <span className="metric-label">Available Now</span>
        <span className="metric-value" style={{ color: 'var(--status-available)' }}>{availableCount}</span>
        <span className="metric-footer">{totalSarees > 0 ? Math.round((availableCount / totalSarees) * 100) : 0}% of catalog ready to ship</span>
      </div>

      <div className="metric-card" id="stat-preorder-count">
        <span className="metric-label">Pre-Orders</span>
        <span className="metric-value" style={{ color: 'var(--status-pre-order)' }}>{preOrderCount}</span>
        <span className="metric-footer">Awaiting restock batches</span>
      </div>

      <div className="metric-card" id="stat-outofstock-count">
        <span className="metric-label">Out of Stock</span>
        <span className="metric-value" style={{ color: 'var(--status-out-of-stock)' }}>{outOfStockCount}</span>
        <span className="metric-footer">Sold out designs</span>
      </div>
    </section>
  );
}
