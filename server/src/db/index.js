/**
 * ============================================================================
 * IBEN STUDIO — ENTERPRISE DATABASE REPOSITORY & MIGRATION ENGINE
 * ============================================================================
 * Provides persistent structured storage and in-memory test database support
 * with automatic schema migrations and default seeders.
 */

const fs = require('fs');
const path = require('path');

class DatabaseEngine {
  constructor(dbPath) {
    this.dbPath = dbPath || process.env.DATABASE_PATH || path.join(__dirname, '..', '..', 'data', 'iben-studio.json');
    this.inMemory = this.dbPath === ':memory:';
    this.data = {
      inquiries: [],
      portfolio: [],
      beadworkCatalog: [],
      solarQuotes: [],
      telemetryLogs: []
    };
    this.initialized = false;
  }

  /**
   * Initializes the database, runs schema migrations, and seeds initial data.
   */
  async init() {
    if (this.initialized) return;

    if (!this.inMemory) {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.dbPath)) {
        try {
          const raw = fs.readFileSync(this.dbPath, 'utf-8');
          this.data = JSON.parse(raw);
        } catch (err) {
          console.warn('⚠️ Could not load database file, initializing fresh store:', err.message);
        }
      }
    }

    this.runMigrations();
    this.seedDefaults();
    this.save();
    this.initialized = true;
    console.log(`✅ IBEN Studio Database Engine initialized (${this.inMemory ? 'In-Memory' : this.dbPath})`);
  }

  runMigrations() {
    // Ensure all required tables/collections exist in data structure
    if (!Array.isArray(this.data.inquiries)) this.data.inquiries = [];
    if (!Array.isArray(this.data.portfolio)) this.data.portfolio = [];
    if (!Array.isArray(this.data.beadworkCatalog)) this.data.beadworkCatalog = [];
    if (!Array.isArray(this.data.solarQuotes)) this.data.solarQuotes = [];
    if (!Array.isArray(this.data.telemetryLogs)) this.data.telemetryLogs = [];
  }

  seedDefaults() {
    // Seed initial portfolio case studies if empty — ZERO-STATE LAUNCHPAD
    if (this.data.portfolio.length === 0) {
      this.data.portfolio = [
        {
          id: 'port-000-a',
          title: 'Processing... — Case Study Coming Soon',
          discipline: 'web-development',
          category: 'Web Development',
          client: 'Processing...',
          year: 0,
          description: 'Processing... — Case study data ingestion pipeline active. This entry will be populated once the first web development commission is completed and verified by the IBEN Studio engineering team.',
          metrics: '0.00% / 00 Active Users',
          image: 'assets/images/portfolio-digital.png',
          tags: ['Processing...']
        },
        {
          id: 'port-000-b',
          title: 'Processing... — Case Study Coming Soon',
          discipline: 'solar-engineering',
          category: 'Solar Engineering',
          client: 'Processing...',
          year: 0,
          description: 'Processing... — Solar infrastructure case study ingestion pending. Metrics will appear here once the first solar system installation is commissioned and verified.',
          metrics: '0 kWp Installed / ₦0 Savings',
          image: 'assets/images/portfolio-solar.png',
          tags: ['Processing...']
        },
        {
          id: 'port-000-c',
          title: 'Processing... — Case Study Coming Soon',
          discipline: 'software-applications',
          category: 'Software Applications',
          client: 'Processing...',
          year: 0,
          description: 'Processing... — Software application case study data pipeline initializing. This entry will be populated upon the first enterprise SaaS commission.',
          metrics: '0 Transactions / 00 Active Users',
          image: 'assets/images/portfolio-editorial.png',
          tags: ['Processing...']
        },
        {
          id: 'port-000-d',
          title: 'Processing... — Case Study Coming Soon',
          discipline: 'beadwork-fashion',
          category: 'Beadwork & Beaded Fashion',
          client: 'Processing...',
          year: 0,
          description: 'Processing... — Heritage beadwork case study ingestion pending. Artisan hours and craftsmanship metrics will appear here once the first bespoke commission is completed.',
          metrics: '0 Hours Artisan Handcraft',
          image: 'assets/images/portfolio-beadwork.png',
          tags: ['Processing...']
        }
      ];
    }

    // Seed beadwork catalog items if empty — ZERO-STATE
    if (this.data.beadworkCatalog.length === 0) {
      this.data.beadworkCatalog = [
        {
          id: 'bead-000',
          name: 'Processing... — Catalog Item Coming Soon',
          basePriceNGN: 0,
          category: 'Processing...',
          leadTimeWeeks: 0,
          description: 'Processing... — Beadwork catalog ingestion pipeline active. Items will appear here once the artisan inventory is verified.'
        }
      ];
    }
  }

  save() {
    if (this.inMemory) return;
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ Error saving database state:', err.message);
    }
  }

  // ---- REPOSITORY METHODS ----

  // Portfolio Case Studies
  getPortfolio(discipline = null) {
    if (!discipline || discipline === 'all') {
      return this.data.portfolio;
    }
    return this.data.portfolio.filter(p => p.discipline === discipline);
  }

  getPortfolioById(id) {
    return this.data.portfolio.find(p => p.id === id) || null;
  }

  createPortfolioItem(item) {
    const newItem = {
      id: `port-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    this.data.portfolio.unshift(newItem); // Add newest item first
    this.save();
    return newItem;
  }

  updatePortfolioItem(id, updates) {
    const index = this.data.portfolio.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.portfolio[index] = {
        ...this.data.portfolio[index],
        ...updates,
        id: this.data.portfolio[index].id, // Prevent ID overwrite
        updatedAt: new Date().toISOString()
      };
      this.save();
      return this.data.portfolio[index];
    }
    return null;
  }

  deletePortfolioItem(id) {
    const index = this.data.portfolio.findIndex(p => p.id === id);
    if (index !== -1) {
      const removed = this.data.portfolio.splice(index, 1)[0];
      this.save();
      return removed;
    }
    return null;
  }

  // Inquiries
  createInquiry(inquiry) {
    const newInquiry = {
      id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...inquiry
    };
    this.data.inquiries.push(newInquiry);
    this.save();
    return newInquiry;
  }

  getInquiries() {
    return this.data.inquiries;
  }

  getInquiryById(id) {
    return this.data.inquiries.find(i => i.id === id) || null;
  }

  updateInquiryStatus(id, status) {
    const inquiry = this.data.inquiries.find(i => i.id === id);
    if (inquiry) {
      inquiry.status = status;
      inquiry.updatedAt = new Date().toISOString();
      this.save();
      return inquiry;
    }
    return null;
  }

  // Beadwork Catalog
  getBeadworkCatalog() {
    return this.data.beadworkCatalog;
  }

  // Solar Quotes
  saveSolarQuote(quote) {
    const newQuote = {
      id: `sq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      ...quote
    };
    this.data.solarQuotes.push(newQuote);
    this.save();
    return newQuote;
  }
}

// Singleton export
const db = new DatabaseEngine();
module.exports = { db, DatabaseEngine };
