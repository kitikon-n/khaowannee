import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // โหลด user จาก localStorage เมื่อเริ่มแอพ
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData) => {
    // ⚠️ ไม่เก็บ password
    const { password, ...userWithoutPassword } = userData;
    
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // ถ้ามี
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;