import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/share/toast';

function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateLogin = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = 'กรุณากรอก Username';
        if (!formData.password) newErrors.password = 'กรุณากรอกรหัสผ่าน';
        return newErrors;
    };

    const { login } = useAuth();

    const handleSubmit = async () => {
        const newErrors = validateLogin();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            // const response = await fetch('https://localhost:5001/api/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         username: formData.username,
            //         password: formData.password
            //     })
            // });

            const response = await authService.login(formData.username, formData.password);
            console.log(response);

            if (response?.user_id) {
                login(response); // เก็บข้อมูล user
                showToast.success('เข้าสู่ระบบสำเร็จ!');
                navigate('/portfolios'); // หรือหน้าที่ต้องการ
            } else {
                showToast.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }

            // const data = await response.json();

            // if (response.ok) {
            //     // เก็บ token ถ้ามี
            //     // localStorage.setItem('token', data.token);
            //     console.log('1111111111111111', data);


            // } else {
            //     setErrors({ submit: data.message || 'เข้าสู่ระบบไม่สำเร็จ' });
            // }
        } catch (error) {
            // setErrors({ submit: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
            showToast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        // TODO: นำทางไปหน้า forgot password
        showToast.error('ฟีเจอร์ลืมรหัสผ่านจะเปิดให้ใช้งานเร็วๆ นี้');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-3xl font-bold text-center text-stone-800 dark:text-stone-100">
                            เข้าสู่ระบบ
                        </CardTitle>
                        <CardDescription className="text-center text-stone-600 dark:text-stone-400">
                            กรอกข้อมูลเพื่อเข้าสู่ระบบ
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
                                        className={`pl-10 border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:border-amber-600 focus:ring-amber-600 ${errors.username ? 'border-red-500' : ''
                                            }`}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.username}</p>
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
                                        className={`pl-10 pr-10 border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:border-amber-600 focus:ring-amber-600 ${errors.password ? 'border-red-500' : ''
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

                            {/* Forgot Password Link */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-sm text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium hover:underline"
                                >
                                    ลืมรหัสผ่าน?
                                </button>
                            </div>

                            {/* Submit Button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-700 dark:hover:to-amber-800 text-white font-semibold py-6 shadow-md disabled:opacity-50"
                            >
                                {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                            </Button>

                            {/* Register Link */}
                            <div className="text-center pt-4">
                                <p className="text-sm text-stone-600 dark:text-stone-400">
                                    ยังไม่มีบัญชี?{' '}
                                    <Link
                                        to="/register"
                                        className="text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-semibold hover:underline"
                                    >
                                        สมัครสมาชิก
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

export default LoginPage;