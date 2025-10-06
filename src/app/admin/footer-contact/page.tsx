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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">จัดการ Footer และ Contact</h1>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('contact')}
          className={`pb-2 px-4 ${activeTab === 'contact' ? 'border-b-2 border-green-500 font-bold' : ''}`}
        >
          ข้อมูลติดต่อ
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`pb-2 px-4 ${activeTab === 'social' ? 'border-b-2 border-green-500 font-bold' : ''}`}
        >
          Social Media
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`pb-2 px-4 ${activeTab === 'channels' ? 'border-b-2 border-green-500 font-bold' : ''}`}
        >
          ช่องทางติดต่อ (Widget)
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`pb-2 px-4 ${activeTab === 'links' ? 'border-b-2 border-green-500 font-bold' : ''}`}
        >
          Footer Links
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`pb-2 px-4 ${activeTab === 'company' ? 'border-b-2 border-green-500 font-bold' : ''}`}
        >
          ข้อมูลบริษัท
        </button>
      </div>

      {/* Contact Info Tab */}
      {activeTab === 'contact' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">ข้อมูลติดต่อ</h2>

          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-bold mb-3">เพิ่มข้อมูลติดต่อใหม่</h3>
            <div className="grid grid-cols-3 gap-4">
              <select
                value={newContact.type}
                onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="phone">โทรศัพท์</option>
                <option value="email">อีเมล</option>
              </select>
              <input
                type="text"
                placeholder="Label (optional)"
                value={newContact.label}
                onChange={(e) => setNewContact({ ...newContact, label: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder={newContact.type === 'phone' ? 'เบอร์โทรศัพท์' : 'อีเมล'}
                value={newContact.value}
                onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                className="border p-2 rounded"
              />
            </div>
            <button
              onClick={addContactInfo}
              className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              เพิ่ม
            </button>
          </div>

          <div className="space-y-2">
            {contactInfo.map((contact) => (
              <div key={contact.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                <div>
                  <span className="font-bold">{contact.contact_type}:</span> {contact.value}
                  {contact.label && <span className="text-gray-500 ml-2">({contact.label})</span>}
                </div>
                <button
                  onClick={() => deleteContactInfo(contact.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Social Media</h2>

          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-bold mb-3">เพิ่ม Social Media ใหม่</h3>
            <div className="grid grid-cols-3 gap-4">
              <select
                value={newSocial.platform}
                onChange={(e) => {
                  const icon = e.target.value === 'facebook' ? 'FaFacebook' : 'FaInstagram';
                  setNewSocial({ ...newSocial, platform: e.target.value, icon });
                }}
                className="border p-2 rounded"
              >
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
              </select>
              <input
                type="text"
                placeholder="URL"
                value={newSocial.url}
                onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                className="border p-2 rounded col-span-2"
              />
            </div>
            <button
              onClick={addSocialMedia}
              className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              เพิ่ม
            </button>
          </div>

          <div className="space-y-2">
            {socialMedia.map((social) => (
              <div key={social.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                <div>
                  <span className="font-bold">{social.platform}:</span> {social.url}
                </div>
                <button
                  onClick={() => deleteSocialMedia(social.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Channels Tab */}
      {activeTab === 'channels' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">ช่องทางติดต่อ (Sticky Widget)</h2>

          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-bold mb-3">เพิ่มช่องทางติดต่อใหม่</h3>
            <div className="grid grid-cols-2 gap-4">
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
                className="border p-2 rounded"
              >
                <option value="line">Line</option>
                <option value="messenger">Messenger</option>
                <option value="phone">Phone</option>
              </select>
              <input
                type="text"
                placeholder="Label"
                value={newChannel.label}
                onChange={(e) => setNewChannel({ ...newChannel, label: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="URL"
                value={newChannel.url}
                onChange={(e) => setNewChannel({ ...newChannel, url: e.target.value })}
                className="border p-2 rounded col-span-2"
              />
            </div>
            <button
              onClick={addContactChannel}
              className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              เพิ่ม
            </button>
          </div>

          <div className="space-y-2">
            {contactChannels.map((channel) => (
              <div key={channel.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                <div>
                  <span className="font-bold">{channel.label} ({channel.channel_type}):</span> {channel.url}
                </div>
                <button
                  onClick={() => deleteContactChannel(channel.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Links Tab */}
      {activeTab === 'links' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Footer Links</h2>

          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-bold mb-3">เพิ่ม Footer Link ใหม่</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Label"
                value={newLink.label}
                onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="URL"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="border p-2 rounded"
              />
            </div>
            <button
              onClick={addFooterLink}
              className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              เพิ่ม
            </button>
          </div>

          <div className="space-y-2">
            {footerLinks.map((link) => (
              <div key={link.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                <div>
                  <span className="font-bold">{link.label}:</span> {link.url}
                </div>
                <button
                  onClick={() => deleteFooterLink(link.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company Info Tab */}
      {activeTab === 'company' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">ข้อมูลบริษัท</h2>

          <div className="bg-white p-4 rounded shadow">
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Logo Text</label>
                <input
                  type="text"
                  value={companyInfo.logo_text}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, logo_text: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">ชื่อบริษัท</label>
                <input
                  type="text"
                  value={companyInfo.company_name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, company_name: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">ที่อยู่</label>
                <textarea
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  className="border p-2 rounded w-full"
                  rows={3}
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Copyright Text</label>
                <input
                  type="text"
                  value={companyInfo.copyright}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, copyright: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>

              <button
                onClick={updateCompanyInfo}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
