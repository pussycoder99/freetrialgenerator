import React, { useState } from 'react';

function HostingSignup() {
  const [domain, setDomain] = useState('');
  const [extension, setExtension] = useState('.com');
  const [location, setLocation] = useState('USA');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStripeCheckout = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('https://smallcorps.com/securepay/create-checkout-session.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: `${domain}${extension}`,
          location,
          total,
        }),
      });

      const raw = await res.text();
      console.log('Raw response:', raw);

      if (!res.ok) {
        throw new Error(`Server error: ${res.status} - ${raw}`);
      }

      const data = JSON.parse(raw);
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Invalid response format.');
      }
    } catch (err) {
      console.error('Stripe checkout error:', err);
      setErrorMessage('Something went wrong while starting your checkout. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold">Free Hosting Trial</h1>

      <input
        className="border px-3 py-2 w-full"
        placeholder="yourdomain"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />

      <select
        className="border px-3 py-2 w-full"
        value={extension}
        onChange={(e) => setExtension(e.target.value)}
      >
        <option value=".com">.com</option>
        <option value=".org">.org</option>
      </select>

      <select
        className="border px-3 py-2 w-full"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="USA">USA</option>
        <option value="Germany">Germany</option>
        <option value="Bangladesh">Bangladesh</option>
        <option value="Singapore">Singapore</option>
        <option value="Canada">Canada</option>
        <option value="Japan">Japan</option>
      </select>

      <button
        onClick={handleStripeCheckout}
        className="bg-black text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Start My 30-Day Trial'}
      </button>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
}

export default HostingSignup;
