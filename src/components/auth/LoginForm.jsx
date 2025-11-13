// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import InputField from '../share/InputField';
// import { showToast } from '../share/toast';
// import { validation } from './validation';
// import { Button } from '@/components/ui/button';
// import { Lock, User } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';

// export default function LoginForm({ onSuccess }) {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const [errors, setErrors] = useState({ username: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const validateForm = () => {
//     const newErrors = {
//       username: validation.username(formData.username),
//       password: validation.password(formData.password)
//     };
//     setErrors(newErrors);
//     return !newErrors.username && !newErrors.password;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const result = await login(formData.username, formData.password);

//       if (result.success) {
//         showToast.success('เข้าสู่ระบบสำเร็จ!');
//         if (onSuccess) {
//           onSuccess();
//         } else {
//           navigate('/portfolios');
//         }
//       } else {
//         showToast.error(result.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
//       }
//     } catch (error) {
//       showToast.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 space-y-6">
//       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//         ยินดีต้อนรับกลับมา
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

//       <Button
//         onClick={handleSubmit}
//         disabled={loading}
//         className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
//       >
//         {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
//       </Button>
//     </div>
//   );
// }