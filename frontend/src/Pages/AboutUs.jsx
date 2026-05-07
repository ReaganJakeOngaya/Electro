// src/Pages/AboutUs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { RiArrowRightLine, RiShieldCheckLine, RiTruckLine, RiCustomerServiceLine, RiSecurePaymentLine } from 'react-icons/ri';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero section */}
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">About DeviceYangu</h1>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
            Kenya's most trusted destination for authentic gadgets and electronics.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        {/* Our story */}
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">Our Story</h2>
          <p className="text-zinc-600 leading-relaxed mb-4">
            DeviceYangu was born from a simple idea: every Kenyan deserves access to genuine, high‑quality electronics without the hassle of counterfeits or unreliable sellers. What started as a small online store in 2020 has grown into a nationwide e‑commerce platform serving thousands of happy customers.
          </p>
          <p className="text-zinc-600 leading-relaxed">
            We partner directly with authorized distributors and brands to bring you smartphones, laptops, audio gear, wearables, and accessories – all backed by a warranty and a 7‑day return policy.
          </p>
        </section>

        {/* Our values */}
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-6">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <RiShieldCheckLine className="text-2xl text-black flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">100% Authentic</h3>
                <p className="text-sm text-zinc-500">Every product is sourced directly from certified partners.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <RiTruckLine className="text-2xl text-black flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Fast Delivery</h3>
                <p className="text-sm text-zinc-500">Nairobi next‑day delivery & nationwide shipping.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <RiCustomerServiceLine className="text-2xl text-black flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">24/7 Support</h3>
                <p className="text-sm text-zinc-500">Our team is always ready to help you.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <RiSecurePaymentLine className="text-2xl text-black flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Secure Checkout</h3>
                <p className="text-sm text-zinc-500">M‑Pesa, card & cash on delivery – your data is safe.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white rounded-2xl border border-zinc-100 p-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-black text-black">5000+</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wide">Happy customers</div>
            </div>
            <div>
              <div className="text-3xl font-black text-black">200+</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wide">Products</div>
            </div>
            <div>
              <div className="text-3xl font-black text-black">47</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wide">Counties served</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-xl font-black mb-3">Ready to shop with confidence?</h2>
          <Link
            to="/user-dashboard"
            className="inline-flex items-center gap-2 bg-black text-white font-bold px-6 py-3 rounded-xl hover:bg-zinc-800 transition-all"
          >
            Start Shopping <RiArrowRightLine size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;