export const validation = {
    username: (value) => {
        if (!value) return 'กรุณากรอกชื่อผู้ใช้';
        if (value.length < 3) return 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร';
        if (value.length > 20) return 'ชื่อผู้ใช้ต้องไม่เกิน 20 ตัวอักษร';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'ชื่อผู้ใช้ใช้ได้เฉพาะ a-z, 0-9 และ _';
        return '';
    },

    email: (value) => {
        if (!value) return 'กรุณากรอกอีเมล';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'รูปแบบอีเมลไม่ถูกต้อง';
        return '';
    },

    password: (value) => {
        if (!value) return 'กรุณากรอกรหัสผ่าน';
        if (value.length < 6) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
        if (value.length > 30) return 'รหัสผ่านต้องไม่เกิน 30 ตัวอักษร';
        return '';
    },

    confirmPassword: (password, confirmPassword) => {
        if (!confirmPassword) return 'กรุณายืนยันรหัสผ่าน';
        if (password !== confirmPassword) return 'รหัสผ่านไม่ตรงกัน';
        return '';
    }
};
