import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { BillingProduct, googlePlayBilling, PurchaseResult } from '../services/GooglePlayBillingService';
import './GooglePlayBillingTest.css';

const GooglePlayBillingTest: React.FC = () => {
  const [products, setProducts] = useState<BillingProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchases, setPurchases] = useState<PurchaseResult[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    loadProducts();
    loadPurchases();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsList = await googlePlayBilling.getProducts();
      setProducts(productsList);
      addToast(`Loaded ${productsList.length} products successfully`, 'success');
    } catch (error) {
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadPurchases = async () => {
    try {
      const restoredPurchases = await googlePlayBilling.restorePurchases();
      setPurchases(restoredPurchases);
    } catch (error) {
      console.error('Failed to load purchases:', error);
    }
  };

  const handlePurchase = async (productId: string) => {
    try {
      setLoading(true);
      const result = await googlePlayBilling.purchaseProduct(productId);
      
      if (result.success) {
        addToast(`Successfully purchased: ${productId}`, 'success');
        // Reload purchases
        await loadPurchases();
      } else {
        addToast(result.error || 'Unknown error occurred', 'error');
      }
    } catch (error) {
      addToast('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      setLoading(true);
      const restoredPurchases = await googlePlayBilling.restorePurchases();
      setPurchases(restoredPurchases);
      
      addToast(`Restored ${restoredPurchases.length} purchases`, 'success');
    } catch (error) {
      addToast('Failed to restore purchases', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearTest = async () => {
    try {
      await googlePlayBilling.clearTestPurchases();
      setPurchases([]);
      addToast('All test purchases have been cleared', 'success');
    } catch (error) {
      addToast('Failed to clear test data', 'error');
    }
  };

  const isProductPurchased = (productId: string): boolean => {
    return purchases.some(purchase => purchase.productId === productId);
  };

  return (
    <div className="billing-test-container">
      <div className="billing-test-header">
        <h2>🧪 Google Play Billing Test</h2>
        <p>Test Google Play Billing functionality</p>
      </div>

      <div className="billing-test-controls">
        <button 
          onClick={loadProducts} 
          disabled={loading}
          className="billing-test-btn"
        >
          🔄 Reload Products
        </button>
        <button 
          onClick={handleRestore} 
          disabled={loading}
          className="billing-test-btn"
        >
          🔄 Restore Purchases
        </button>
        <button 
          onClick={handleClearTest} 
          disabled={loading}
          className="billing-test-btn danger"
        >
          🧹 Clear Test Data
        </button>
      </div>

      <div className="billing-test-section">
        <h3>📦 Available Products ({products.length})</h3>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div 
                key={product.id} 
                className={`product-card ${isProductPurchased(product.id) ? 'purchased' : ''}`}
              >
                <div className="product-header">
                  <h4>{product.title}</h4>
                  <span className="product-price">{product.price}</span>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-type">
                  Type: <span className={`type-badge ${product.type}`}>
                    {product.type === 'inapp' ? 'One-time' : 'Subscription'}
                  </span>
                </div>
                <div className="product-status">
                  {isProductPurchased(product.id) ? (
                    <span className="status-purchased">✅ Purchased</span>
                  ) : (
                    <button
                      onClick={() => handlePurchase(product.id)}
                      disabled={loading}
                      className="purchase-btn"
                    >
                      🛒 Purchase
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="billing-test-section">
        <h3>📋 Purchase History ({purchases.length})</h3>
        {purchases.length === 0 ? (
          <div className="no-purchases">No purchases found</div>
        ) : (
          <div className="purchases-list">
            {purchases.map((purchase, index) => (
              <div key={index} className="purchase-item">
                <div className="purchase-info">
                  <strong>{purchase.productId}</strong>
                  {purchase.purchaseToken && (
                    <span className="purchase-token">
                      Token: {purchase.purchaseToken.substring(0, 20)}...
                    </span>
                  )}
                </div>
                <span className={`purchase-status ${purchase.success ? 'success' : 'error'}`}>
                  {purchase.success ? '✅ Success' : '❌ Failed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="billing-test-info">
        <h3>ℹ️ Test Information</h3>
        <ul>
          <li>This is a <strong>mock implementation</strong> for testing</li>
          <li>Purchases are stored in <code>localStorage</code></li>
          <li>No real money is charged</li>
          <li>Use "Clear Test Data" to reset all purchases</li>
          <li>In production, this will connect to real Google Play Billing</li>
        </ul>
      </div>
    </div>
  );
};

export default GooglePlayBillingTest; 