import React, { useState, useEffect } from "react";
import { Edit, Trash2, UserPlus, Search } from "lucide-react";
import UserForm from "./UserForm";
import Swal from "sweetalert2";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // API call to get users would go here
      // const response = await getUsers();
      // setUsers(response.data);

      // Placeholder data for demonstration
      setUsers([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "admin",
          status: "active",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "customer",
          status: "active",
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob@example.com",
          role: "staff",
          status: "inactive",
        },
      ]);
    } catch (error) {
      console.error("Failed to load users:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบผู้ใช้นี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        // API call to delete user would go here
        // await deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
        Swal.fire("สำเร็จ", "ลบผู้ใช้เรียบร้อยแล้ว", "success");
      } catch (error) {
        console.error("Failed to delete user:", error);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบผู้ใช้ได้", "error");
      }
    }
  };

  const handleFormSubmit = (userData) => {
    if (editUser) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === editUser.id ? { ...user, ...userData } : user
        )
      );
    } else {
      // Add new user
      setUsers([...users, { id: Date.now(), ...userData }]);
    }
    setShowForm(false);
    setEditUser(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">จัดการผู้ใช้งาน</h2>
        <button
          onClick={() => {
            setEditUser(null);
            setShowForm(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <UserPlus size={18} className="mr-2" />
          เพิ่มผู้ใช้ใหม่
        </button>
      </div>

      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="ค้นหาผู้ใช้..."
          className="pl-10 pr-4 py-2 border rounded-md w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-4">กำลังโหลด...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">ชื่อผู้ใช้</th>
                <th className="py-2 px-4 border-b text-left">อีเมล</th>
                <th className="py-2 px-4 border-b text-left">บทบาท</th>
                <th className="py-2 px-4 border-b text-left">สถานะ</th>
                <th className="py-2 px-4 border-b text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "staff"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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
      )}

      {showForm && (
        <UserForm
          user={editUser}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserList;
