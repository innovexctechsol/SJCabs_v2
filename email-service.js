/* ================================================================
   SJ CABS — EMAIL SERVICE
   Powered by EmailJS (emailjs.com)
   No backend required — works from static HTML files

   SETUP INSTRUCTIONS:
   1. Go to https://www.emailjs.com and create a free account
   2. Add a new Email Service (Gmail recommended) → copy Service ID
   3. Create each template listed below → copy Template IDs
   4. Go to Account → API Keys → copy Public Key
   5. Replace the placeholder values below with your real IDs
   ================================================================ */

const EMAILJS_CONFIG = {
  publicKey:  'YOUR_EMAILJS_PUBLIC_KEY',   // From emailjs.com → Account → API Keys
  serviceId:  'YOUR_SERVICE_ID',            // From emailjs.com → Email Services

  // Template IDs — create each in EmailJS → Email Templates
  templates: {
    otp:                   'sjcabs_otp',
    bookingConfirmed:      'sjcabs_booking_confirmed',
    driverAssigned:        'sjcabs_driver_assigned',
    driverOnWay:           'sjcabs_driver_on_way',
    rideCompleted:         'sjcabs_ride_completed',
    paymentConfirmed:      'sjcabs_payment_confirmed',
    bookingCancelled:      'sjcabs_booking_cancelled',
    driverNewTrip:         'sjcabs_driver_new_trip',
    captainReceived:       'sjcabs_captain_received',
    captainUnderReview:    'sjcabs_captain_under_review',
    captainDocsPending:    'sjcabs_captain_docs_pending',
    captainDocsMismatch:   'sjcabs_captain_docs_mismatch',
    captainInspectionSched:'sjcabs_captain_inspection',
    captainApproved:       'sjcabs_captain_approved',
    captainRejected:       'sjcabs_captain_rejected',
    captainResubmission:   'sjcabs_captain_resubmit',
    adminNewBooking:       'sjcabs_admin_new_booking',
    adminNewCaptain:       'sjcabs_admin_new_captain',
    adminPaymentAlert:     'sjcabs_admin_payment',
  },

  // Admin email — receives internal alerts
  adminEmail: 'support@innovexc.io',
  adminName:  'SJ Cabs Admin',
  fromName:   'SJ Cabs',
  replyTo:    'support@innovexc.io',
};

/* ── OTP Store (in-memory, cleared on page unload) ── */
const _otpStore = {};
function _generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
function _storeOTP(identifier, otp) {
  _otpStore[identifier] = { otp, expiry: Date.now() + 10 * 60 * 1000 }; // 10 min
}
function _verifyOTPCode(identifier, inputOtp) {
  const entry = _otpStore[identifier];
  if (!entry) return { valid: false, reason: 'OTP not found. Please request a new one.' };
  if (Date.now() > entry.expiry) { delete _otpStore[identifier]; return { valid: false, reason: 'OTP expired. Please request a new one.' }; }
  if (entry.otp !== String(inputOtp).trim()) return { valid: false, reason: 'Incorrect OTP. Please try again.' };
  delete _otpStore[identifier];
  return { valid: true };
}

/* ── EmailJS Loader ── */
let _ejsReady = false;
function _loadEmailJS(callback) {
  if (_ejsReady && window.emailjs) { callback(); return; }
  if (document.getElementById('emailjs-sdk')) { 
    const wait = setInterval(() => { if (window.emailjs) { clearInterval(wait); _ejsReady = true; callback(); } }, 100);
    return;
  }
  const s = document.createElement('script');
  s.id  = 'emailjs-sdk';
  s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  s.onload = () => {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    _ejsReady = true;
    callback();
  };
  document.head.appendChild(s);
}

/* ── Core send function ── */
function _sendEmail(templateId, params, onSuccess, onError) {
  _loadEmailJS(() => {
    if (EMAILJS_CONFIG.publicKey === 'YOUR_EMAILJS_PUBLIC_KEY') {
      console.warn('[SJCabs Email] EmailJS not configured. Params:', params);
      if (onSuccess) onSuccess({ mode: 'demo' });
      return;
    }
    const payload = Object.assign({
      from_name:  EMAILJS_CONFIG.fromName,
      reply_to:   EMAILJS_CONFIG.replyTo,
    }, params);
    emailjs.send(EMAILJS_CONFIG.serviceId, templateId, payload)
      .then(r => { if (onSuccess) onSuccess(r); })
      .catch(e => { console.error('[SJCabs Email] Error:', e); if (onError) onError(e); });
  });
}

/* ================================================================
   PUBLIC EMAIL FUNCTIONS
   ================================================================ */

