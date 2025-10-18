import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function DayNightBackground({ children }) {
    const [isDark, setIsDark] = useState(false);

    return (
        <div className={`min-h-screen transition-all duration-1000 relative overflow-hidden ${isDark
            ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
            : 'bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200'
            }`}>

            {/* ดวงอาทิตย์/ดวงจันทร์ */}
            <div className={`absolute transition-all duration-1000 ${isDark ? 'top-20 right-20' : 'top-10 left-20'
                }`}>
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full transition-all duration-1000 ${isDark
                    ? 'bg-slate-200 shadow-[0_0_60px_rgba(226,232,240,0.5)]'
                    : 'bg-yellow-300 shadow-[0_0_80px_rgba(253,224,71,0.6)]'
                    }`}>
                    {isDark && (
                        <div className="absolute top-2 left-4 w-8 h-8 bg-slate-300 rounded-full opacity-30"></div>
                    )}
                </div>
            </div>

            {/* ดาวสำหรับกลางคืน */}
            {isDark && (
                <>
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full animate-pulse"
                            style={{
                                width: Math.random() * 3 + 1 + 'px',
                                height: Math.random() * 3 + 1 + 'px',
                                top: Math.random() * 80 + '%',
                                left: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 2 + 's',
                                animationDuration: Math.random() * 3 + 2 + 's'
                            }}
                        />
                    ))}
                </>
            )}

            {/* เมฆสำหรับกลางวัน */}
            {!isDark && (
                <>
                    <div className="absolute top-32 left-10 md:left-1/4 w-32 h-12 bg-white/40 rounded-full blur-sm animate-bounce" style={{ animationDuration: '6s' }}></div>
                    <div className="absolute top-48 right-20 md:right-1/3 w-40 h-14 bg-white/30 rounded-full blur-sm animate-bounce" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
                    <div className="absolute top-64 left-1/2 w-36 h-12 bg-white/35 rounded-full blur-sm animate-bounce" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
                </>
            )}

            {/* ปุ่มสลับโหมด */}
            <button
                onClick={() => setIsDark(!isDark)}
                className={`fixed top-6 right-6 z-50 p-4 rounded-full transition-all duration-300 shadow-lg hover:scale-110 cursor-pointer ${isDark
                    ? 'bg-slate-800 text-yellow-300 hover:bg-slate-700'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
            >
                {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            {/* เนื้อหาตัวอย่าง */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                {/* <div className={`text-center transition-all duration-700 ${isDark ? 'text-white' : 'text-slate-800'
                    }`}>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        {isDark ? '🌙 สวัสดีตอนกลางคืน' : '☀️ สวัสดีตอนกลางวัน'}
                    </h1>
                    <p className={`text-lg md:text-xl mb-8 ${isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                        กดปุ่มมุมขวาบนเพื่อสลับโหมด
                    </p>
                    <div className={`inline-block px-8 py-4 rounded-full transition-all duration-300 ${isDark
                            ? 'bg-purple-600 hover:bg-purple-500 text-white'
                            : 'bg-white hover:bg-blue-50 text-blue-600 shadow-lg'
                        }`}>
                        ปุ่มตัวอย่าง
                    </div>
                </div> */}
                {children}
            </div>
        </div>
    );
}