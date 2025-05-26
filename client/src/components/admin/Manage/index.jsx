import React, { useState } from "react";
import {
  Users,
  ShoppingCart,
  CreditCard,
  Gift,
  BarChart2,
  Settings,
  FileText,
  Image,
  Layout,
} from "lucide-react";

// Import components
import UserList from "./Users/UserList";
import OrderList from "./Orders/OrderList";
import PaymentList from "./Payments/PaymentList";
import CouponList from "./Promotions/CouponList";
import SalesReport from "./Reports/SalesReport";
import ProductStats from "./Reports/ProductStats";
import StoreSettings from "./Settings/StoreSettings";
import ShippingSettings from "./Settings/ShippingSettings";
import BannerManager from "./Content/BannerManager";
import StaticPages from "./Content/StaticPages";

const Manages = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [activeReportTab, setActiveReportTab] = useState("sales");
  const [activeSettingsTab, setActiveSettingsTab] = useState("store");
  const [activeContentTab, setActiveContentTab] = useState("banners");

  const tabs = [
    { id: "users", label: "ผู้ใช้งาน", icon: <Users size={18} /> },
    { id: "orders", label: "คำสั่งซื้อ", icon: <ShoppingCart size={18} /> },
    { id: "payments", label: "การชำระเงิน", icon: <CreditCard size={18} /> },
    { id: "promotions", label: "โปรโมชั่น", icon: <Gift size={18} /> },
    { id: "reports", label: "รายงาน", icon: <BarChart2 size={18} /> },
    { id: "settings", label: "ตั้งค่า", icon: <Settings size={18} /> },
    { id: "content", label: "เนื้อหา", icon: <FileText size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserList />;
      case "orders":
        return <OrderList />;
      case "payments":
        return <PaymentList />;
      case "promotions":
        return <CouponList />;
      case "reports":
        return (
          <div>
            <div className="mb-6 border-b">
              <button
                className={`px-4 py-2 mr-2 ${
                  activeReportTab === "sales"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveReportTab("sales")}
              >
                รายงานยอดขาย
              </button>
              <button
                className={`px-4 py-2 mr-2 ${
                  activeReportTab === "products"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveReportTab("products")}
              >
                สถิติสินค้า
              </button>
            </div>

            {activeReportTab === "sales" ? <SalesReport /> : <ProductStats />}
          </div>
        );
      case "settings":
        return (
          <div>
            <div className="mb-6 border-b">
              <button
                className={`px-4 py-2 mr-2 ${
                  activeSettingsTab === "store"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveSettingsTab("store")}
              >
                ข้อมูลร้านค้า
              </button>
              <button
                className={`px-4 py-2 mr-2 ${
                  activeSettingsTab === "shipping"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveSettingsTab("shipping")}
              >
                การจัดส่ง
              </button>
            </div>

            {activeSettingsTab === "store" ? (
              <StoreSettings />
            ) : (
              <ShippingSettings />
            )}
          </div>
        );
      case "content":
        return (
          <div>
            <div className="mb-6 border-b">
              <button
                className={`px-4 py-2 mr-2 flex items-center ${
                  activeContentTab === 'banners'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveContentTab('banners')}
              >
                <Image size={18} className="mr-2" />
                แบนเนอร์
              </button>
              <button
                className={`px-4 py-2 mr-2 flex items-center ${
                  activeContentTab === 'pages'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveContentTab('pages')}
              >
                <Layout size={18} className="mr-2" />
                หน้าเว็บไซต์
              </button>
            </div>
            
            {activeContentTab === 'banners' ? <BannerManager /> : <StaticPages />}
          </div>
        );
      default:
        return <UserList />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">จัดการระบบ</h1>

      <div className="flex border-b mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2 mr-2 ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">{renderContent()}</div>
    </div>
  );
};

export default Manages;
