import React from 'react';
import { MapPin, Award, Clock, Users, Leaf, Heart, Globe, Truck, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();
  const { contactInfo, businessHours } = settings;

  const addressContact = contactInfo.find(c => c.contact_type === 'address' && c.is_primary) ||
                         contactInfo.find(c => c.contact_type === 'address');
  const address = addressContact?.value || 'Seriqueavenue Studio, Jaipur, Rajasthan';

  const formatBusinessHours = () => {
    if (!businessHours || businessHours.length === 0) {
      return 'Monday - Saturday: 10:00 AM - 6:00 PM';
    }
    const openDays = businessHours.filter(bh => bh.is_open);
    if (openDays.length === 7) {
      const firstDay = businessHours.find(bh => bh.is_open);
      if (firstDay?.is_24_hours) return 'Open 24/7';
      if (firstDay?.open_time && firstDay?.close_time) {
        return `Monday - Sunday: ${firstDay.open_time} - ${firstDay.close_time}`;
      }
    }
    return 'Monday - Saturday: 10:00 AM - 6:00 PM';
  };

  const hours = formatBusinessHours();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <div className="relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544816155-12df9643f363?w=1600&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-serif font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Seriqueavenue
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-stone-300 font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The Avenue of Craft, Organic and Handmade Products
            </motion.p>
            <motion.div
              className="flex items-center justify-center text-stone-400 text-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <MapPin className="mr-2 h-5 w-5" />
              <span>{address}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Our Story ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6">Our Story</h2>
              <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                Seriqueavenue was born from a deep respect for traditional craftsmanship and the timeless beauty of natural fibers. 
                Our journey began with a simple mission: to bridge the gap between rural artisan communities and modern homes, 
                bringing sustainable, handcrafted woven goods to those who value quality over quantity.
              </p>
              <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                We believe that every handmade item carries the soul of its creator. From our signature woven bags 
                crafted from organic jute and seagrass to our intricate storage baskets made of sustainable willow, 
                every Seriqueavenue piece is a testament to skills passed down through generations.
              </p>
              <p className="text-lg text-stone-600 leading-relaxed">
                By choosing Seriqueavenue, you're not just buying a product; you're supporting artisan livelihoods and 
                choosing an eco-friendly path. We are committed to using 100% natural materials and ethical production 
                processes that honor both the artist and the environment.
              </p>
            </motion.div>

            <motion.div className="relative" variants={itemVariants}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1591084728795-1149f32d9866?w=800&q=80"
                  alt="Handmade woven baskets"
                  crossOrigin="anonymous"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-stone-900 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-8 w-8 text-accent-400" />
                  <div>
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-sm text-stone-300">Sustainable Materials</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">
              The Seriqueavenue Standard
            </h2>
            <p className="text-lg text-stone-500 max-w-3xl mx-auto">
              We define quality through organic materials, ethical crafting, and timeless design
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: Leaf, title: 'Organic & Natural', text: 'We use 100% natural fibers like jute, willow, straw, and cotton. No synthetic resins or toxic dyes — just pure, organic beauty.' },
              { icon: Scissors, title: 'Artisan Crafted', text: 'Every bag and basket is hand-woven by skilled artisans. The unique variations in every piece are the fingerprints of human artistry.' },
              { icon: Award, title: 'Heirloom Quality', text: 'Our products are built to last. We focus on durable weaving techniques that ensure your favorite bag or basket stays with you for years.' },
            ].map(({ icon: Icon, title, text }) => (
              <motion.div
                key={title}
                className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm text-center hover:shadow-md transition-shadow duration-300"
                variants={itemVariants}
              >
                <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="h-7 w-7 text-stone-700" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{title}</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Collections ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="order-2 lg:order-1" variants={itemVariants}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80"
                  alt="Traditional woolen items"
                  crossOrigin="anonymous"
                  className="w-full h-96 object-cover"
                />
              </div>
            </motion.div>

            <motion.div className="order-1 lg:order-2" variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6">
                Our Craft Collections
              </h2>
              <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                Explore a world of textures and patterns. Each collection is curated to bring warmth 
                and character to your lifestyle and home.
              </p>
              <ul className="space-y-4">
                {[
                  ['Woven Bags', 'Sustainable jute & cotton shoppers and handbags'],
                  ['Handmade Baskets', 'Natural willow storage for home & laundry'],
                  ['Hand Woolen Purses', 'Intricately knitted and embroidered accessories'],
                  ['Organic Home Decor', 'Woven wall art and table settings'],
                  ['Gift Curations', 'Handcrafted sets for eco-conscious gifting'],
                  ['The Kids Collection', 'Soft woolen toys and natural nursery baskets'],
                ].map(([title, desc]) => (
                  <li key={title} className="flex items-center gap-3 text-stone-700">
                    <span className="w-2 h-2 bg-accent-600 rounded-full flex-shrink-0" />
                    <span><strong className="text-stone-900">{title}</strong> — {desc}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-16 md:py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Craft Ethics</h2>
            <p className="text-lg text-stone-400 max-w-3xl mx-auto">
              The principles behind every Seriqueavenue weave
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { title: 'Sustainability', text: 'We prioritize renewable resources and planet-friendly production.' },
              { title: 'Fair Trade', text: 'Every artisan is paid fairly, supporting families and community growth.' },
              { title: 'Preservation', text: 'We help keep traditional weaving techniques alive in a digital world.' },
              { title: 'Transparency', text: 'Honest sourcing and clear communication about what goes into our products.' },
            ].map(({ title, text }) => (
              <motion.div
                key={title}
                className="bg-white/5 p-6 rounded-xl border border-white/10"
                variants={itemVariants}
              >
                <h3 className="text-lg font-bold mb-3 text-accent-400">{title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Shipping & Contact ── */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">
              Worldwide Artisan Delivery
            </h2>
            <p className="text-lg text-stone-500 max-w-3xl mx-auto">
              Bringing organic craft to your doorstep, wherever you are
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm h-full">
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-6">Contact Us</h3>
                <div className="space-y-5">
                  {[
                    { icon: MapPin, label: 'Studio', value: address },
                    { icon: Clock, label: 'Studio Hours', value: hours },
                    { icon: Truck, label: 'Shipping', value: 'Domestic India delivery · Worldwide express shipping' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-accent-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="h-4 w-4 text-accent-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900 text-sm">{label}</p>
                        <p className="text-stone-500 text-sm mt-0.5 whitespace-pre-line">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-stone-100">
                  <h4 className="font-semibold text-stone-900 mb-2">Artisan Collaborations</h4>
                  <p className="text-sm text-stone-500 mb-5 leading-relaxed">
                    Are you an artisan or a store owner looking to partner with us? We'd love to hear from you. 
                    We offer wholesale opportunities and custom production.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-colors"
                  >
                    Get in Touch
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div className="rounded-2xl overflow-hidden shadow-sm border border-stone-100 h-96 lg:h-auto" variants={itemVariants}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113896.467332306!2d75.7138379!3d26.8851151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1705000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Seriqueavenue Studio Location"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;

