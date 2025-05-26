import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, AlertCircle, DollarSign, Package, Truck } from 'lucide-react';
import Swal from 'sweetalert2';

const ShippingSettings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('methods');
  const [shippingSettings, setShippingSettings] = useState({
    methods: [
      {
        id: 1,
        name: 'จัดส่งมาตรฐาน',
        description: 'จัดส่งภายใน 3-5 วันทำการ',
        price: 50,
        isActive: true,
        estimatedDays: '3-5'
      }
    ],
    freeShipping: {
      enabled: true,
      minAmount: 1000
    },
    weightRates: [
      {
        id: 1,
        minWeight: 0,
        maxWeight: 0.5,
        price: 30
      },
      {
        id: 2,
        minWeight: 0.5,
        maxWeight: 1,
        price: 50
      },
      {
        id: 3,
        minWeight: 1,
        maxWeight: 2,
        price: 70
      }
    ],
    regions: [
      {
        id: 1,
        name: 'กรุงเทพและปริมณฑล',
        provinces: ['กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'สมุทรสาคร', 'นครปฐม'],
        additionalFee: 0
      },
      {
        id: 2,
        name: 'ภาคกลาง',
        provinces: [],
        additionalFee: 20
      },
      {
        id: 3,
        name: 'ภาคเหนือ',
        provinces: [],
        additionalFee: 50
      }
    ],
    codFee: {
      enabled: true,
      feeType: 'fixed', // 'fixed' or 'percentage'
      fee: 30,
      percentage: 2
    }
  });

  useEffect(() => {
    loadShippingSettings();
  }, []);

  const loadShippingSettings = async () => {
    setLoading(true);
    try {
      // In real app, fetch from API
      // const response = await api.get('/shipping/settings');
      // setShippingSettings(response.data);
      
      // For demo, use mock data with delay
      setTimeout(() => {
        // Mock data already set in useState
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load shipping settings:', error);
      setLoading(false);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดการตั้งค่าการจัดส่งได้',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In real app, send to API
      // await api.post('/shipping/settings', shippingSettings);
      
      // For demo, simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      Swal.fire({
        title: 'บันทึกสำเร็จ',
        text: 'บันทึกการตั้งค่าการจัดส่งเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });
    } catch (error) {
      console.error('Failed to save shipping settings:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกการตั้งค่าการจัดส่งได้',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  // Shipping Methods Handlers
  const addShippingMethod = () => {
    const newMethod = {
      id: Date.now(),
      name: '',
      description: '',
      price: 0,
      isActive: true,
      estimatedDays: ''
    };
    
    setShippingSettings(prev => ({
      ...prev,
      methods: [...prev.methods, newMethod]
    }));
  };

  const updateShippingMethod = (id, field, value) => {
    setShippingSettings(prev => ({
      ...prev,
      methods: prev.methods.map(method => 
        method.id === id ? { ...method, [field]: value } : method
      )
    }));
  };

  const removeShippingMethod = (id) => {
    if (shippingSettings.methods.length <= 1) {
      Swal.fire({
        title: 'ไม่สามารถลบได้',
        text: 'ต้องมีวิธีการจัดส่งอย่างน้อย 1 วิธี',
        icon: 'warning',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    setShippingSettings(prev => ({
      ...prev,
      methods: prev.methods.filter(method => method.id !== id)
    }));
  };

  // Weight Rates Handlers
  const addWeightRate = () => {
    const newRate = {
      id: Date.now(),
      minWeight: 0,
      maxWeight: 0,
      price: 0
    };
    
    setShippingSettings(prev => ({
      ...prev,
      weightRates: [...prev.weightRates, newRate]
    }));
  };

  const updateWeightRate = (id, field, value) => {
    setShippingSettings(prev => ({
      ...prev,
      weightRates: prev.weightRates.map(rate => 
        rate.id === id ? { ...rate, [field]: parseFloat(value) || 0 } : rate
      )
    }));
  };

  const removeWeightRate = (id) => {
    setShippingSettings(prev => ({
      ...prev,
      weightRates: prev.weightRates.filter(rate => rate.id !== id)
    }));
  };

  // Region Handlers
  const addRegion = () => {
    const newRegion = {
      id: Date.now(),
      name: '',
      provinces: [],
      additionalFee: 0
    };
    
    setShippingSettings(prev => ({
      ...prev,
      regions: [...prev.regions, newRegion]
    }));
  };

  const updateRegion = (id, field, value) => {
    setShippingSettings(prev => ({
      ...prev,
      regions: prev.regions.map(region => 
        region.id === id ? { ...region, [field]: value } : region
      )
    }));
  };

  const removeRegion = (id) => {
    setShippingSettings(prev => ({
      ...prev,
      regions: prev.regions.filter(region => region.id !== id)
    }));
  };

  // Free Shipping Handlers
  const updateFreeShipping = (field, value) => {
    setShippingSettings(prev => ({
      ...prev,
      freeShipping: {
        ...prev.freeShipping,
        [field]: field === 'minAmount' ? (parseFloat(value) || 0) : value
      }
    }));
  };

  // COD Fee Handlers
  const updateCodFee = (field, value) => {
    setShippingSettings(prev => ({
      ...prev,
      codFee: {
        ...prev.codFee,
        [field]: field === 'fee' || field === 'percentage' ? (parseFloat(value) || 0) : value
      }
    }));
  };

  const renderShippingMethods = () => (
    <div>
      <h3 className="text-lg font-medium mb-4">วิธีการจัดส่ง</h3>
      
      {shippingSettings.methods.map((method) => (
        <div key={method.id} className="mb-6 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">วิธีการจัดส่ง #{shippingSettings.methods.indexOf(method) + 1}</h4>
            <button
              type="button"
              onClick={() => removeShippingMethod(method.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อวิธีการจัดส่ง <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={method.name}
                onChange={(e) => updateShippingMethod(method.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="เช่น จัดส่งมาตรฐาน, จัดส่งด่วน"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ค่าจัดส่ง (บาท) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={method.price}
                onChange={(e) => updateShippingMethod(method.id, 'price', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                step="1"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              คำอธิบาย
            </label>
            <textarea
              value={method.description}
              onChange={(e) => updateShippingMethod(method.id, 'description', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="รายละเอียดเกี่ยวกับวิธีการจัดส่ง"
              rows="2"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ระยะเวลาจัดส่งโดยประมาณ (วัน)
              </label>
              <input
                type="text"
                value={method.estimatedDays}
                onChange={(e) => updateShippingMethod(method.id, 'estimatedDays', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="เช่น 1-2, 3-5"
              />
            </div>
            
            <div className="mb-4 flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={method.isActive}
                  onChange={(e) => updateShippingMethod(method.id, 'isActive', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  เปิดใช้งาน
                </span>
              </label>
            </div>
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addShippingMethod}
        className="flex items-center text-blue-500 hover:text-blue-700"
      >
        <Plus size={16} className="mr-1" />
        เพิ่มวิธีการจัดส่ง
      </button>
    </div>
  );

  const renderFreeShipping = () => (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">จัดส่งฟรี</h3>
      
      <div className="p-4 border rounded-lg">
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={shippingSettings.freeShipping.enabled}
              onChange={(e) => updateFreeShipping('enabled', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              เปิดใช้งานการจัดส่งฟรี
            </span>
          </label>
        </div>
        
        {shippingSettings.freeShipping.enabled && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ยอดสั่งซื้อขั้นต่ำสำหรับจัดส่งฟรี (บาท)
            </label>
            <div className="flex items-center">
              <DollarSign size={20} className="text-gray-400 mr-2" />
              <input
                type="number"
                value={shippingSettings.freeShipping.minAmount}
                onChange={(e) => updateFreeShipping('minAmount', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                step="1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              กำหนด 0 หากต้องการให้จัดส่งฟรีทุกออเดอร์
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderWeightRates = () => (
    <div>
      <h3 className="text-lg font-medium mb-4">อัตราค่าจัดส่งตามน้ำหนัก</h3>
      
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border text-left">น้ำหนักเริ่มต้น (กก.)</th>
              <th className="py-2 px-4 border text-left">น้ำหนักสูงสุด (กก.)</th>
              <th className="py-2 px-4 border text-left">ค่าจัดส่ง (บาท)</th>
              <th className="py-2 px-4 border text-left">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {shippingSettings.weightRates.map((rate) => (
              <tr key={rate.id}>
                <td className="py-2 px-4 border">
                  <input
                    type="number"
                    value={rate.minWeight}
                    onChange={(e) => updateWeightRate(rate.id, 'minWeight', e.target.value)}
                    className="w-full px-3 py-1 border rounded-md"
                    min="0"
                    step="0.1"
                  />
                </td>
                <td className="py-2 px-4 border">
                  <input
                    type="number"
                    value={rate.maxWeight}
                    onChange={(e) => updateWeightRate(rate.id, 'maxWeight', e.target.value)}
                    className="w-full px-3 py-1 border rounded-md"
                    min="0"
                    step="0.1"
                  />
                </td>
                <td className="py-2 px-4 border">
                  <input
                    type="number"
                    value={rate.price}
                    onChange={(e) => updateWeightRate(rate.id, 'price', e.target.value)}
                    className="w-full px-3 py-1 border rounded-md"
                    min="0"
                    step="1"
                  />
                </td>
                <td className="py-2 px-4 border">
                  <button
                    type="button"
                    onClick={() => removeWeightRate(rate.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button
        type="button"
        onClick={addWeightRate}
        className="flex items-center text-blue-500 hover:text-blue-700"
      >
        <Plus size={16} className="mr-1" />
        เพิ่มอัตราค่าจัดส่ง
      </button>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle size={20} className="text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">คำแนะนำ</h3>
            <p className="text-sm text-blue-700 mt-1">
              ตั้งค่าอัตราค่าจัดส่งตามช่วงน้ำหนัก โดยกำหนดน้ำหนักเริ่มต้นและสูงสุดในแต่ละช่วง เช่น 0-0.5 กก., 0.5-1 กก. เป็นต้น
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegionalSettings = () => (
    <div>
      <h3 className="text-lg font-medium mb-4">ค่าจัดส่งตามภูมิภาค</h3>
      
      {shippingSettings.regions.map((region) => (
        <div key={region.id} className="mb-6 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">ภูมิภาค #{shippingSettings.regions.indexOf(region) + 1}</h4>
            <button
              type="button"
              onClick={() => removeRegion(region.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อภูมิภาค <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={region.name}
                onChange={(e) => updateRegion(region.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="เช่น กรุงเทพและปริมณฑล, ภาคเหนือ"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ค่าจัดส่งเพิ่มเติม (บาท)
              </label>
              <input
                type="number"
                value={region.additionalFee}
                onChange={(e) => updateRegion(region.id, 'additionalFee', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                step="1"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              จังหวัดในภูมิภาคนี้
            </label>
            <textarea
              value={region.provinces.join(', ')}
              onChange={(e) => updateRegion(region.id, 'provinces', e.target.value.split(',').map(p => p.trim()).filter(p => p))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="กรุงเทพมหานคร, นนทบุรี, ปทุมธานี (คั่นด้วยเครื่องหมายจุลภาค)"
              rows="3"
            />
            <p className="text-xs text-gray-500 mt-1">
              ระบุชื่อจังหวัดโดยคั่นด้วยเครื่องหมายจุลภาค (,)
            </p>
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addRegion}
        className="flex items-center text-blue-500 hover:text-blue-700"
      >
        <Plus size={16} className="mr-1" />
        เพิ่มภูมิภาค
      </button>
    </div>
  );

  const renderCodSettings = () => (
    <div>
      <h3 className="text-lg font-medium mb-4">เก็บเงินปลายทาง (COD)</h3>
      
      <div className="p-4 border rounded-lg">
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={shippingSettings.codFee.enabled}
              onChange={(e) => updateCodFee('enabled', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              เปิดใช้งานการเก็บเงินปลายทาง
            </span>
          </label>
        </div>
        
        {shippingSettings.codFee.enabled && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประเภทค่าธรรมเนียม
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="feeType"
                    value="fixed"
                    checked={shippingSettings.codFee.feeType === 'fixed'}
                    onChange={() => updateCodFee('feeType', 'fixed')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">จำนวนเงินคงที่</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="feeType"
                    value="percentage"
                    checked={shippingSettings.codFee.feeType === 'percentage'}
                    onChange={() => updateCodFee('feeType', 'percentage')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">เปอร์เซ็นต์ของยอดสั่งซื้อ</span>
                </label>
              </div>
            </div>
            
            {shippingSettings.codFee.feeType === 'fixed' ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ค่าธรรมเนียมคงที่ (บาท)
                </label>
                <input
                  type="number"
                  value={shippingSettings.codFee.fee}
                  onChange={(e) => updateCodFee('fee', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  min="0"
                  step="1"
                />
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ค่าธรรมเนียม (%)
                </label>
                <input
                  type="number"
                  value={shippingSettings.codFee.percentage}
                  onChange={(e) => updateCodFee('percentage', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'methods':
        return renderShippingMethods();
      case 'free':
        return renderFreeShipping();
      case 'weight':
        return renderWeightRates();
      case 'regions':
        return renderRegionalSettings();
      case 'cod':
        return renderCodSettings();
      default:
        return renderShippingMethods();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">ตั้งค่าการจัดส่ง</h2>
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
            className={`px-4 py-3 flex items-center ${activeTab === 'methods' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('methods')}
          >
            <Truck size={18} className="mr-2" />
            วิธีการจัดส่ง
          </button>
          <button
            className={`px-4 py-3 flex items-center ${activeTab === 'free' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('free')}
          >
            <Package size={18} className="mr-2" />
            จัดส่งฟรี
          </button>
          <button
            className={`px-4 py-3 flex items-center ${activeTab === 'weight' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('weight')}
          >
            <Package size={18} className="mr-2" />
            อัตราตามน้ำหนัก
          </button>
          <button
            className={`px-4 py-3 flex items-center ${activeTab === 'regions' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('regions')}
          >
            <Truck size={18} className="mr-2" />
            ภูมิภาค
          </button>
          <button
            className={`px-4 py-3 flex items-center ${activeTab === 'cod' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('cod')}
          >
            <DollarSign size={18} className="mr-2" />
            เก็บเงินปลายทาง
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

export default ShippingSettings;