# Frontend (Bootstrap + Vanilla JS)
- Pages: `index.html`, `login.html`, `dashboard.html`
- Set your hCaptcha **Sitekey** in `login.html`:
  ```html
  <div class="h-captcha" data-sitekey="YOUR_HCAPTCHA_SITEKEY_HERE"></div>
  ```
- Set your backend URL in `assets/js/config.js` (`window.API_BASE`).

Local dev:
```bash
cd frontend
python -m http.server 5500
# open http://127.0.0.1:5500
```
