// import AuthLayout from './components/auth/AuthLayout';
// import LoginForm from './components/auth/LoginForm';
// import RegisterForm from './components/auth/RegisterForm';
// import { useState } from 'react';
// import { Toaster } from 'react-hot-toast';
// import PortfolioDashboard from './pages/PortfolioDashboard';
// import MainLayout from './components/share/MainLayout';
// import DayNightBackground from './components/share/DayNightBackground';

// export default function App() {
//   const [currentPage, setCurrentPage] = useState('login');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // const [message, setMessage] = useState({ text: '', type: '' });

//   const handleSwitchPage = (page) => {
//     setCurrentPage(page);
//     // setMessage({ text: '', type: '' });
//   };

//   const handleSuccess = (msg) => {
//     // setMessage({ text: msg, type: 'success' });
//     setIsAuthenticated(true);
//     setCurrentPage('dashboard');
//   };

//   const handleRegisterSuccess = () => {
//     showToast.success('ลงทะเบียนสำเร็จ!');
//     setTimeout(() => {
//       setCurrentPage('login');
//     }, 2000);
//   };

//   const handleError = (msg) => {
//     setMessage({ text: msg, type: 'error' });
//   };

//   // Show Dashboard if authenticated
//   if (isAuthenticated && currentPage === 'dashboard') {
//     return (
//       <DayNightBackground>
//         <PortfolioDashboard />
//       </DayNightBackground>
//     );
//   }

//   return (
//     // <MainLayout>
//     <DayNightBackground>
//       <AuthLayout
//         currentPage={currentPage}
//         onSwitchPage={handleSwitchPage}
//       >
//         {currentPage === 'login' ? (
//           <LoginForm onSuccess={handleSuccess} onError={handleError} />
//         ) : (
//           <RegisterForm
//             // onSuccess={handleRegisterSuccess}
//             onSwitchToLogin={() => handleSwitchPage('login')}
//           />
//         )}
//         <Toaster position="top-center" />
//       </AuthLayout>
//     </DayNightBackground>
//     // </MainLayout>
//   );
// }
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CryptoPortfolioDashboard from './pages/CryptoPortfolioDashboard';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import NewsPage from './pages/NewsPage';
import AuthProvider from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/portfolios" element={<CryptoPortfolioDashboard />} />
          <Route path="/portfolios/:id" element={<PortfolioDetailPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </AuthProvider>
  );
}
export default App;