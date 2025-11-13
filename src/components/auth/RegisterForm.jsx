// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import InputField from '../share/InputField';
// import { showToast } from '../share/toast';
// import { validation } from './validation';
// import { Button } from '@/components/ui/button';
// import { Lock, User, Mail } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';

// export default function RegisterForm({ onSuccess, onSwitchToLogin }) {
//   const navigate = useNavigate();
//   const { register } = useAuth();
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     confirmPassword: '',
//     email: ''
//   });
//   const [errors, setErrors] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const validateForm = () => {
//     const newErrors = {
//       username: validation.username(formData.username),
//       email: validation.email(formData.email),
//       password: validation.password(formData.password),
//       confirmPassword: validation.confirmPassword(formData.password, formData.confirmPassword)
//     };
//     setErrors(newErrors);
//     return Object.values(newErrors).every(error => !error);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const result = await register(formData.username, formData.email, formData.password);

//       if (result.success) {
//         showToast.success('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ');
//         setTimeout(() => {
//           if (onSwitchToLogin) {
//             onSwitchToLogin();
//           } else {
//             navigate('/login');
//           }
//         }, 2000);
//       } else {
//         showToast.error(result.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
//       }
//     } catch (error) {
//       showToast.error('เกิดข้อผิดพลาดในการลงทะเบียน');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 space-y-6">
//       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//         สร้างบัญชีใหม่
//       </h2>

//       <InputField
//         label="ชื่อผู้ใช้"
//         type="text"
//         value={formData.username}
//         onChange={(e) => {
//           setFormData({ ...formData, username: e.target.value });
//           setErrors({ ...errors, username: '' });
//         }}
//         placeholder="กรอกชื่อผู้ใช้"
//         icon={User}
//         error={errors.username}
//       />

//       <InputField
//         label="อีเมล"
//         type="email"
//         value={formData.email}
//         onChange={(e) => {
//           setFormData({ ...formData, email: e.target.value });
//           setErrors({ ...errors, email: '' });
//         }}
//         placeholder="กรอกอีเมล"
//         icon={Mail}
//         error={errors.email}
//       />

//       <InputField
//         label="รหัสผ่าน"
//         type="password"
//         value={formData.password}
//         onChange={(e) => {
//           setFormData({ ...formData, password: e.target.value });
//           setErrors({ ...errors, password: '' });
//         }}
//         placeholder="กรอกรหัสผ่าน"
//         icon={Lock}
//         showToggle={true}
//         showPassword={showPassword}
//         onToggle={() => setShowPassword(!showPassword)}
//         error={errors.password}
//       />

//       <InputField
//         label="ยืนยันรหัสผ่าน"
//         type="password"
//         value={formData.confirmPassword}
//         onChange={(e) => {
//           setFormData({ ...formData, confirmPassword: e.target.value });
//           setErrors({ ...errors, confirmPassword: '' });
//         }}
//         placeholder="ยืนยันรหัสผ่าน"
//         icon={Lock}
//         showToggle={true}
//         showPassword={showConfirmPassword}
//         onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
//         error={errors.confirmPassword}
//       />

//       <Button
//         onClick={handleSubmit}
//         disabled={loading}
//         className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
//       >
//         {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
//       </Button>
//     </div>
//   );
// }