/* ── 1. OTP ── */
const SJEmail = {

  sendOTP(email, name, identifier) {
    return new Promise((resolve, reject) => {
      if (!email || !email.includes('@')) { reject('Invalid email address'); return; }
      const otp = _generateOTP();
      _storeOTP(identifier || email, otp);
      _sendEmail(EMAILJS_CONFIG.templates.otp, {
        to_email: email,
        to_name:  name || 'Customer',
        otp_code: otp,
        expiry_mins: '10',
      },
      () => resolve(otp),
      (e) => {
        // Fallback — store OTP anyway so demo still works
        resolve(otp);
      });
    });
  },

  verifyOTP(identifier, inputOtp) {
    return _verifyOTPCode(identifier, inputOtp);
  },

  /* ── 2. Booking Confirmed ── */
  bookingConfirmed(booking) {
    if (!booking.customerEmail) return;
    _sendEmail(EMAILJS_CONFIG.templates.bookingConfirmed, {
      to_email:     booking.customerEmail,
      to_name:      booking.customerName || 'Customer',
      booking_id:   booking.id,
      from_loc:     booking.from,
      to_loc:       booking.to,
      booking_type: booking.type,
      pickup_time:  booking.date + (booking.time ? ' at ' + booking.time : ''),
      fare:         booking.fare ? '₹' + booking.fare.toLocaleString() : 'On request',
      driver_name:  booking.driver ? booking.driver.name : 'Being assigned',
      driver_phone: booking.driver ? booking.driver.mobile : '—',
      vehicle:      booking.driver ? booking.driver.cab : '—',
      plate:        booking.driver ? booking.driver.reg  : '—',
      payment_type: booking.paymentType === 'advance' ? '₹100 advance paid · Balance to driver after trip' : 'Full payment',
      portal_link:  window.location.origin + '/login.html',
    });
  },

  /* ── 3. Driver Assigned ── */
  driverAssigned(booking) {
    if (!booking.customerEmail) return;
    _sendEmail(EMAILJS_CONFIG.templates.driverAssigned, {
      to_email:     booking.customerEmail,
      to_name:      booking.customerName || 'Customer',
      booking_id:   booking.id,
      driver_name:  booking.driver.name,
      driver_phone: booking.driver.mobile,
      vehicle:      booking.driver.cab,
      plate:        booking.driver.reg,
      from_loc:     booking.from,
      to_loc:       booking.to,
      pickup_time:  booking.date,
      portal_link:  window.location.origin + '/login.html',
    });
  },

  /* ── 4. Driver On The Way ── */
  driverOnWay(booking) {
    if (!booking.customerEmail) return;
    _sendEmail(EMAILJS_CONFIG.templates.driverOnWay, {
      to_email:    booking.customerEmail,
      to_name:     booking.customerName || 'Customer',
      booking_id:  booking.id,
      driver_name: booking.driver.name,
      plate:       booking.driver.reg,
      vehicle:     booking.driver.cab,
      portal_link: window.location.origin + '/login.html',
    });
  },

  /* ── 5. Ride Completed ── */
  rideCompleted(booking) {
    if (!booking.customerEmail) return;
    _sendEmail(EMAILJS_CONFIG.templates.rideCompleted, {
      to_email:       booking.customerEmail,
      to_name:        booking.customerName || 'Customer',
      booking_id:     booking.id,
      from_loc:       booking.from,
      to_loc:         booking.to,
      fare:           booking.fare ? '₹' + booking.fare.toLocaleString() : '—',
      driver_name:    booking.driver.name,
      payment_status: booking.paymentType === 'advance'
        ? 'You paid ₹100 advance. Balance ₹' + (booking.fare - 100).toLocaleString() + ' due to driver.'
        : 'Full payment via ' + (booking.paymentMethod || 'UPI/GPay'),
      feedback_link:  window.location.origin + '/login.html#feedback',
    });
  },

  /* ── 6. Payment Confirmed ── */
  paymentConfirmed(booking) {
    if (!booking.customerEmail) return;
    _sendEmail(EMAILJS_CONFIG.templates.paymentConfirmed, {
      to_email:   booking.customerEmail,
      to_name:    booking.customerName || 'Customer',
      booking_id: booking.id,
      amount:     booking.fare ? '₹' + booking.fare.toLocaleString() : '—',
      date:       new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    });
  },

  /* ── 7. Booking Cancelled ── */
  bookingCancelled(booking, reason) {
    if (!booking.customerEmail) return;
    _sendEmail(EMAILJS_CONFIG.templates.bookingCancelled, {
      to_email:   booking.customerEmail,
      to_name:    booking.customerName || 'Customer',
      booking_id: booking.id,
      from_loc:   booking.from,
      to_loc:     booking.to,
      reason:     reason || 'Cancelled by customer',
      rebook_link: window.location.origin + '/sjcabs.html',
    });
  },

  /* ── 8. Driver — New Trip Assigned ── */
  driverNewTrip(driverEmail, driverName, booking) {
    if (!driverEmail) return;
    _sendEmail(EMAILJS_CONFIG.templates.driverNewTrip, {
      to_email:       driverEmail,
      to_name:        driverName,
      booking_id:     booking.id,
      customer_name:  booking.customerName || 'Customer',
      customer_phone: booking.customerPhone || '—',
      from_loc:       booking.from,
      to_loc:         booking.to,
      pickup_time:    booking.date,
      fare:           booking.fare ? '₹' + booking.fare.toLocaleString() : '—',
      payment_note:   booking.paymentType === 'advance'
        ? 'Customer paid ₹100 advance. Collect ₹' + ((booking.fare||0) - 100).toLocaleString() + ' after trip.'
        : 'Full payment already received by SJ Cabs.',
      driver_app:     window.location.origin + '/driver.html',
    });
  },

  /* ── 9. Captain — Application Received ── */
  captainReceived(captain) {
    const email = captain.contact && captain.contact.email;
    if (!email) return;
    _sendEmail(EMAILJS_CONFIG.templates.captainReceived, {
      to_email:    email,
      to_name:     (captain.driver && captain.driver.name) || 'Applicant',
      ref_id:      captain.refId,
      vehicle:     ((captain.vehicle && captain.vehicle.mfr) || '') + ' ' + ((captain.vehicle && captain.vehicle.model) || ''),
      reg_number:  (captain.vehicle && captain.vehicle.regno) || '—',
      status_link: window.location.origin + '/captain-status.html',
    });
    // Also alert admin
    _sendEmail(EMAILJS_CONFIG.templates.adminNewCaptain, {
      to_email:    EMAILJS_CONFIG.adminEmail,
      to_name:     EMAILJS_CONFIG.adminName,
      captain_name:(captain.driver && captain.driver.name) || '—',
      ref_id:      captain.refId,
      vehicle:     ((captain.vehicle && captain.vehicle.mfr) || '') + ' ' + ((captain.vehicle && captain.vehicle.model) || ''),
      reg_number:  (captain.vehicle && captain.vehicle.regno) || '—',
      mobile:      (captain.contact && captain.contact.mobile) || '—',
      admin_link:  window.location.origin + '/admin.html',
    });
  },

  /* ── 10–17. Captain Status Updates ── */
  captainStatusUpdate(captain, newStatus, extra) {
    const email = captain.contact && captain.contact.email;
    if (!email) return;
    const name = (captain.driver && captain.driver.name) || 'Applicant';
    const base = {
      to_email:    email,
      to_name:     name,
      ref_id:      captain.refId,
      status_link: window.location.origin + '/captain-status.html',
    };
    const templateMap = {
      under_review:           EMAILJS_CONFIG.templates.captainUnderReview,
      documents_pending:      EMAILJS_CONFIG.templates.captainDocsPending,
      documents_not_matching: EMAILJS_CONFIG.templates.captainDocsMismatch,
      document_not_appropriate: EMAILJS_CONFIG.templates.captainDocsMismatch,
      inspection_scheduled:   EMAILJS_CONFIG.templates.captainInspectionSched,
      resubmission_required:  EMAILJS_CONFIG.templates.captainResubmission,
      approved:               EMAILJS_CONFIG.templates.captainApproved,
      rejected:               EMAILJS_CONFIG.templates.captainRejected,
    };
    const tmpl = templateMap[newStatus];
    if (!tmpl) return;
    const params = Object.assign({}, base, extra || {});
    if (newStatus === 'approved') {
      params.driver_portal = window.location.origin + '/driver.html';
      params.login_mobile  = (captain.contact && captain.contact.mobile) || '—';
    }
    if (newStatus === 'rejected') {
      params.rejection_reason = (extra && extra.reason) || captain.rejectionReason || 'See portal for details.';
      params.reapply_link = window.location.origin + '/captain.html';
    }
    _sendEmail(tmpl, params);
  },

  /* ── Admin — New Booking Alert ── */
  adminNewBooking(booking) {
    _sendEmail(EMAILJS_CONFIG.templates.adminNewBooking, {
      to_email:      EMAILJS_CONFIG.adminEmail,
      to_name:       EMAILJS_CONFIG.adminName,
      booking_id:    booking.id,
      customer_name: booking.customerName || '—',
      from_loc:      booking.from,
      to_loc:        booking.to,
      fare:          booking.fare ? '₹' + booking.fare.toLocaleString() : '—',
      booking_type:  booking.type,
      admin_link:    window.location.origin + '/admin.html',
    });
  },

  /* ── Admin — Payment Alert ── */
  adminPaymentAlert(booking) {
    _sendEmail(EMAILJS_CONFIG.templates.adminPaymentAlert, {
      to_email:      EMAILJS_CONFIG.adminEmail,
      to_name:       EMAILJS_CONFIG.adminName,
      booking_id:    booking.id,
      customer_name: booking.customerName || '—',
      amount:        booking.fare ? '₹' + booking.fare.toLocaleString() : '—',
      payment_type:  booking.paymentType === 'advance' ? 'Advance (₹100)' : 'Full payment',
      admin_link:    window.location.origin + '/admin.html',
    });
  },
};

/* Make globally available */
window.SJEmail = SJEmail;
