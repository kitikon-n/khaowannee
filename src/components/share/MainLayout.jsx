export default function MainLayout({ children }) {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute left-0 top-0 bottom-0 w-3/5 
                     bg-[#FDD2C9]">
                </div>
                <div
                    className="absolute top-0 right-0 w-3/5 h-full 
                       transform -translate-x-1/4 
                       bg-[#FDF9C7] origin-top-left skew-x-6">
                </div>
                <div
                    className="absolute top-0 right-0 w-1/3 h-full 
                       bg-[#E0C9FD] origin-top-left skew-x-6">
                </div>
            </div>
                {children}
        </div>
    );
}