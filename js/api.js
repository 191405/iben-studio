/**
 * ============================================================================
 * IBEN STUDIO — FRONTEND REST API CLIENT
 * ============================================================================
 * Handles communication with the Node.js/Express Enterprise Backend API
 * (/api/v1/...) with automatic retry and offline fallback resiliency.
 */

class IBENStudioAPI {
  constructor(baseURL = window.IBEN_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000/api/v1' : 'https://iben-studio-api.onrender.com/api/v1')) {
    this.baseURL = baseURL;
  }

  /**
   * Universal HTTP Request helper with JSON parsing and error handling.
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.warn(`[API WARNING] Network error when fetching ${endpoint}:`, error.message);
      return {
        success: false,
        offline: true,
        error: {
          code: 0,
          message: 'Unable to connect to IBEN Studio Enterprise API. Running in offline/cached mode.'
        }
      };
    }
  }

  // ---- 1. TELEMETRY & HEALTH CHECK ----
  async getHealth() {
    return this.request('/health', { method: 'GET' });
  }

  // ---- 2. SOLAR ENGINEERING CALCULATOR ----
  async calculateSolar(data) {
    return this.request('/solar/calculate', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // ---- 3. INQUIRIES & LEAD CAPTURE ----
  async submitInquiry(formData) {
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  }

  // ---- 4. PORTFOLIO CASE STUDIES ----
  async getPortfolio(discipline = 'all') {
    const query = discipline && discipline !== 'all' ? `?discipline=${encodeURIComponent(discipline)}` : '';
    return this.request(`/portfolio${query}`, { method: 'GET' });
  }

  async getPortfolioDetail(id) {
    return this.request(`/portfolio/${id}`, { method: 'GET' });
  }

  // ---- 5. BEADWORK & FASHION QUOTES ----
  async calculateBeadworkQuote(specs) {
    return this.request('/beadwork/quote', {
      method: 'POST',
      body: JSON.stringify(specs)
    });
  }
}

// Global window export
window.ibenAPI = new IBENStudioAPI();
