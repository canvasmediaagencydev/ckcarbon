"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { createClient } from '@/lib/supabase-client';
import type { Tables } from '@/database.types';

interface FooterCompanyInfo {
  company_name: string;
  logo_text: string;
  address: string;
  copyright: string;
}

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<Tables<'contact_info'>[]>([]);
  const [socialMedia, setSocialMedia] = useState<Tables<'social_media'>[]>([]);
  const [footerLinks, setFooterLinks] = useState<Tables<'footer_links'>[]>([]);
  const [companyInfo, setCompanyInfo] = useState<FooterCompanyInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch contact info
      const { data: contacts } = await supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      // Fetch social media
      const { data: social } = await supabase
        .from('social_media')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      // Fetch footer links
      const { data: links } = await supabase
        .from('footer_links')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      // Fetch company info from site_settings
      const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'footer_company_info')
        .single();

      if (contacts) setContactInfo(contacts);
      if (social) setSocialMedia(social);
      if (links) setFooterLinks(links);
      if (settings?.setting_value) {
        setCompanyInfo(settings.setting_value as FooterCompanyInfo);
      }
    };

    fetchData();
  }, []);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const getIconComponent = (iconName: string | null) => {
    switch (iconName) {
      case 'FaFacebook':
        return FaFacebook;
      case 'FaInstagram':
        return FaInstagram;
      default:
        return FaFacebook;
    }
  };

  const phones = contactInfo.filter(c => c.contact_type === 'phone');
  const emails = contactInfo.filter(c => c.contact_type === 'email');

  return (
    <motion.footer
      className="relative bg-slate-900 text-white overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-64 h-48 sm:h-64 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-56 sm:w-80 h-56 sm:h-80 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">

          {/* Company Info */}
          <motion.div
            className="lg:col-span-2"
            variants={fadeInVariants}
          >
            <div className="mb-6 sm:mb-8">
              <motion.div
                className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl sm:text-3xl font-bold">
                  <span className="text-gray-400">{companyInfo?.logo_text || 'LOGO'}</span>
                  <br />
                  <span className="text-green-400">{companyInfo?.company_name || 'CK CARBON'}</span>
                </div>
              </motion.div>

              <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
                {companyInfo?.address || 'ธ/1 ถ.บางแตด อ.บ้อง จังหวัดใหม่'}
              </p>

              {/* Contact Info */}
              <div className="space-y-3 sm:space-y-4">
                {phones.map((phone) => (
                  <motion.div
                    key={phone.id}
                    className="flex items-center space-x-2 sm:space-x-3 text-gray-300 text-sm sm:text-base"
                    whileHover={{ x: 5, color: "#10b981" }}
                  >
                    <FaPhone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span>{phone.value}</span>
                  </motion.div>
                ))}

                {emails.map((email) => (
                  <motion.div
                    key={email.id}
                    className="flex items-center space-x-2 sm:space-x-3 text-gray-300 text-sm sm:text-base"
                    whileHover={{ x: 5, color: "#10b981" }}
                  >
                    <FaEnvelope className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="break-all">{email.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Us */}
          <motion.div variants={fadeInVariants}>
            <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-4 sm:mb-6">Contact Us</h3>
            <div className="space-y-3 sm:space-y-4">
              {phones.length > 0 && (
                <motion.div
                  className="flex items-center space-x-2 sm:space-x-3 text-gray-300 text-sm sm:text-base"
                  whileHover={{ x: 5 }}
                >
                  <FaPhone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  <div className="text-sm sm:text-base">
                    {phones.map((phone) => (
                      <div key={phone.id}>{phone.value}</div>
                    ))}
                  </div>
                </motion.div>
              )}

              {emails.map((email) => (
                <motion.div
                  key={email.id}
                  className="flex items-start space-x-2 sm:space-x-3 text-gray-300 text-sm sm:text-base"
                  whileHover={{ x: 5 }}
                >
                  <FaEnvelope className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span className="break-all">{email.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div variants={fadeInVariants}>
            <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-4 sm:mb-6">Social Media</h3>
            <div className="flex space-x-3 sm:space-x-4">
              {socialMedia.map((social) => {
                const IconComponent = getIconComponent(social.icon_name);
                const hoverColor = social.platform === 'facebook' ? 'hover:bg-blue-600' : 'hover:bg-pink-600';
                const rotate = social.platform === 'facebook' ? 10 : -10;

                return (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center ${hoverColor} transition-colors`}
                    whileHover={{ scale: 1.1, rotate }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Border and Copyright */}
        <motion.div
          className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-700"
          variants={fadeInVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              {companyInfo?.copyright || '© 2024 CK Carbon Partnership. All rights reserved.'}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
              {footerLinks.map((link) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  className="hover:text-green-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-green-500"></div>
    </motion.footer>
  );
}