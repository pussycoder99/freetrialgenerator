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
          domain: \`\${domain}\${extension}\`,
          location,
          total,
        }),
      });

      const raw = await res.text();
      console.log('Raw response:', raw);

      if (!res.ok) {
        throw new Error(\`Server error: \${res.status} - \${raw}\`);
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
        ...
      </div>
    </div>
  );
}
