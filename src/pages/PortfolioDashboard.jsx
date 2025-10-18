import { useState } from 'react';
import PortfolioCard from '../components/portfolio/PortfolioCard';
import CreatePortfolioCard from '../components/portfolio/CreatePortfolioCard';
import CreatePortfolioModal from '../components/portfolio/CreatePortfolioModal';
import { showToast } from '../components/share/toast';
import { GRADIENT_BG } from '@/components/share/constants';
import PortfolioDetail from './PortfolioDetail';

export default function PortfolioDashboard() {
    const [portfolios, setPortfolios] = useState([
        {
            id: 1,
            name: 'My portfolio Mike',
            updatedAt: '1 minute ago',
            total_invested: -0.20,
            current_value: -0.20,
            profit_loss_percentage: -4.61,
            profit_loss: -88.37,
            holdings: 1
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);

    const handlePortfolioClick = (portfolioId) => {
        const portfolio = portfolios.find(p => p.id === portfolioId);
        setSelectedPortfolio(portfolio);
    };

    const handleCreatePortfolio = () => {
        setIsModalOpen(true);
    };

    const handleSubmitPortfolio = (formData) => {
        // Create new portfolio
        const newPortfolio = {
            // id: portfolios.length + 1,
            name: formData.name,
            updatedAt: 'just now',
            current_value: 0,
            profit_loss_percentage: 0,
            profit_loss: 0,
            holdings: 0,
            asset: formData.asset,
            total_invested: formData.total_invested,
            description: formData.description
        };

        setPortfolios([...portfolios, newPortfolio]);
        showToast.success(`Portfolio "${formData.name}" created!`);
    };

    const handleBackToDashboard = () => {
        setSelectedPortfolio(null);
    };

    // Show Portfolio Detail if selected
    if (selectedPortfolio) {
        return <PortfolioDetail portfolio={selectedPortfolio} onBack={handleBackToDashboard} />;
    }

    return (
        <>
            <div className="relative w-7xl rounded-sm bg-white m-0 sm:m-2 shadow-lg overflow-hidden p-5 sm:p-10 sm:min-h-[780px]">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Your Portfolios
                    </h1>
                    <p className="text-gray-600">
                        Manage and track your investment portfolios
                    </p>
                </div>

                {/* Portfolio Grid */}
                <div className="p-0 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] mt-5 sm:mt-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* Create New Portfolio Card */}
                    <CreatePortfolioCard onClick={handleCreatePortfolio} />
                    {/* Existing Portfolios */}
                    {portfolios.map((portfolio) => (
                        <PortfolioCard
                            key={portfolio.id}
                            portfolio={portfolio}
                            onClick={handlePortfolioClick}
                        />
                    ))}
                </div>
            </div>

            {/* Create Portfolio Modal */}
            <CreatePortfolioModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitPortfolio}
            />
        </>
    );
}