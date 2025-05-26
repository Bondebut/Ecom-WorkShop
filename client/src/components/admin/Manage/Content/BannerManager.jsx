import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Plus, MoveUp, MoveDown, AlertCircle, Link, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';

const BannerManager = () => {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      // In a real app, fetch from API
      // const response = await api.get('/banners');
      // setBanners(response.data);
      
      // For demo, use mock data with delay
      setTimeout(() => {
        setBanners([
          {
            id: 1,
            title: 'โปรโมชั่นส่งท้ายปี',
            image: 'https://placehold.co/1200x400/3B82F6/FFFFFF?text=BANNER+1',
            link: '/promotion',
            active: true,
            position: 1
          },
          {
            id: 2,
            title: 'สินค้าใหม่',
            image: 'https://placehold.co/1200x400/10B981/FFFFFF?text=BANNER+2',
            link: '/new-arrivals',
            active: true,
            position: 2
          },
          {
            id: 3,
            title: 'รับส่วนลด 20%',
            image: 'https://placehold.co/1200x400/EF4444/FFFFFF?text=BANNER+3',
            link: '/discount',
            active: false,
            position: 3
          }
        ]);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load banners:', error);
      setLoading(false);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลแบนเนอร์ได้',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleAddBanner = () => {
    const newBanner = {
      id: Date.now(),
      title: '',
      image: '',
      link: '',
      active: true,
      position: banners.length > 0 ? Math.max(...banners.map(b => b.position)) + 1 : 1
    };
    
    setBanners([...banners, newBanner]);
  };

  const handleDeleteBanner = (id) => {
    Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณต้องการลบแบนเนอร์นี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        // In a real app, call API to delete banner
        // api.delete(`/banners/${id}`);
        
        // Update local state
        setBanners(banners.filter(banner => banner.id !== id));
        
        Swal.fire(
          'ลบแล้ว!',
          'แบนเนอร์ถูกลบเรียบร้อยแล้ว',
          'success'
        );
      }
    });
  };

  const handleBannerChange = (id, field, value) => {
    setBanners(banners.map(banner => 
      banner.id === id ? { ...banner, [field]: value } : banner
    ));
  };

  const handleImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
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
        text: 'กรุณาอัปโหลดไฟล์ขนาดไม่เกิน 5MB',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    // In a real app, upload to server and get URL
    // For demo, create object URL
    const imageUrl = URL.createObjectURL(file);
    
    // Update banner
    handleBannerChange(id, 'image', imageUrl);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    
    const newBanners = [...banners];
    
    // Swap positions
    const temp = newBanners[index].position;
    newBanners[index].position = newBanners[index - 1].position;
    newBanners[index - 1].position = temp;
    
    // Sort by position
    newBanners.sort((a, b) => a.position - b.position);
    
    setBanners(newBanners);
  };

  const handleMoveDown = (index) => {
    if (index === banners.length - 1) return;
    
    const newBanners = [...banners];
    
    // Swap positions
    const temp = newBanners[index].position;
    newBanners[index].position = newBanners[index + 1].position;
    newBanners[index + 1].position = temp;
    
    // Sort by position
    newBanners.sort((a, b) => a.position - b.position);
    
    setBanners(newBanners);
  };

  const handleSaveBanners = async () => {
    // Validate banners
    const invalidBanners = banners.filter(banner => !banner.title || !banner.image);
    if (invalidBanners.length > 0) {
      Swal.fire({
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกชื่อและอัปโหลดรูปภาพให้ครบทุกแบนเนอร์',
        icon: 'warning',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    setLoading(true);
    try {
      // In a real app, send to API
      // await api.post('/banners', banners);
      
      // For demo, simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      Swal.fire({
        title: 'บันทึกสำเร็จ',
        text: 'บันทึกแบนเนอร์เรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });
    } catch (error) {
      console.error('Failed to save banners:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกแบนเนอร์ได้',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  // Sort banners by position
  const sortedBanners = [...banners].sort((a, b) => a.position - b.position);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">จัดการแบนเนอร์</h2>
        <button
          onClick={handleSaveBanners}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          บันทึกแบนเนอร์
        </button>
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle size={20} className="text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">คำแนะนำ</h3>
            <p className="text-sm text-blue-700 mt-1">
              แบนเนอร์จะแสดงในหน้าแรกของเว็บไซต์ แนะนำให้ใช้รูปภาพขนาด 1200x400 พิกเซล
              หรือในอัตราส่วน 3:1 เพื่อการแสดงผลที่เหมาะสม
            </p>
          </div>
        </div>
      </div>

      {loading && banners.length === 0 ? (
        <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
      ) : (
        <div className="space-y-6">
          {sortedBanners.map((banner, index) => (
            <div key={banner.id} className="bg-white rounded-lg shadow p-4 border">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">แบนเนอร์ #{index + 1}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <MoveUp size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === sortedBanners.length - 1}
                    className={`p-1 rounded ${index === sortedBanners.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <MoveDown size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-1 rounded text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อแบนเนอร์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={banner.title}
                      onChange={(e) => handleBannerChange(banner.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="ชื่อแบนเนอร์"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Link size={16} className="mr-1" />
                      ลิงก์ปลายทาง
                    </label>
                    <input
                      type="text"
                      value={banner.link}
                      onChange={(e) => handleBannerChange(banner.id, 'link', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="URL ที่ต้องการให้กดไปยัง เช่น /promotion"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={banner.active}
                        onChange={(e) => handleBannerChange(banner.id, 'active', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        เปิดใช้งาน
                      </span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <ImageIcon size={16} className="mr-1" />
                    รูปภาพแบนเนอร์ <span className="text-red-500">*</span>
                  </label>
                  
                  {banner.image ? (
                    <div className="mb-3 relative">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-auto rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => handleBannerChange(banner.id, 'image', '')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-lg bg-gray-50 mb-3">
                      <ImageIcon size={48} className="text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">ยังไม่มีรูปภาพ</p>
                      
                      <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
                        <Upload size={18} className="mr-2" />
                        อัปโหลดรูปภาพ
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(banner.id, e)}
                        />
                      </label>
                    </div>
                  )}
                  
                  {banner.image && (
                    <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer w-full justify-center">
                      <Upload size={18} className="mr-2" />
                      เปลี่ยนรูปภาพ
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(banner.id, e)}
                      />
                    </label>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    แนะนำขนาด 1200x400 พิกเซล (รองรับไฟล์ JPEG, PNG, WEBP ขนาดไม่เกิน 5MB)
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddBanner}
            className="flex items-center justify-center w-full py-3 border-2 border-dashed rounded-lg bg-gray-50 text-blue-500 hover:bg-blue-50 hover:border-blue-300"
          >
            <Plus size={20} className="mr-2" />
            เพิ่มแบนเนอร์ใหม่
          </button>
        </div>
      )}
    </div>
  );
};

export default BannerManager;