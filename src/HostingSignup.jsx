import { useState } from 'react';
import { Info } from 'lucide-react';

export default function HostingSignup() {
  const [domain, setDomain] = useState('');
  const [extension, setExtension] = useState('.com');
  const [location, setLocation] = useState('USA');
  const [taxRate, setTaxRate] = useState(0.13);
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const basePrice = 25.99;
  const domainPrices = {
    '.com': 9.99,
    '.org': 11.99,
  };
  const locationFees = {
    USA: 0.0,
    Germany: 2.0,
    Bangladesh: 1.0,
    Singapore: 3.0,
    Canada: 0.0,
    Japan: 1.0,
  };

  const locationFee = locationFees[location];
  const subtotal = basePrice + locationFee + domainPrices[extension];
  const tax = subtotal * taxRate;
  const beforeDiscount = subtotal + tax;
  const discountAmount = beforeDiscount * discount;
  const total = Number((beforeDiscount - discountAmount).toFixed(2));

  const checkDomainAvailability = async () => {
    setChecking(true);
    setAvailability(null);
    setTimeout(() => {
      if (domain.length > 5) {
        setAvailability('available');
      } else {
        setAvailability('taken');
      }
      setChecking(false);
    }, 1000);
  };

  const applyCoupon = () => {
    if (coupon.trim().toLowerCase() === 'get10') {
      setDiscount(0.10);
    } else {
      setDiscount(0);
    }
  };

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
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 text-gray-900">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6">Start Your 30-Day Free Hosting Trial</h1>

        {/* Domain Selection */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Choose Your Domain</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="yourdomain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
            <select
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value=".com">.COM ($9.99)</option>
              <option value=".org">.ORG ($11.99)</option>
            </select>
          </div>
          <button
            onClick={checkDomainAvailability}
            disabled={!domain || checking}
            className="mt-3 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {checking ? 'Checking...' : 'Check Availability'}
          </button>
          {availability === 'available' && (
            <p className="text-green-600 mt-2">✅ Domain is available!</p>
          )}
          {availability === 'taken' && (
            <p className="text-red-600 mt-2">❌ Domain is already taken.</p>
          )}
          {availability === 'error' && (
            <p className="text-yellow-600 mt-2">⚠️ Unable to verify domain right now.</p>
          )}
        </div>

        {/* Server Location */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Select Server Location</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            {Object.keys(locationFees).map((loc) => (
              <option key={loc} value={loc}>
                {loc} ({locationFees[loc] === 0 ? 'FREE' : `$${locationFees[loc].toFixed(2)}`})
              </option>
            ))}
          </select>
        </div>

        {/* Control Panel */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Control Panel (Webuzo)</label>
          <p className="text-sm text-gray-700 mb-2">
            Webuzo is a powerful and easy-to-use control panel designed for managing your web applications, domains, and email accounts in one place. It supports one-click installs, database management, and FTP control—all perfect for both beginners and developers.
          </p>
          <input
            type="text"
            value="Webuzo"
            disabled
            className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-600"
          />
        </div>

        {/* Coupon Code */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Have a Coupon Code?</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
            <button
              onClick={applyCoupon}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Apply
            </button>
          </div>
          {discount > 0 && (
            <p className="text-green-600 mt-2">✅ Coupon applied! 10% discount.</p>
          )}
        </div>

        {/* Pricing Summary */}
        <div className="mb-6 border-t pt-4">
          <h2 className="text-2xl font-semibold mb-4">Pricing Summary</h2>
          <div className="bg-gray-100 rounded-xl p-4 shadow-inner">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-1 font-medium">
                Domain <Info className="w-4 h-4 text-gray-400" title="Price depends on selected extension" />
              </div>
              <div>{domain || 'yourdomain'}{extension} <span className="text-gray-500">(${domainPrices[extension].toFixed(2)})</span></div>

              <div className="flex items-center gap-1 font-medium">
                Server Location <Info className="w-4 h-4 text-gray-400" title="May include a small location-based fee" />
              </div>
              <div>{location} <span className="text-gray-500">(${locationFee.toFixed(2)})</span></div>

              <div className="flex items-center gap-1 font-medium">
                Base Hosting <Info className="w-4 h-4 text-gray-400" title="Annual base price for web hosting" />
              </div>
              <div>${basePrice.toFixed(2)}</div>

              <div className="flex items-center gap-1 font-medium">
                Tax (13%) <Info className="w-4 h-4 text-gray-400" title="Standard VAT applied to total" />
              </div>
              <div>${tax.toFixed(2)}</div>

              {discount > 0 && (
                <>
                  <div className="font-medium text-green-700">Discount (10%)</div>
                  <div className="text-green-700">- ${discountAmount.toFixed(2)}</div>
                </>
              )}

              <div className="font-semibold text-lg col-span-2 border-t pt-3 mt-2 flex justify-between">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          className="w-full bg-black text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-900 transition disabled:opacity-60"
          disabled={!domain || loading}
          onClick={handleStripeCheckout}
        >
          {loading ? 'Redirecting to Checkout...' : 'Start My 30-Day Free Trial'}
        </button>
        {errorMessage && (
          <p className="text-red-600 text-sm mt-3 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
