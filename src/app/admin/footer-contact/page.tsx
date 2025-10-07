"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import type { Tables } from '@/database.types';

interface FooterCompanyInfo {
  company_name: string;
  logo_text: string;
  address: string;
  copyright: string;
}

export default function FooterContactAdmin() {
  const [activeTab, setActiveTab] = useState<'contact' | 'social' | 'channels' | 'links' | 'company'>('contact');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Contact Info State
  const [contactInfo, setContactInfo] = useState<Tables<'contact_info'>[]>([]);
  const [newContact, setNewContact] = useState({ type: 'phone', label: '', value: '' });

  // Social Media State
  const [socialMedia, setSocialMedia] = useState<Tables<'social_media'>[]>([]);
  const [newSocial, setNewSocial] = useState({ platform: 'facebook', url: '', icon: 'FaFacebook' });

  // Contact Channels State
  const [contactChannels, setContactChannels] = useState<Tables<'contact_channels'>[]>([]);
  const [newChannel, setNewChannel] = useState({
    type: 'line',
    label: '',
    url: '',
    icon: 'SiLine',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600'
  });

  // Footer Links State
  const [footerLinks, setFooterLinks] = useState<Tables<'footer_links'>[]>([]);
  const [newLink, setNewLink] = useState({ label: '', url: '' });

  // Company Info State
  const [companyInfo, setCompanyInfo] = useState<FooterCompanyInfo>({
    company_name: '',
    logo_text: '',
    address: '',
    copyright: ''
  });

  const supabase = createClient();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);

    // Fetch contact info
    const { data: contacts } = await supabase
      .from('contact_info')
      .select('*')
      .order('display_order');
    if (contacts) setContactInfo(contacts);

    // Fetch social media
    const { data: social } = await supabase
      .from('social_media')
      .select('*')
      .order('display_order');
    if (social) setSocialMedia(social);

    // Fetch contact channels
    const { data: channels } = await supabase
      .from('contact_channels')
      .select('*')
      .order('display_order');
    if (channels) setContactChannels(channels);

    // Fetch footer links
    const { data: links } = await supabase
      .from('footer_links')
      .select('*')
      .order('display_order');
    if (links) setFooterLinks(links);

    // Fetch company info
    const { data: settings } = await supabase
      .from('site_settings')
      .select('*')
      .eq('setting_key', 'footer_company_info')
      .single();
    if (settings?.setting_value) {
      setCompanyInfo(settings.setting_value as FooterCompanyInfo);
    }

    setLoading(false);
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Contact Info Functions
  const addContactInfo = async () => {
    if (!newContact.value) return;

    const { error } = await supabase.from('contact_info').insert({
      contact_type: newContact.type,
      label: newContact.label,
      value: newContact.value,
      display_order: contactInfo.length + 1,
      is_active: true
    });

    if (!error) {
      showMessage('เพิ่มข้อมูลติดต่อสำเร็จ');
      setNewContact({ type: 'phone', label: '', value: '' });
      fetchAllData();
    }
  };

  const deleteContactInfo = async (id: string) => {
    const { error } = await supabase.from('contact_info').delete().eq('id', id);
    if (!error) {
      showMessage('ลบข้อมูลติดต่อสำเร็จ');
      fetchAllData();
    }
  };

  // Social Media Functions
  const addSocialMedia = async () => {
    if (!newSocial.url) return;

    const { error } = await supabase.from('social_media').insert({
      platform: newSocial.platform,
      url: newSocial.url,
      icon_name: newSocial.icon,
      display_order: socialMedia.length + 1,
      is_active: true
    });

    if (!error) {
      showMessage('เพิ่ม Social Media สำเร็จ');
      setNewSocial({ platform: 'facebook', url: '', icon: 'FaFacebook' });
      fetchAllData();
    }
  };

  const deleteSocialMedia = async (id: string) => {
    const { error } = await supabase.from('social_media').delete().eq('id', id);
    if (!error) {
      showMessage('ลบ Social Media สำเร็จ');
      fetchAllData();
    }
  };

  // Contact Channels Functions
  const addContactChannel = async () => {
    if (!newChannel.url || !newChannel.label) return;

    const { error } = await supabase.from('contact_channels').insert({
      channel_type: newChannel.type,
      label: newChannel.label,
      url: newChannel.url,
      icon_name: newChannel.icon,
      color: newChannel.color,
      hover_color: newChannel.hoverColor,
      display_order: contactChannels.length + 1,
      is_active: true
    });

    if (!error) {
      showMessage('เพิ่มช่องทางติดต่อสำเร็จ');
      setNewChannel({
        type: 'line',
        label: '',
        url: '',
        icon: 'SiLine',
        color: 'bg-green-500',
        hoverColor: 'hover:bg-green-600'
      });
      fetchAllData();
    }
  };

  const deleteContactChannel = async (id: string) => {
    const { error } = await supabase.from('contact_channels').delete().eq('id', id);
    if (!error) {
      showMessage('ลบช่องทางติดต่อสำเร็จ');
      fetchAllData();
    }
  };

  // Footer Links Functions
  const addFooterLink = async () => {
    if (!newLink.url || !newLink.label) return;

    const { error } = await supabase.from('footer_links').insert({
      label: newLink.label,
      url: newLink.url,
      display_order: footerLinks.length + 1,
      is_active: true
    });

    if (!error) {
      showMessage('เพิ่มลิงก์ Footer สำเร็จ');
      setNewLink({ label: '', url: '' });
      fetchAllData();
    }
  };

  const deleteFooterLink = async (id: string) => {
    const { error } = await supabase.from('footer_links').delete().eq('id', id);
    if (!error) {
      showMessage('ลบลิงก์ Footer สำเร็จ');
      fetchAllData();
    }
  };

  // Company Info Functions
  const updateCompanyInfo = async () => {
    const { error } = await supabase
      .from('site_settings')
      .update({
        setting_value: companyInfo,
        updated_at: new Date().toISOString()
      })
      .eq('setting_key', 'footer_company_info');

    if (!error) {
      showMessage('อัปเดตข้อมูลบริษัทสำเร็จ');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Footer & Contact Management</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your website footer and contact information</p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-6 py-4 rounded-xl font-medium">
          {message}
        </div>
      )}

      {/* Modern Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-700">
          {[
            { id: 'contact', label: 'Contact Info', icon: '📞' },
            { id: 'social', label: 'Social Media', icon: '📱' },
            { id: 'channels', label: 'Contact Widgets', icon: '💬' },
            { id: 'links', label: 'Footer Links', icon: '🔗' },
            { id: 'company', label: 'Company Info', icon: '🏢' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-8">
          {/* Contact Info Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Contact Information</h2>
                <p className="text-slate-600 dark:text-slate-400">Add and manage your contact details</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add New Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contact Type</label>
                    <select
                      value={newContact.type}
                      onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                    >
                      <option value="phone">Phone</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Label (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g., Main Office"
                      value={newContact.label}
                      onChange={(e) => setNewContact({ ...newContact, label: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Value</label>
                    <input
                      type="text"
                      placeholder={newContact.type === 'phone' ? 'Phone number' : 'Email address'}
                      value={newContact.value}
                      onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={addContactInfo}
                  className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium"
                >
                  Add Contact
                </button>
              </div>

              <div className="space-y-3">
                {contactInfo.map((contact) => (
                  <div key={contact.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {contact.contact_type === 'phone' ? '📞' : '✉️'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {contact.contact_type === 'phone' ? 'Phone' : 'Email'}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400">{contact.value}</div>
                        {contact.label && (
                          <div className="text-sm text-slate-500 dark:text-slate-500">{contact.label}</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteContactInfo(contact.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Social Media</h2>
                <p className="text-slate-600 dark:text-slate-400">Manage your social media profiles</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Platform</label>
                    <select
                      value={newSocial.platform}
                      onChange={(e) => {
                        const icon = e.target.value === 'facebook' ? 'FaFacebook' : 'FaInstagram';
                        setNewSocial({ ...newSocial, platform: e.target.value, icon });
                      }}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                    >
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">URL</label>
                    <input
                      type="text"
                      placeholder="https://facebook.com/yourpage"
                      value={newSocial.url}
                      onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={addSocialMedia}
                  className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium"
                >
                  Add Social Media
                </button>
              </div>

              <div className="space-y-3">
                {socialMedia.map((social) => (
                  <div key={social.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          {social.platform === 'facebook' ? '📘' : '📷'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white capitalize">{social.platform}</div>
                        <div className="text-slate-600 dark:text-slate-400">{social.url}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteSocialMedia(social.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Channels Tab */}
          {activeTab === 'channels' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Contact Widgets</h2>
                <p className="text-slate-600 dark:text-slate-400">Sticky contact widgets for your website</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add Contact Widget</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Widget Type</label>
                    <select
                      value={newChannel.type}
                      onChange={(e) => {
                        let icon = 'SiLine';
                        let color = 'bg-green-500';
                        let hoverColor = 'hover:bg-green-600';

                        if (e.target.value === 'messenger') {
                          icon = 'FaFacebookMessenger';
                          color = 'bg-blue-500';
                          hoverColor = 'hover:bg-blue-600';
                        } else if (e.target.value === 'phone') {
                          icon = 'FaPhone';
                          color = 'bg-purple-500';
                          hoverColor = 'hover:bg-purple-600';
                        }

                        setNewChannel({ ...newChannel, type: e.target.value, icon, color, hoverColor });
                      }}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                    >
                      <option value="line">Line</option>
                      <option value="messenger">Messenger</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Label</label>
                    <input
                      type="text"
                      placeholder="e.g., Chat with us"
                      value={newChannel.label}
                      onChange={(e) => setNewChannel({ ...newChannel, label: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">URL</label>
                    <input
                      type="text"
                      placeholder="Contact URL"
                      value={newChannel.url}
                      onChange={(e) => setNewChannel({ ...newChannel, url: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={addContactChannel}
                  className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium"
                >
                  Add Widget
                </button>
              </div>

              <div className="space-y-3">
                {contactChannels.map((channel) => (
                  <div key={channel.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 ${channel.color} rounded-lg flex items-center justify-center`}>
                        <span className="text-white font-bold">
                          {channel.channel_type === 'line' ? '💬' : channel.channel_type === 'messenger' ? '🔵' : '📞'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{channel.label}</div>
                        <div className="text-slate-600 dark:text-slate-400">{channel.url}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-500 capitalize">{channel.channel_type}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteContactChannel(channel.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Links Tab */}
          {activeTab === 'links' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Footer Links</h2>
                <p className="text-slate-600 dark:text-slate-400">Manage links in your website footer</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add Footer Link</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Link Label</label>
                    <input
                      type="text"
                      placeholder="e.g., Privacy Policy"
                      value={newLink.label}
                      onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">URL</label>
                    <input
                      type="text"
                      placeholder="https://example.com/privacy"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={addFooterLink}
                  className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium"
                >
                  Add Link
                </button>
              </div>

              <div className="space-y-3">
                {footerLinks.map((link) => (
                  <div key={link.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <span className="text-slate-600 dark:text-slate-400 font-bold">🔗</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{link.label}</div>
                        <div className="text-slate-600 dark:text-slate-400">{link.url}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteFooterLink(link.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Info Tab */}
          {activeTab === 'company' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Company Information</h2>
                <p className="text-slate-600 dark:text-slate-400">Update your company details and branding</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Logo Text</label>
                    <input
                      type="text"
                      placeholder="Your company logo text"
                      value={companyInfo.logo_text}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, logo_text: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                    <input
                      type="text"
                      placeholder="Your company name"
                      value={companyInfo.company_name}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, company_name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address</label>
                    <textarea
                      placeholder="Your company address"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Copyright Text</label>
                    <input
                      type="text"
                      placeholder="© 2024 Your Company. All rights reserved."
                      value={companyInfo.copyright}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, copyright: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={updateCompanyInfo}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium"
                  >
                    Save Company Information
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
