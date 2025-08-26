const HCAPTCHA_VERIFY_URL = "https://hcaptcha.com/siteverify";

module.exports = async function (context, req) {
  context.log('POST /api/login');

  try {
    const body = req.body || {};
    const email = body.email;
    const password = body.password;
    const hcaptchaToken = body.hcaptchaToken;

    if (!email || !password) {
      context.res = { status: 400,  body: { success: false, message: 'Email and password are required.' } };
      return;
    }
    if (!hcaptchaToken) {
      context.res = { status: 400,  body: { success: false, message: 'Missing hCaptcha token.' } };
      return;
    }

    const secret = 'ES_cde6651bdadb407b894f4d931f913618';
    if (!secret) {
      context.res = { status: 500,  body: { success: false, message: 'Server not configured.' } };
      return;
    }

    const params = new URLSearchParams();
    params.append('response', hcaptchaToken);
    params.append('secret', secret);

    const verifyRes = await fetch(HCAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    const verify = await verifyRes.json();

    if (!verify.success) {
      context.res = {
        status: 403,
       
        body: { success: false, message: 'hCaptcha verification failed.', details: verify['error-codes'] || null }
      };
      return;
    }

  
    context.res = { status: 200, body: { success: true, message: 'Login OK' } };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, headers: { 'Content-Type': 'application/json' }, body: { success: false, message: 'Server error.' } };
  }
};
