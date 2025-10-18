import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

export default function InputField({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  showToggle, 
  onToggle, 
  showPassword,
  error 
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
        <Input
          type={showToggle ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          className={`pl-10 pr-12 ${error ? 'border-red-500' : ''}`}
          placeholder={placeholder}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}