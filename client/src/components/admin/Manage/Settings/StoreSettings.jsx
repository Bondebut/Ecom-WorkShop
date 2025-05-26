import React, { useState, useEffect } from 'react';
import { Save, Upload, Plus, Trash2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const StoreSettings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [logoPreview, setLogoPreview] = useState('');
  const [storeSettings, setStoreSettings] = useState({
    general: {
      storeName: '',
      storeDescription: '',
      storePhone: '',
      storeEmail: '',
      storeLogo: null,
      storeAddress: '',
      storeCity: '',
      storeProvince: '',
      storePostalCode: '',
      storeCountry: 'TH',
      storeTaxId: '',
    },
    social: {
      facebook: '',
      instagram: '',
      line: '',
      twitter: '',
      youtube: ''
    },
    payment: {
      bankAccounts: [
        { bank: '', accountName: '', accountNumber: '', branch: '' }
      ]
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      googleAnalytics: '',
      facebookPixel: ''
    },
    appearance: {
      primaryColor: '#3B82F6',
      secondaryColor: '#6B7280',
      bannerText: '',
      showNewBadge: true,
      showDiscountBadge: true,
      featuredProductsCount: 8
    }
  });

  useEffect(() => {
    loadStoreSettings();
  }, []);

  const loadStoreSettings = async () => {
    setLoading(true);
    try {
      // In real app, fetch from API
      // const response = await api.get('/store/settings');
      // setStoreSettings(response.data);
      
      // For demo, use mock data with delay
      setTimeout(() => {
        // Mock data already set in useState
        setLogoPreview('https://placehold.co/200x100/eee/31343C?text=SHOP+LOGO');
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load store settings:', error);
      setLoading(false);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดการตั้งค่าร้านค้าได้',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In real app, send to API
      // await api.post('/store/settings', storeSettings);
      
      // For demo, simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      Swal.fire({
        title: 'บันทึกสำเร็จ',
        text: 'บันทึกการตั้งค่าร้านค้าเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });
    } catch (error) {
      console.error('Failed to save store settings:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกการตั้งค่าร้านค้าได้',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setStoreSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleBankAccountChange = (index, field, value) => {
    const updatedBankAccounts = [...storeSettings.payment.bankAccounts];
    updatedBankAccounts[index] = {
      ...updatedBankAccounts[index],
      [field]: value
    };
    
    setStoreSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        bankAccounts: updatedBankAccounts
      }
    }));
  };

  const addBankAccount = () => {
    setStoreSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        bankAccounts: [
          ...prev.payment.bankAccounts,
          { bank: '', accountName: '', accountNumber: '', branch: '' }
        ]
      }
    }));
  };

  const removeBankAccount = (index) => {
    if (storeSettings.payment.bankAccounts.length <= 1) {
      Swal.fire({
        title: 'ไม่สามารถลบได้',
        text: 'ต้องมีบัญชีธนาคารอย่างน้อย 1 บัญชี',
        icon: 'warning',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    const updatedBankAccounts = storeSettings.payment.bankAccounts.filter((_, i) => i !== index);
    
    setStoreSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        bankAccounts: updatedBankAccounts
      }
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        title: 'ไฟล์ไม่ถูกต้อง',
        text: 'กรุณาอัปโหลดไฟล์ภาพเท่านั้น (JPEG, PNG, WEBP)',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    if (file.size > maxSize) {
      Swal.fire({
        title: 'ไฟล์มีขนาดใหญ่เกินไป',
        text: 'กรุณาอัปโหลดไฟล์ขนาดไม่เกิน 2MB',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Update store settings
    setStoreSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        storeLogo: file
      }
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">ข้อมูลร้านค้า</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อร้านค้า <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={storeSettings.general.storeName}
              onChange={(e) => handleInputChange('general', 'storeName', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="ชื่อร้านค้าของคุณ"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              คำอธิบายร้านค้า
            </label>
            <textarea
              value={storeSettings.general.storeDescription}
              onChange={(e) => handleInputChange('general', 'storeDescription', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="อธิบายเกี่ยวกับร้านค้าของคุณ"
              rows="3"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เบอร์โทรศัพท์ <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={storeSettings.general.storePhone}
                onChange={(e) => handleInputChange('general', 'storePhone', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0xx-xxx-xxxx"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={storeSettings.general.storeEmail}
                onChange={(e) => handleInputChange('general', 'storeEmail', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="example@domain.com"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เลขประจำตัวผู้เสียภาษี
            </label>
            <input
              type="text"
              value={storeSettings.general.storeTaxId}
              onChange={(e) => handleInputChange('general', 'storeTaxId', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="เลขประจำตัวผู้เสียภาษี"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">โลโก้ร้านค้า</h3>
          
          <div className="mb-4">
            <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg bg-gray-50">
              {logoPreview ? (
                <div className="mb-3">
                  <img
                    src={logoPreview}
                    alt="Store Logo Preview"
                    className="max-h-24 max-w-full"
                  />
                </div>
              ) : (
                <div className="text-center text-gray-500 mb-3">
                  <AlertCircle size={48} className="mx-auto mb-2" />
                  <p>ยังไม่มีโลโก้</p>
                </div>
              )}
              
              <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
                <Upload size={18} className="mr-2" />
                อัปโหลดโลโก้
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                แนะนำขนาด 200x100 พิกเซล (รองรับไฟล์ JPEG, PNG, WEBP ขนาดไม่เกิน 2MB)
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-4">ที่อยู่ร้านค้า</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ที่อยู่ <span className="text-red-500">*</span>
            </label>
            <textarea
              value={storeSettings.general.storeAddress}
              onChange={(e) => handleInputChange('general', 'storeAddress', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="เลขที่ หมู่ ถนน ซอย"
              rows="2"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เมือง/อำเภอ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={storeSettings.general.storeCity}
                onChange={(e) => handleInputChange('general', 'storeCity', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                จังหวัด <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={storeSettings.general.storeProvince}
                onChange={(e) => handleInputChange('general', 'storeProvince', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รหัสไปรษณีย์ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={storeSettings.general.storePostalCode}
                onChange={(e) => handleInputChange('general', 'storePostalCode', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประเทศ
              </label>
              <select
                value={storeSettings.general.storeCountry}
                onChange={(e) => handleInputChange('general', 'storeCountry', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="TH">ไทย</option>
                <option value="OTHER">อื่นๆ</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialSettings = () => (
    <div>
      <h3 className="text-lg font-medium mb-4">โซเชียลมีเดีย</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Facebook
          </label>
          <input
            type="url"
            value={storeSettings.social.facebook}
            onChange={(e) => handleInputChange('social', 'facebook', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://facebook.com/yourpage"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instagram
          </label>
          <input
            type="url"
            value={storeSettings.social.instagram}
            onChange={(e) => handleInputChange('social', 'instagram', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://instagram.com/youraccount"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Line Official Account
          </label>
          <input
            type="text"
            value={storeSettings.social.line}
            onChange={(e) => handleInputChange('social', 'line', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="@yourline"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Twitter
          </label>
          <input
            type="url"
            value={storeSettings.social.twitter}
            onChange={(e) => handleInputChange('social', 'twitter', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://twitter.com/youraccount"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            YouTube
          </label>
          <input
            type="url"
            value={storeSettings.social.youtube}
            onChange={(e) => handleInputChange('social', 'youtube', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://youtube.com/yourchannel"
          />
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div>
      <h3 className="text-lg font-medium mb-4">บัญชีธนาคาร</h3>
      
      {storeSettings.payment.bankAccounts.map((account, index) => (
        <div key={index} className="mb-6 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">บัญชีธนาคาร #{index + 1}</h4>
            <button
              type="button"
              onClick={() => removeBankAccount(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ธนาคาร <span className="text-red-500">*</span>
              </label>
              <select
                value={account.bank}
                onChange={(e) => handleBankAccountChange(index, 'bank', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">เลือกธนาคาร</option>
                <option value="kbank">ธนาคารกสิกรไทย</option>
                <option value="bbl">ธนาคารกรุงเทพ</option>
                <option value="ktb">ธนาคารกรุงไทย</option>
                <option value="scb">ธนาคารไทยพาณิชย์</option>
                <option value="bay">ธนาคารกรุงศรีอยุธยา</option>
                <option value="tmb">ธนาคารทหารไทยธนชาต</option>
                <option value="gsb">ธนาคารออมสิน</option>
                <option value="other">ธนาคารอื่นๆ</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                สาขา
              </label>
              <input
                type="text"
                value={account.branch}
                onChange={(e) => handleBankAccountChange(index, 'branch', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="สาขา"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อบัญชี <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={account.accountName}
                onChange={(e) => handleBankAccountChange(index, 'accountName', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="ชื่อบัญชี"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เลขที่บัญชี <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={account.accountNumber}
                onChange={(e) => handleBankAccountChange(index, 'accountNumber', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="เลขที่บัญชี"
                required
              />
            </div>
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addBankAccount}
        className="flex items-center text-blue-500 hover:text-blue-700"
      >
        <Plus size={16} className="mr-1" />
        เพิ่มบัญชีธนาคาร
      </button>
    </div>
  );

  const renderSeoSettings = () => (
    <div>
      <h3 className="text-lg font-medium mb-4">การตั้งค่า SEO</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Title
        </label>
        <input
          type="text"
          value={storeSettings.seo.metaTitle}
          onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Title ของร้านค้า (แสดงบน Tab ของเว็บเบราว์เซอร์)"
        />
        <p className="text-xs text-gray-500 mt-1">
          แนะนำให้มีความยาวไม่เกิน 60 ตัวอักษร
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Description
        </label>
        <textarea
          value={storeSettings.seo.metaDescription}
          onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="คำอธิบายร้านค้าสำหรับแสดงในผลการค้นหา"
          rows="3"
        />
        <p className="text-xs text-gray-500 mt-1">
          แนะนำให้มีความยาวไม่เกิน 160 ตัวอักษร
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Keywords
        </label>
        <input
          type="text"
          value={storeSettings.seo.keywords}
          onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="keyword1, keyword2, keyword3"
        />
        <p className="text-xs text-gray-500 mt-1">
          คั่นแต่ละคำด้วยเครื่องหมายจุลภาค (,)
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Google Analytics ID
        </label>
        <input
          type="text"
          value={storeSettings.seo.googleAnalytics}
          onChange={(e) => handleInputChange('seo', 'googleAnalytics', e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="UA-XXXXXXXXX-X หรือ G-XXXXXXXXXX"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Facebook Pixel ID
        </label>
        <input
          type="text"
          value={storeSettings.seo.facebookPixel}
          onChange={(e) => handleInputChange('seo', 'facebookPixel', e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="XXXXXXXXXXXXXXXXXX"
        />
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div>
      <h3 className="text-lg font-medium mb-4">การตั้งค่าการแสดงผล</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            สีหลัก
          </label>
          <div className="flex items-center">
            <input
              type="color"
              value={storeSettings.appearance.primaryColor}
              onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
              className="w-12 h-10 p-1 border rounded"
            />
            <input
              type="text"
              value={storeSettings.appearance.primaryColor}
              onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
              className="ml-2 px-3 py-2 border rounded-md w-full"
              placeholder="#RRGGBB"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            สีรอง
          </label>
          <div className="flex items-center">
            <input
              type="color"
              value={storeSettings.appearance.secondaryColor}
              onChange={(e) => handleInputChange('appearance', 'secondaryColor', e.target.value)}
              className="w-12 h-10 p-1 border rounded"
            />
            <input
              type="text"
              value={storeSettings.appearance.secondaryColor}
              onChange={(e) => handleInputChange('appearance', 'secondaryColor', e.target.value)}
              className="ml-2 px-3 py-2 border rounded-md w-full"
              placeholder="#RRGGBB"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ข้อความแบนเนอร์ด้านบน
        </label>
        <input
          type="text"
          value={storeSettings.appearance.bannerText}
          onChange={(e) => handleInputChange('appearance', 'bannerText', e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="ข้อความประกาศหรือโปรโมชั่น เช่น 'ส่งฟรีเมื่อซื้อครบ 1,000 บาท'"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          จำนวนสินค้าแนะนำในหน้าแรก
        </label>
        <input
          type="number"
          value={storeSettings.appearance.featuredProductsCount}
          onChange={(e) => handleInputChange('appearance', 'featuredProductsCount', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border rounded-md"
          min="0"
          max="20"
        />
      </div>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={storeSettings.appearance.showNewBadge}
            onChange={(e) => handleInputChange('appearance', 'showNewBadge', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            แสดงป้าย "สินค้าใหม่" สำหรับสินค้าที่เพิ่งเพิ่ม
          </span>
        </label>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={storeSettings.appearance.showDiscountBadge}
            onChange={(e) => handleInputChange('appearance', 'showDiscountBadge', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            แสดงป้ายส่วนลดสำหรับสินค้าที่มีราคาพิเศษ
          </span>
        </label>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'social':
        return renderSocialSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'seo':
        return renderSeoSettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">ตั้งค่าร้านค้า</h2>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Save size={18} className="mr-2" />
          บันทึกการตั้งค่า
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          <button
            className={`px-4 py-3 ${activeTab === 'general' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('general')}
          >
            ข้อมูลทั่วไป
          </button>
          <button
            className={`px-4 py-3 ${activeTab === 'social' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('social')}
          >
            โซเชียลมีเดีย
          </button>
          <button
            className={`px-4 py-3 ${activeTab === 'payment' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('payment')}
          >
            บัญชีธนาคาร
          </button>
          <button
            className={`px-4 py-3 ${activeTab === 'seo' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('seo')}
          >
            SEO
          </button>
          <button
            className={`px-4 py-3 ${activeTab === 'appearance' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('appearance')}
          >
            การแสดงผล
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
          ) : (
            renderActiveTab()
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreSettings;