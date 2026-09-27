import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExperienceProvider, useExperience } from './context/ExperienceContext';
import { LocationProvider } from './context/LocationContext';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Product, Group } from './types';

// UI Components
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { NavDrawer } from './components/common/NavDrawer';
import { Footer } from './components/common/Footer';
import { LocationModal } from './components/common/LocationModal';
import { AuthModal } from './components/common/AuthModal';
import { MobileSearchModal } from './components/common/MobileSearchModal';
import { HeroSection } from './components/landing/HeroSection';
import { HowItWorks } from './components/landing/HowItWorks';
import { WomenEditorialBoutiques } from './components/landing/WomenEditorialBoutiques';
import { WomenEditorialPromotion } from './components/landing/WomenEditorialPromotion';
import { ProductGrid } from './components/product/ProductGrid';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { WishlistDrawer } from './components/product/WishlistDrawer';
import { PaymentModal } from './components/group/PaymentModal';
import { GroupDetailView } from './components/group/GroupDetailView';
import { MyGroupsView } from './components/group/MyGroupsView';

// Legal Pages
import { HowItWorksPage } from './components/legal/HowItWorksPage';
import { TermsPage } from './components/legal/TermsPage';
import { PrivacyPage } from './components/legal/PrivacyPage';
import { DisclaimerPage } from './components/legal/DisclaimerPage';
import { ReportPage } from './components/legal/ReportPage';

// Dashboards
import { StoreDashboard } from './components/store/StoreDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { InstallPWA } from './components/pwa/InstallPWA';

