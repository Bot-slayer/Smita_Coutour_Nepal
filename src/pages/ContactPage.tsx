import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-charcoal py-16 sm:py-20 text-center px-4">
        <p className="section-label text-ivory/40 mb-4">Get in Touch</p>
        <h1 className="font-serif text-display-md text-ivory">Contact Us</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <p className="section-label mb-4">Reach Out</p>
            <h2 className="font-serif text-display-sm text-charcoal mb-6">
              We'd Love to Hear From You
            </h2>
            <p className="text-taupe leading-relaxed mb-10">
              Whether you have a question about our collections, need styling advice, or would like
              to visit our boutique — our team is here for you.
            </p>

            <div className="flex flex-col gap-7">
              {[
                { Icon: MapPin, label: 'Boutique', value: 'Maharajgunj, Kathmandu\nBagmati Province, Nepal' },
                { Icon: Phone, label: 'Phone', value: '+977 01 400-0000\n+977 98XXXXXXXX' },
                { Icon: Mail, label: 'Email', value: 'hello@smitacouture.com\nsupport@smitacouture.com' },
                { Icon: Clock, label: 'Opening Hours', value: 'Sunday–Friday: 10:00 AM – 7:00 PM\nSaturday: 11:00 AM – 6:00 PM' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex gap-5">
                  <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-taupe mb-1">{label}</p>
                    <p className="text-sm text-charcoal whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Full name"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="you@example.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-taupe block mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="form-input"
                />
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-taupe block mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  placeholder="Write your message here…"
                  className="form-input resize-none"
                />
              </div>

              <button type="submit" className="btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
