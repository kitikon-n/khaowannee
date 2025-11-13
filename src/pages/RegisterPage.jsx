import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { showToast } from '../components/share/toast';
import { useAuth } from '../contexts/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'กรุณากรอก Username';
    if (!formData.email.trim()) {
      newErrors.email = 'กรุณากรอก Email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'รูปแบบ Email ไม่ถูกต้อง';
    }
    if (!formData.password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน';
    } else if (formData.password.length < 6) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateRegister();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(formData.username, formData.email, formData.password);

      if (result.success) {
        showToast.success('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        showToast.error(result.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
    } catch (error) {
      showToast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl font-bold text-center text-stone-800 dark:text-stone-100">
              สมัครสมาชิก
            </CardTitle>
            <CardDescription className="text-center text-stone-600 dark:text-stone-400">
              สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งาน
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-stone-500 dark:text-stone-400" />
                  <Input
                    type="text"
                    name="username"
                    placeholder="กรอก username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`pl-10 border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:border-amber-600 focus:ring-amber-600 ${
                      errors.username ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.username}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-500 dark:text-stone-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:border-amber-600 focus:ring-amber-600 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-500 dark:text-stone-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="กรอกรหัสผ่าน"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:border-amber-600 focus:ring-amber-600 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-500 dark:text-stone-400" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="ยืนยันรหัสผ่าน"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:border-amber-600 focus:ring-amber-600 ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-700 dark:hover:to-amber-800 text-white font-semibold py-6 shadow-md disabled:opacity-50"
              >
                {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  มีบัญชีอยู่แล้ว?{' '}
                  <Link
                    to="/login"
                    className="text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-semibold hover:underline"
                  >
                    เข้าสู่ระบบ
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;