const MainAppContent: React.FC = () => {
  const { role, user } = useAuth();
  const { createGroup, joinGroup } = usePlatform();
  const { theme, gender } = useExperience();

  // Dynamic SEO, AEO & GEO Title/Meta updating per section & role
  React.useEffect(() => {
    let title = "BrandTogether (SplitCart) — Branded Fashion Group Buying";
    let metaDesc = "Discover verified local clothing offers & in-store deals for Men's, Women's & Children's fashion.";

    if (role === 'STORE') {
      title = "Store Dashboard — BrandTogether Retail Partner Portal";
      metaDesc = "Manage your store offers, hide/show active deals, track customer group visit notifications in real time.";
    } else if (role === 'ADMIN') {
      title = "Admin Operations Portal — BrandTogether Platform Moderation";
      metaDesc = "Moderate store applications, approve brands, run rotating header banner ads, and review platform feedback tickers.";
    } else if (gender === 'mens' || gender === 'men') {
      title = "Men's Branded Fashion Offers — BrandTogether Group Buying";
      metaDesc = "Buy Men's branded clothing together. Save on Levi's, Zara, Allen Solly, Raymond & Nike at nearby stores in Bhubaneswar.";
    } else if (gender === 'womens' || gender === 'women') {
      title = "Women's Fashion Editorial & Local Deals — BrandTogether";
      metaDesc = "Discover Women's ethnic & western clothing deals. Form local shopping groups for Biba, W, Zara & FabIndia.";
    } else if (gender === 'children' || gender === 'kids') {
      title = "Children's Clothing & Kids Brand Offers — BrandTogether";
      metaDesc = "Shop Kids fashion together. Explore local store offers on Mothercare, FirstCry, Hopscotch & Gini & Jony.";
    }

    document.title = title;
    const metaTag = document.querySelector('meta[name="description"]');
    if (metaTag) {
      metaTag.setAttribute('content', metaDesc);
    }
  }, [gender, role]);

  // Navigation & View state
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'explore' | 'wishlist' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Legal routes
  const [activeLegalRoute, setActiveLegalRoute] = useState<
    null | 'how-it-works' | 'terms' | 'privacy' | 'disclaimer' | 'report'
  >(null);

  // My Groups View
  const [isMyGroupsOpen, setIsMyGroupsOpen] = useState(false);

  // Selected Item states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeGroupView, setActiveGroupView] = useState<Group | null>(null);

  // Modals & Drawer state
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'user' | 'store' | 'admin'>('user');

  // Payment modal state
  const [paymentModalState, setPaymentModalState] = useState<{
    isOpen: boolean;
    type: 'CREATE' | 'JOIN';
    title: string;
    product?: Product;
    group?: Group;
  }>({
    isOpen: false,
    type: 'CREATE',
    title: '',
  });

  const resetAllViews = () => {
    setActiveLegalRoute(null);
    setIsMyGroupsOpen(false);
    setActiveGroupView(null);
    setSelectedProduct(null);
    setActiveNavTab('home');
  };

  // Handle trigger create group
  const handleTriggerCreateGroup = (product: Product) => {
    setSelectedProduct(null);
    setPaymentModalState({
      isOpen: true,
      type: 'CREATE',
      title: product.name,
      product,
    });
  };

  // Handle trigger join group
  const handleTriggerJoinGroup = (group: Group) => {
    setSelectedProduct(null);
    setPaymentModalState({
      isOpen: true,
      type: 'JOIN',
      title: group.productName,
      group,
    });
  };

  // Payment confirmation callback
  const handlePaymentSuccess = async () => {
    if (paymentModalState.type === 'CREATE' && paymentModalState.product) {
      const newGroup = await createGroup(
        paymentModalState.product.id,
        user ? user.id : 'usr_curr_101',
        user ? user.name : 'Sumit Sharma',
        user?.email,
        user?.avatar
      );
      setActiveGroupView(newGroup);
    } else if (paymentModalState.type === 'JOIN' && paymentModalState.group) {
      await joinGroup(
        paymentModalState.group.id,
        user ? user.id : 'usr_curr_101',
        user ? user.name : 'Sumit Sharma',
        user?.email,
        user?.avatar
      );
      setActiveGroupView(paymentModalState.group);
    }
  };

  // Render Store Portal if logged in as STORE
  if (role === 'STORE') {
    return (
      <div className={`min-h-screen ${theme.colors.bgPage} max-w-full overflow-x-hidden pt-16`}>
        <Header
          onOpenNavDrawer={() => setIsNavDrawerOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSearch={() => setIsMobileSearchOpen(true)}
          onNavigateWishlist={() => setIsWishlistDrawerOpen(true)}
          onGoHome={resetAllViews}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />
        <StoreDashboard />
        <Footer
          onOpenAdminLogin={() => {
            setAuthModalInitialTab('admin');
            setIsAuthModalOpen(true);
          }}
          onOpenStoreLogin={() => {
            setAuthModalInitialTab('store');
            setIsAuthModalOpen(true);
          }}
          onNavigateLegal={(r) => setActiveLegalRoute(r)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialTab={authModalInitialTab}
        />
      </div>
    );
  }

  // Render Admin Operations Panel if logged in as ADMIN
  if (role === 'ADMIN') {
    return (
      <div className={`min-h-screen ${theme.colors.bgPage} max-w-full overflow-x-hidden pt-16`}>
        <Header
          onOpenNavDrawer={() => setIsNavDrawerOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSearch={() => setIsMobileSearchOpen(true)}
          onNavigateWishlist={() => setIsWishlistDrawerOpen(true)}
          onGoHome={resetAllViews}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />
        <AdminDashboard />
        <Footer
          onOpenAdminLogin={() => {}}
          onOpenStoreLogin={() => {
            setAuthModalInitialTab('store');
            setIsAuthModalOpen(true);
          }}
          onNavigateLegal={(r) => setActiveLegalRoute(r)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialTab={authModalInitialTab}
        />
      </div>
    );
  }

  // Render Dedicated Legal Pages
  if (activeLegalRoute) {
    return (
      <div className={`min-h-screen ${theme.colors.bgPage} max-w-full overflow-x-hidden pt-16`}>
        <Header
          onOpenNavDrawer={() => setIsNavDrawerOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSearch={() => setIsMobileSearchOpen(true)}
          onNavigateWishlist={() => setIsWishlistDrawerOpen(true)}
          onGoHome={resetAllViews}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />
        {activeLegalRoute === 'how-it-works' && (
          <HowItWorksPage
            onBack={resetAllViews}
            onExplore={resetAllViews}
          />
        )}
        {activeLegalRoute === 'terms' && <TermsPage onBack={resetAllViews} />}
        {activeLegalRoute === 'privacy' && <PrivacyPage onBack={resetAllViews} />}
        {activeLegalRoute === 'disclaimer' && <DisclaimerPage onBack={resetAllViews} />}
        {activeLegalRoute === 'report' && <ReportPage onBack={resetAllViews} />}

        <Footer
          onOpenAdminLogin={() => {
            setAuthModalInitialTab('admin');
            setIsAuthModalOpen(true);
          }}
          onOpenStoreLogin={() => {
            setAuthModalInitialTab('store');
            setIsAuthModalOpen(true);
          }}
          onNavigateLegal={(r) => setActiveLegalRoute(r)}
        />

        <NavDrawer
          isOpen={isNavDrawerOpen}
          onClose={() => setIsNavDrawerOpen(false)}
          onOpenLocation={() => setIsLocationModalOpen(true)}
          onOpenWishlist={() => setIsWishlistDrawerOpen(true)}
          onOpenAuth={() => {
            setAuthModalInitialTab('user');
            setIsAuthModalOpen(true);
          }}
          onOpenMyGroups={() => setIsMyGroupsOpen(true)}
          onNavigateLegal={(r) => setActiveLegalRoute(r)}
          onGoHome={resetAllViews}
          onOpenExplore={() => {
            resetAllViews();
            const el = document.getElementById('discovery-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialTab={authModalInitialTab}
        />

        <WishlistDrawer
          isOpen={isWishlistDrawerOpen}
          onClose={() => setIsWishlistDrawerOpen(false)}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        <MobileSearchModal
          isOpen={isMobileSearchOpen}
          onClose={() => setIsMobileSearchOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />
      </div>
    );
  }

  // Render Personal My Groups View
  if (isMyGroupsOpen) {
    return (
      <div className={`min-h-screen ${theme.colors.bgPage} max-w-full overflow-x-hidden pt-16`}>
        <Header
          onOpenNavDrawer={() => setIsNavDrawerOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSearch={() => setIsMobileSearchOpen(true)}
          onNavigateWishlist={() => setIsWishlistDrawerOpen(true)}
          onGoHome={resetAllViews}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />
        <MyGroupsView
          onBack={resetAllViews}
          onSelectGroup={(g) => {
            setIsMyGroupsOpen(false);
            setActiveGroupView(g);
          }}
          onOpenAuth={() => {
            setAuthModalInitialTab('user');
            setIsAuthModalOpen(true);
          }}
        />
        <Footer
          onOpenAdminLogin={() => {
            setAuthModalInitialTab('admin');
            setIsAuthModalOpen(true);
          }}
          onOpenStoreLogin={() => {
            setAuthModalInitialTab('store');
            setIsAuthModalOpen(true);
          }}
          onNavigateLegal={(r) => setActiveLegalRoute(r)}
        />
        <NavDrawer
          isOpen={isNavDrawerOpen}
          onClose={() => setIsNavDrawerOpen(false)}
          onOpenLocation={() => setIsLocationModalOpen(true)}
          onOpenWishlist={() => setIsWishlistDrawerOpen(true)}
          onOpenAuth={() => {
            setAuthModalInitialTab('user');
            setIsAuthModalOpen(true);
          }}
          onOpenMyGroups={() => setIsMyGroupsOpen(true)}
          onNavigateLegal={(r) => setActiveLegalRoute(r)}
          onGoHome={resetAllViews}
          onOpenExplore={() => {
            resetAllViews();
            const el = document.getElementById('discovery-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialTab={authModalInitialTab}
        />
        <WishlistDrawer
          isOpen={isWishlistDrawerOpen}
          onClose={() => setIsWishlistDrawerOpen(false)}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        <MobileSearchModal
          isOpen={isMobileSearchOpen}
          onClose={() => setIsMobileSearchOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />
      </div>
    );
  }

  // Render Active Group Detail View
  if (activeGroupView) {
    return (
      <div className={`min-h-screen ${theme.colors.bgPage} max-w-full overflow-x-hidden pt-16`}>
        <Header
          onOpenNavDrawer={() => setIsNavDrawerOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSearch={() => setIsMobileSearchOpen(true)}
          onNavigateWishlist={() => setIsWishlistDrawerOpen(true)}
          onGoHome={resetAllViews}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />
        <GroupDetailView
          group={activeGroupView}
          onBack={resetAllViews}
        />
        <Footer
          onOpenAdminLogin={() => {
            setAuthModalInitialTab('admin');
            setIsAuthModalOpen(true);
          }}
          onOpenStoreLogin={() => {
            setAuthModalInitialTab('store');
            setIsAuthModalOpen(true);
          }}
          onNavigateLegal={(r) => setActiveLegalRoute(r)}
        />
        <NavDrawer
          isOpen={isNavDrawerOpen}
          onClose={() => setIsNavDrawerOpen(false)}
          onOpenLocation={() => setIsLocationModalOpen(true)}
          onOpenWishlist={() => setIsWishlistDrawerOpen(true)}
          onOpenAuth={() => {
            setAuthModalInitialTab('user');
            setIsAuthModalOpen(true);
          }}
          onOpenMyGroups={() => setIsMyGroupsOpen(true)}
          onNavigateLegal={(r) => setActiveLegalRoute(r)}
          onGoHome={resetAllViews}
          onOpenExplore={() => {
            resetAllViews();
            const el = document.getElementById('discovery-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialTab={authModalInitialTab}
        />
        <WishlistDrawer
          isOpen={isWishlistDrawerOpen}
          onClose={() => setIsWishlistDrawerOpen(false)}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        <MobileSearchModal
          isOpen={isMobileSearchOpen}
          onClose={() => setIsMobileSearchOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />
      </div>
    );
  }

  // Main Public Discovery View
  return (
    <div className={`min-h-screen flex flex-col justify-between ${theme.colors.bgPage} max-w-full overflow-x-hidden pt-16`}>
      <div>
        {/* Floating Glass Header */}
        <Header
          onOpenNavDrawer={() => setIsNavDrawerOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSearch={() => setIsMobileSearchOpen(true)}
          onNavigateWishlist={() => setIsWishlistDrawerOpen(true)}
          onGoHome={resetAllViews}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />

        {/* Hero & Journey section */}
        <HeroSection
          onExploreClick={() => {
            const el = document.getElementById('discovery-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenLocation={() => setIsLocationModalOpen(true)}
        />

        <HowItWorks />

        {/* Women-specific Editorial Discovery Sections */}
        {gender === 'women' && (
          <>
            <WomenEditorialBoutiques />
            <WomenEditorialPromotion
              onExploreClick={() => {
                const el = document.getElementById('discovery-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </>
        )}

        {/* Local Discovery Grid */}
        <div id="discovery-grid">
          <ProductGrid
            searchQuery={searchQuery}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer
        onOpenAdminLogin={() => {
          setAuthModalInitialTab('admin');
          setIsAuthModalOpen(true);
        }}
        onOpenStoreLogin={() => {
          setAuthModalInitialTab('store');
          setIsAuthModalOpen(true);
        }}
        onNavigateLegal={(r) => setActiveLegalRoute(r)}
      />

      {/* Navigation Drawer */}
      <NavDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        onOpenWishlist={() => setIsWishlistDrawerOpen(true)}
        onOpenAuth={() => {
          setAuthModalInitialTab('user');
          setIsAuthModalOpen(true);
        }}
        onOpenMyGroups={() => setIsMyGroupsOpen(true)}
        onNavigateLegal={(r) => setActiveLegalRoute(r)}
        onGoHome={resetAllViews}
        onOpenExplore={() => {
          resetAllViews();
          const el = document.getElementById('discovery-grid');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Mobile Bottom Navigation */}
      <Navigation
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        openWishlist={() => setIsWishlistDrawerOpen(true)}
        openAuth={() => {
          setAuthModalInitialTab('user');
          setIsAuthModalOpen(true);
        }}
        openExplore={() => {
          const el = document.getElementById('discovery-grid');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <WishlistDrawer
        isOpen={isWishlistDrawerOpen}
        onClose={() => setIsWishlistDrawerOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalInitialTab}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectGroup={(g) => setActiveGroupView(g)}
        onTriggerCreateGroup={handleTriggerCreateGroup}
        onTriggerJoinGroup={handleTriggerJoinGroup}
        onOpenAuthModal={() => {
          setAuthModalInitialTab('user');
          setIsAuthModalOpen(true);
        }}
      />

      <PaymentModal
        isOpen={paymentModalState.isOpen}
        onClose={() => setPaymentModalState((prev) => ({ ...prev, isOpen: false }))}
        type={paymentModalState.type}
        title={paymentModalState.title}
        onConfirmSuccess={handlePaymentSuccess}
        onNavigateLegal={(r) => setActiveLegalRoute(r)}
      />

      <MobileSearchModal
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />

      <InstallPWA />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ExperienceProvider>
        <LocationProvider>
          <PlatformProvider>
            <MainAppContent />
          </PlatformProvider>
        </LocationProvider>
      </ExperienceProvider>
    </AuthProvider>
  );
}

export default App;
