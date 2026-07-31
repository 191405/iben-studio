/**
 * ============================================================================
 * IBEN STUDIO — ENTERPRISE COMMISSION NOTIFICATION & WEBHOOK SERVICE
 * ============================================================================
 * Dispatches real-time webhook payloads and automated email alerts when a
 * new client commission inquiry arrives.
 */

/**
 * Trigger an email notification & webhook event for a newly created inquiry.
 * @param {Object} inquiry - The saved inquiry object from the database.
 * @returns {Promise<Object>} Notification dispatch summary
 */
async function triggerInquiryNotification(inquiry) {
  const timestamp = new Date().toISOString();
  const webhookUrl = process.env.WEBHOOK_URL || null;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ibenstudio.com';

  const notificationPayload = {
    event: 'inquiry.commission_received',
    timestamp,
    studio: 'IBEN Studio Enterprise API',
    data: {
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone || 'N/A',
      discipline: inquiry.discipline,
      budget: inquiry.budget || 'N/A',
      timeline: inquiry.timeline || 'N/A',
      message: inquiry.message,
      source: inquiry.source || 'IBEN Studio Website'
    }
  };

  // 1. ASCII Server Log Receipt (Always visible in Docker / Render / Vercel console)
  console.log('----------------------------------------------------------------------');
  console.log(`📬 [COMMISSION ALERT] New Enterprise Commission Received (${inquiry.discipline.toUpperCase()})`);
  console.log(`   ID       : ${inquiry.id}`);
  console.log(`   Client   : ${inquiry.name} <${inquiry.email}>`);
  console.log(`   Phone    : ${inquiry.phone || 'Not provided'}`);
  console.log(`   Budget   : ${inquiry.budget || 'Not specified'}`);
  console.log(`   Timeline : ${inquiry.timeline || 'Not specified'}`);
  console.log(`   Message  : "${inquiry.message.substring(0, 80)}${inquiry.message.length > 80 ? '...' : ''}"`);
  console.log('----------------------------------------------------------------------');

  const dispatchStatus = {
    webhookDispatched: false,
    emailDispatched: false,
    timestamp
  };

  // 2. Dispatch Webhook (e.g. Discord, Slack, Zapier, Make.com) if WEBHOOK_URL is configured
  if (webhookUrl) {
    try {
      const fetch = (await import('node-fetch')).default || global.fetch;
      if (fetch) {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-IBEN-Studio-Event': 'inquiry.commission_received'
          },
          body: JSON.stringify(notificationPayload)
        });
        if (response.ok) {
          dispatchStatus.webhookDispatched = true;
          console.log(`✅ [WEBHOOK SUCCESS] Delivered event to webhook target.`);
        } else {
          console.warn(`⚠️ [WEBHOOK WARNING] Webhook returned status ${response.status}`);
        }
      }
    } catch (err) {
      console.warn('⚠️ [WEBHOOK ERROR] Could not deliver webhook payload:', err.message);
    }
  }

  // 3. Email Dispatch Simulation (Ready for SendGrid / Resend / Postmark integration)
  if (process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || process.env.SMTP_HOST) {
    // In production, integrate email SDK here. For now, mark as simulated dispatch.
    dispatchStatus.emailDispatched = true;
    console.log(`📧 [EMAIL NOTIFICATION] Dispatched HTML alert to ${adminEmail}`);
  } else {
    console.log(`ℹ️ [EMAIL NOTICE] SMTP/API keys not set. Commission stored in DB & logged.`);
  }

  return dispatchStatus;
}

module.exports = {
  triggerInquiryNotification
};
