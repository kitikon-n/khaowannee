import { Button } from '@/components/ui/button';

export default function AuthLayout({ children, currentPage, onSwitchPage }) {
  return (
    <div className="relative w-full rounded-sm
                   bg-white max-w-md sm:mx-2 shadow-lg overflow-hidden">
      {/* Tab Header */}
      <div className="flex">
        <Button
          onClick={() => onSwitchPage('login')}
          variant="ghost"
          className={`flex-1 rounded-none py-6 font-semibold transition-all ${currentPage === 'login'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          เข้าสู่ระบบ
        </Button>
        <Button
          onClick={() => onSwitchPage('register')}
          variant="ghost"
          className={`flex-1 rounded-none py-6 font-semibold transition-all ${currentPage === 'register'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          ลงทะเบียน
        </Button>
      </div>
      {children}
    </div>
  );
}