// src/Pages/Support.jsx
import React, { useState } from 'react';
import { RiMailLine, RiPhoneLine, RiMessageLine, RiArrowRightLine, RiCheckLine } from 'react-icons/ri';

const Support = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send the message to an API endpoint
    console.log('Support message:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero */}
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Support Center</h1>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
            We're here to help. Get answers to your questions or reach out to our team.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        {/* Contact methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
              <RiPhoneLine className="text-white text-xl" />
            </div>
            <h3 className="font-bold mb-1">Phone</h3>
            <p className="text-sm text-zinc-500 mb-2">Mon–Fri, 9am–6pm</p>
            <a href="tel:+254700000000" className="text-black font-semibold text-sm">+254 700 000 000</a>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
              <RiMailLine className="text-white text-xl" />
            </div>
            <h3 className="font-bold mb-1">Email</h3>
            <p className="text-sm text-zinc-500 mb-2">Reply within 24h</p>
            <a href="mailto:support@deviceyangu.com" className="text-black font-semibold text-sm">support@deviceyangu.com</a>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
              <RiMessageLine className="text-white text-xl" />
            </div>
            <h3 className="font-bold mb-1">Live Chat</h3>
            <p className="text-sm text-zinc-500 mb-2">Available 24/7</p>
            <button className="text-black font-semibold text-sm underline">Start chat</button>
          </div>
        </div>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How long does delivery take?', a: 'Nairobi: 1‑2 business days. Other major towns: 2‑4 days. Remote areas: 3‑7 days.' },
              { q: 'Do you offer warranty?', a: 'Yes, all products come with a minimum 1‑year manufacturer warranty.' },
              { q: 'What payment methods do you accept?', a: 'M‑Pesa, cash on delivery, and credit/debit cards.' },
              { q: 'Can I return a product?', a: 'You can return any item within 7 days of delivery for a full refund (unused, original packaging).' },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-zinc-100 p-4">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <RiArrowRightLine className="text-zinc-400 group-open:rotate-90 transition-transform" size={14} />
                </summary>
                <p className="text-sm text-zinc-500 mt-2 pl-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact form */}
        <section className="bg-white rounded-2xl border border-zinc-100 p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight mb-4">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Your name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" />
            </div>
            <div>
              <label className="form-label">Email address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" />
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea name="message" rows="4" value={formData.message} onChange={handleChange} required className="form-input" />
            </div>
            <button type="submit" className="btn-primary w-full md:w-auto">
              Send message
            </button>
          </form>
          {submitted && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-xl flex items-center gap-2">
              <RiCheckLine size={16} /> Thank you! We'll get back to you soon.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Support;