import React, { useState, useEffect } from 'react';
import { Save, Edit, Plus, Trash2, FileText, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const StaticPages = () => {
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      // In a real app, fetch from API
      // const response = await api.get('/pages');
      // setPages(response.data);
      
      // For demo, use mock data with delay
      setTimeout(() => {
        setPages([
          {
            id: 1,
            title: 'เกี่ยวกับเรา',
            slug: 'about-us',
            content: '<h2>เกี่ยวกับเรา</h2><p>เราเป็นร้านค้าออนไลน์ที่มุ่งมั่นจะมอบประสบการณ์การช้อปปิ้งที่ดีที่สุดให้กับลูกค้า</p><p>ก่อตั้งขึ้นในปี 2023 เราได้เติบโตอย่างรวดเร็วและกลายเป็นหนึ่งในร้านค้าออนไลน์ชั้นนำของประเทศไทย</p>'
          },
          {
            id: 2,
            title: 'นโยบายการจัดส่ง',
            slug: 'shipping-policy',
            content: '<h2>นโยบายการจัดส่ง</h2><p>เรามีบริการจัดส่งทั่วประเทศไทย</p><ul><li>จัดส่งฟรีเมื่อซื้อครบ 1,000 บาท</li><li>ส่งภายใน 1-3 วันทำการ</li></ul>'
          },
          {
            id: 3,
            title: 'นโยบายการคืนสินค้า',
            slug: 'return-policy',
            content: '<h2>นโยบายการคืนสินค้า</h2><p>คุณสามารถคืนสินค้าได้ภายใน 7 วันหลังจากได้รับสินค้า หากสินค้ามีปัญหาหรือชำรุด</p>'
          },
          {
            id: 4,
            title: 'คำถามที่พบบ่อย',
            slug: 'faq',
            content: '<h2>คำถามที่พบบ่อย</h2><p>รวบรวมคำถามที่ลูกค้าถามบ่อย</p>'
          }
        ]);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load pages:', error);
      setLoading(false);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลหน้าได้',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleSelectPage = (page) => {
    setSelectedPage(page);
    setPageTitle(page.title);
    setPageSlug(page.slug);
    setEditorContent(page.content);
    setIsEditing(true);
  };

  const handleAddNewPage = () => {
    setSelectedPage(null);
    setPageTitle('');
    setPageSlug('');
    setEditorContent('');
    setIsEditing(true);
  };

  const handleDeletePage = (id) => {
    Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณต้องการลบหน้านี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        // In a real app, call API to delete page
        // api.delete(`/pages/${id}`);
        
        // Update local state
        setPages(pages.filter(page => page.id !== id));
        
        // Reset editor if deleted page was selected
        if (selectedPage && selectedPage.id === id) {
          setSelectedPage(null);
          setPageTitle('');
          setPageSlug('');
          setEditorContent('');
          setIsEditing(false);
        }
        
        Swal.fire(
          'ลบแล้ว!',
          'หน้าถูกลบเรียบร้อยแล้ว',
          'success'
        );
      }
    });
  };

  const handleSavePage = async () => {
    // Validate
    if (!pageTitle.trim()) {
      Swal.fire({
        title: 'กรุณากรอกชื่อหน้า',
        icon: 'warning',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    if (!pageSlug.trim()) {
      Swal.fire({
        title: 'กรุณากรอก URL Slug',
        icon: 'warning',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    // Check if slug is already used (for new pages)
    if (!selectedPage && pages.some(page => page.slug === pageSlug.trim())) {
      Swal.fire({
        title: 'URL Slug นี้ถูกใช้งานแล้ว',
        text: 'กรุณาใช้ URL Slug อื่น',
        icon: 'warning',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    setLoading(true);
    try {
      if (selectedPage) {
        // Update existing page
        const updatedPage = {
          ...selectedPage,
          title: pageTitle,
          slug: pageSlug,
          content: editorContent
        };
        
        // In a real app, call API to update page
        // await api.put(`/pages/${selectedPage.id}`, updatedPage);
        
        // Update local state
        setPages(pages.map(page => 
          page.id === selectedPage.id ? updatedPage : page
        ));
      } else {
        // Create new page
        const newPage = {
          id: Date.now(),
          title: pageTitle,
          slug: pageSlug,
          content: editorContent
        };
        
        // In a real app, call API to create page
        // const response = await api.post('/pages', newPage);
        // const createdPage = response.data;
        
        // Update local state
        setPages([...pages, newPage]);
        setSelectedPage(newPage);
      }
      
      // For demo, simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      Swal.fire({
        title: 'บันทึกสำเร็จ',
        text: 'บันทึกหน้าเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });
    } catch (error) {
      console.error('Failed to save page:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกหน้าได้',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setPageTitle(title);
    
    // Auto-generate slug if not manually edited
    if (!selectedPage || selectedPage.slug === pageSlug) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setPageSlug(slug);
    }
  };

  // In a real app, you would use a rich text editor like CKEditor, TinyMCE, or Quill
  // Here we'll use a simple textarea for demo purposes
  const SimplifiedEditor = () => (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        เนื้อหา
      </label>
      <textarea
        value={editorContent}
        onChange={(e) => setEditorContent(e.target.value)}
        className="w-full px-3 py-2 border rounded-md font-mono"
        rows="15"
        placeholder="<p>เนื้อหาของหน้า...</p>"
      />
      <p className="text-xs text-gray-500 mt-1">
        ใช้ HTML tags เพื่อจัดรูปแบบเนื้อหา เช่น &lt;h1&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;
      </p>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">จัดการหน้าเว็บไซต์</h2>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSavePage}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Save size={18} className="mr-2" />
              บันทึกหน้า
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddNewPage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus size={18} className="mr-2" />
            เพิ่มหน้าใหม่
          </button>
        )}
      </div>

      {loading && pages.length === 0 ? (
        <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
      ) : isEditing ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อหน้า <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pageTitle}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="เช่น เกี่ยวกับเรา, นโยบายความเป็นส่วนตัว"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">/</span>
                <input
                  type="text"
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="about-us"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                URL ที่จะใช้เข้าถึงหน้านี้ เช่น /about-us (ใช้ตัวอักษรภาษาอังกฤษ, ตัวเลข และเครื่องหมาย - เท่านั้น)
              </p>
            </div>
          </div>
          
          <SimplifiedEditor />
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle size={20} className="text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">คำแนะนำ</h3>
                <p className="text-sm text-blue-700 mt-1">
                  หน้าสแตติกจะแสดงในเมนูด้านล่างของเว็บไซต์ เช่น เกี่ยวกับเรา, นโยบายความเป็นส่วนตัว, เงื่อนไขการใช้งาน
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อหน้า</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL Slug</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText size={18} className="text-gray-400 mr-2" />
                        <span className="font-medium">{page.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-gray-500">
                      /{page.slug}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleSelectPage(page)}
                        className="text-blue-500 hover:text-blue-700 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.id)}
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
        </div>
      )}
    </div>
  );
};

export default StaticPages;