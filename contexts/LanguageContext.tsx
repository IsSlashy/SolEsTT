'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en'); // Default to English

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation object
const translations = {
  en: {
    // Header & Navigation
    nav: {
      properties: 'Properties',
      marketplace: 'Marketplace',
      rentals: 'Rentals',
      defi: 'DeFi',
      governance: 'Governance',
      portfolio: 'Portfolio',
      notifications: 'Notifications',
      badges: 'Badges',
    },

    // Home Page
    home: {
      title: 'SolEsTT',
      subtitle: 'Luxury Real Estate × Blockchain',
      partnership: 'In partnership with Junot',
      description: 'Tokenize premium properties, invest fractionally, and manage your rental income on Solana.',
      expertiseTag: '35 years of Junot expertise × The power of Solana',
      discoverBtn: 'Discover Properties',
      exploreBtn: 'Explore Market',

      whyJunot: 'Why Junot × Solana?',
      excellenceTitle: 'Excellence & Heritage',
      excellenceDesc: 'Since 1984, Junot has been a benchmark in luxury real estate in France and Belgium. Over 35 years of expertise in accompanying the most prestigious transactions.',
      innovationTitle: 'Blockchain Innovation',
      innovationDesc: 'Solana\'s speed (400ms) and ultra-low fees (€0.0003) democratize access to exceptional properties in Paris and Brussels.',

      feature1Title: 'Tokenized Properties',
      feature1Desc: 'Transform exceptional properties into NFTs on Solana. Transparent ownership with immutable ledger.',
      feature2Title: 'Fractional Investment',
      feature2Desc: 'Access premium Parisian properties from €100. Avenue Foch, Golden Triangle, and more.',
      feature3Title: 'Automated Rents',
      feature3Desc: 'Automatic collection in USDC. No intermediaries, instant settlement.',

      stats: {
        tvl: 'Total Value Locked',
        properties: 'Listed Properties',
        investors: 'Active Investors',
        fees: 'Avg Transaction Fee',
      },

      howItWorks: 'How It Works',
      step1Title: 'Connect Your Wallet',
      step1Desc: 'Link your Solana wallet to get started',
      step2Title: 'Browse Properties',
      step2Desc: 'Explore tokenized real estate opportunities',
      step3Title: 'Invest',
      step3Desc: 'Buy fractional shares with SOL or USDC',
      step4Title: 'Earn Income',
      step4Desc: 'Receive rental income directly to your wallet',

      readyTitle: 'Ready to Start?',
      readyDesc: 'Connect your wallet to explore the platform',

      footerBuilt: 'Built for',
      footerHackathon: 'Solana Colosseum Hackathon',
      footerPartnership: 'in partnership with',
      footerPowered: 'Powered by',
      footerExpertise: '35 years of Junot excellence',
    },

    // Properties Page
    properties: {
      title: 'Properties',
      subtitle: 'Discover tokenized luxury real estate',
      createBtn: 'List a Property',

      filters: {
        all: 'All Properties',
        available: 'Available',
        funded: 'Fully Funded',
      },

      card: {
        location: 'Location',
        totalValue: 'Total Value',
        sharePrice: 'Share Price',
        availableShares: 'Available Shares',
        roi: 'Annual ROI',
        funded: 'Funded',
        viewDetails: 'View Details',
        buyShares: 'Buy Shares',
      },

      detail: {
        overview: 'Overview',
        financials: 'Financials',
        documents: 'Documents',
        activity: 'Activity',

        propertyType: 'Property Type',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        squareFeet: 'Square Feet',
        yearBuilt: 'Year Built',

        totalValue: 'Total Value',
        totalShares: 'Total Shares',
        pricePerShare: 'Price per Share',
        availableShares: 'Available Shares',
        monthlyRent: 'Monthly Rent',
        annualRoi: 'Annual ROI',

        sharesToBuy: 'Shares to Buy',
        totalPrice: 'Total Price',
        buyNow: 'Buy Now',
        connectWallet: 'Connect Wallet to Invest',
      },

      create: {
        title: 'List a Property',
        subtitle: 'Tokenize your real estate on Solana',

        basicInfo: 'Basic Information',
        propertyName: 'Property Name',
        propertyNamePlaceholder: 'e.g., Luxury Apartment Paris 16th',
        location: 'Location',
        locationPlaceholder: 'e.g., 75016 Paris, France',
        description: 'Description',
        descriptionPlaceholder: 'Describe the property...',

        financialDetails: 'Financial Details',
        totalValue: 'Total Value (USD)',
        totalShares: 'Total Shares',
        monthlyRent: 'Monthly Rent (USD)',
        pricePerShare: 'Price per share',
        yieldPerShare: 'Monthly yield per share',

        propertyDetails: 'Property Details',
        propertyType: 'Property Type',
        apartment: 'Apartment',
        house: 'House',
        condo: 'Condo',
        commercial: 'Commercial',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        squareFeet: 'Square Feet',
        yearBuilt: 'Year Built',

        media: 'Property Media',
        mediaDesc: 'Upload photos and 3D models of your property',
        photos: 'Property Photos',
        model3d: '3D Model (Optional)',
        modelPreview: '3D Model Preview',
        interactivePreview: 'Interactive preview - Use mouse to rotate and zoom',

        cancel: 'Cancel',
        create: 'Create Property',
        creating: 'Creating Property...',
      },
    },

    // Marketplace
    marketplace: {
      title: 'Secondary Market',
      subtitle: 'Trade property shares on the secondary market',

      stats: {
        volume24h: '24h Volume',
        activeListings: 'Active Listings',
        avgChange: 'Avg. Change',
        totalTrades: 'Total Trades',
        properties: 'properties',
        last7Days: 'Last 7 days',
        thisMonth: 'This month',
      },

      filters: {
        bestROI: 'Best ROI',
        lowestPrice: 'Lowest Price',
        mostFunded: 'Most Funded',
      },

      listing: {
        seller: 'Seller',
        roi: 'ROI',
        location: 'Location',
        sharesAvailable: 'Shares Available',
        pricePerShare: 'Price per Share',
        totalValue: 'Total Value',
        buyNow: 'Buy Now',
      },

      demoNotice: 'Demo Mode - Marketplace data is simulated. Real trading will be available once blockchain integration is complete.',
    },

    // Rentals
    rentals: {
      title: 'Rental Payments',
      subtitle: 'Automated rent collection via USDC on Solana',

      stats: {
        asTenant: 'As Tenant',
        asLandlord: 'As Landlord',
        totalCollected: 'Total Collected',
        rentalAgreements: 'rental agreements',
        totalRevenue: 'total revenue',
      },

      tabs: {
        tenant: 'Tenant',
        landlord: 'Landlord',
      },

      agreement: {
        landlord: 'Landlord',
        tenant: 'Tenant',
        active: 'ACTIVE',
        monthlyRent: 'Monthly Rent',
        nextPayment: 'Next Payment',
        lastPayment: 'Last Payment',
        totalPayments: 'Total Payments',
        days: 'days',
        overdue: 'OVERDUE',
        payRent: 'Pay Rent in USDC',
        payOverdue: 'Pay Now (OVERDUE)',
        dueIn: 'Payment due in',
        viewDetails: 'View Details',
      },

      modal: {
        title: 'Rental Agreement Details',
        propertyInfo: 'Property Info',
        terms: 'Agreement Terms',
        monthlyRent: 'Monthly Rent',
        paymentFrequency: 'Payment Frequency',
        agreementStatus: 'Agreement Status',
        totalPayments: 'Total Payments Made',
        paymentSchedule: 'Payment Schedule',
        lastPayment: 'Last Payment',
        nextDue: 'Next Payment Due',
        daysUntil: 'Days Until Due',
        paymentHistory: 'Payment History',
        paymentNum: 'Payment #',
        amount: 'Amount',
        date: 'Date',
        status: 'Status',
        paid: 'PAID',
        financialSummary: 'Financial Summary',
        totalPaid: 'Total Paid/Collected',
        avgMonthly: 'Average Monthly',
        payWithUSDC: 'Pay Rent with USDC',
        terminate: 'Terminate Agreement',
        close: 'Close',
      },

      landlordView: {
        activeAgreements: 'Active Rental Agreements',
        incomeHistory: 'Income History',
        property: 'Property',
        tenant: 'Tenant',
        amount: 'Amount',
        date: 'Date',
        status: 'Status',
        received: 'Received',
        nextExpected: 'Next Payment Expected',
        lastReceived: 'Last Received',
        totalCollected: 'Total Collected',
      },

      noRentals: 'No Active Rentals',
      noRentalsDesc: 'You are not currently renting any properties',

      demoNotice: 'Demo Mode - Rental data is simulated. Real USDC payments will be automated once blockchain integration is complete.',
    },

    // DeFi
    defi: {
      title: 'DeFi Hub',
      subtitle: 'Mortgages, Collateral, and Staking',

      loyaltyStats: {
        tier: 'Loyalty Tier',
        points: 'Points',
        stakedTokens: 'Staked Tokens',
        totalRewards: 'Total Rewards',
      },

      tabs: {
        mortgages: 'Mortgages',
        collateral: 'Collateral',
        staking: 'Staking',
      },

      mortgage: {
        applyTitle: 'Apply for Mortgage',
        propertyAddress: 'Property Address',
        propertyAddressPlaceholder: 'Enter property address',
        loanAmount: 'Loan Amount (USDC)',
        loanAmountPlaceholder: '50000',
        term: 'Loan Term',
        years10: '10 years (120 months)',
        years15: '15 years (180 months)',
        years20: '20 years (240 months)',
        years30: '30 years (360 months)',
        collateralTokens: 'Collateral Tokens',
        collateralTokensPlaceholder: '1000',
        apply: 'Apply',
        processing: 'Processing...',

        yourMortgages: 'Your Mortgages',
        noMortgages: 'No mortgages yet',
        loanAmount: 'Loan Amount',
        monthlyPayment: 'Monthly Payment',
        interestRate: 'Interest Rate',
        status: 'Status',
        active: 'ACTIVE',
        pending: 'PENDING',
      },

      collateral: {
        lockTitle: 'Lock Collateral',
        propertyAddress: 'Property Address',
        tokensToLock: 'Tokens to Lock',
        tokensToLockPlaceholder: '100',
        collateralValue: 'Collateral value',
        borrowAmount: 'Borrow Amount (USDC)',
        borrowAmountPlaceholder: '5000',
        maxBorrow: 'Max borrow (60% LTV)',
        lockCollateral: 'Lock Collateral',
        processing: 'Processing...',

        yourPositions: 'Your Positions',
        noPositions: 'No positions yet',
        lockedTokens: 'Locked Tokens',
        borrowed: 'Borrowed',
        healthFactor: 'Health Factor',
        status: 'Status',
        active: 'ACTIVE',
      },

      staking: {
        stakeTitle: 'Stake Tokens',
        propertyAddress: 'Property Address',
        tokensToStake: 'Tokens to Stake',
        tokensToStakePlaceholder: '100',
        apy: 'APY',
        stake: 'Stake',
        processing: 'Processing...',

        yourStaking: 'Your Staking',
        noStaking: 'No staking positions yet',
        staked: 'Staked',
        rewards: 'Rewards',
        claimRewards: 'Claim Rewards',
        tokens: 'tokens',
      },

      connectWallet: 'Connect Your Wallet',
      connectDesc: 'Connect your wallet to access DeFi features',
    },

    // Governance
    governance: {
      title: 'Governance',
      subtitle: 'Vote on real estate decisions and proposals',
      createProposal: 'Create Proposal',

      stats: {
        totalProposals: 'Total Proposals',
        activeVotes: 'Active Votes',
        passed: 'Passed',
        votingPower: 'Your Voting Power',
      },

      noProposals: 'No proposals yet',
      createFirst: 'Create the First Proposal',

      proposal: {
        proposedBy: 'Proposed by',
        votesFor: 'For',
        votesAgainst: 'Against',
        voteFor: 'Vote For',
        voteAgainst: 'Vote Against',
        endsOn: 'Ends on',
        active: 'ACTIVE',
        passed: 'PASSED',
        rejected: 'REJECTED',
        executed: 'EXECUTED',
      },

      createModal: {
        title: 'Create a Proposal',
        propertyAddress: 'Property Address',
        propertyAddressPlaceholder: 'Enter property address',
        titleLabel: 'Title',
        titlePlaceholder: 'Proposal title',
        description: 'Description',
        descriptionPlaceholder: 'Describe the proposal...',
        cancel: 'Cancel',
        create: 'Create Proposal',
        creating: 'Creating...',
      },

      connectWallet: 'Connect Your Wallet',
      connectDesc: 'Connect your wallet to participate in governance',
    },

    // Portfolio
    portfolio: {
      title: 'My Portfolio',
      subtitle: 'Track your real estate investments',

      overview: 'Portfolio Overview',
      totalValue: 'Total Value',
      totalProperties: 'Properties',
      totalShares: 'Total Shares',
      avgROI: 'Avg. ROI',
      monthlyIncome: 'Monthly Income',

      myInvestments: 'My Investments',
      noInvestments: 'No investments yet',
      noInvestmentsDesc: 'Start investing in tokenized properties to build your portfolio',
      browseProperties: 'Browse Properties',

      investment: {
        sharesOwned: 'Shares Owned',
        totalInvested: 'Total Invested',
        currentValue: 'Current Value',
        monthlyIncome: 'Monthly Income',
        roi: 'ROI',
        viewProperty: 'View Property',
      },

      connectWallet: 'Connect Your Wallet',
      connectDesc: 'Connect your wallet to view your portfolio',
    },

    // Notifications
    notifications: {
      title: 'Notifications',
      subtitle: 'Stay updated with your investments',
      markAllRead: 'Mark All as Read',

      filters: {
        all: 'All',
        unread: 'Unread',
        payments: 'Payments',
        investments: 'Investments',
        governance: 'Governance',
      },

      noNotifications: 'No notifications',
      noNotificationsDesc: 'You\'re all caught up!',

      types: {
        payment: 'Payment Received',
        investment: 'Investment Update',
        governance: 'Governance Vote',
        property: 'Property Update',
      },

      connectWallet: 'Connect Your Wallet',
      connectDesc: 'Connect your wallet to view notifications',
    },

    // Badges
    badges: {
      title: 'Achievement Badges',
      subtitle: 'Collect badges as you use the platform',

      earned: 'Earned',
      locked: 'Locked',

      noEarned: 'No badges earned yet',
      noEarnedDesc: 'Start investing and using the platform to earn badges',

      connectWallet: 'Connect Your Wallet',
      connectDesc: 'Connect your wallet to view your badges',
    },

    // Compare Page
    compare: {
      title: 'Property Comparison',
      subtitle: 'Select up to 3 properties to compare side by side',

      selectedProperties: 'Selected properties',
      selectBelow: 'Select properties below',
      selectAtLeast2: 'Select at least 2 properties to compare',
      comparisonReady: 'Comparison ready!',
      reset: 'Reset',

      selectProperties: 'Select Properties',
      hide: 'Hide',
      show: 'Show',

      comparisonTable: 'Comparison Table',
      criteria: 'Criteria',
      image: 'Image',
      location: 'Location',
      totalValue: 'Total Value',
      annualROI: 'Annual ROI',
      monthlyRent: 'Monthly Rent',
      annualYield: 'Annual Yield',
      totalShares: 'Total Shares',
      availableShares: 'Available Shares',
      pricePerShare: 'Price per Share',
      funding: 'Funding',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      surface: 'Surface',
      pricePerSqm: 'Price / m²',
      yearBuilt: 'Year Built',
      actions: 'Actions',
      viewDetails: 'View Details',

      badges: {
        lowestPrice: '🏆 Lowest price',
        bestROI: '🏆 Best ROI',
        highestYield: '🏆 Highest yield',
        lowestPricePerSqm: '🏆 Lowest price/m²',
      },

      emptyState: {
        title: 'Start Comparison',
        description: 'Select at least 2 properties to see the comparison table',
      },

      maxProperties: 'You can only compare 3 properties maximum',
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      connectWallet: 'Connect Wallet',
      disconnectWallet: 'Disconnect',
      comingSoon: 'Coming Soon',
      demoMode: 'Demo Mode',
    },
  },

  fr: {
    // Header & Navigation
    nav: {
      properties: 'Propriétés',
      marketplace: 'Marché',
      rentals: 'Locations',
      defi: 'DeFi',
      governance: 'Gouvernance',
      portfolio: 'Portfolio',
      notifications: 'Notifications',
      badges: 'Badges',
    },

    // Home Page
    home: {
      title: 'SolEsTT',
      subtitle: 'Immobilier de Prestige × Blockchain',
      partnership: 'En partenariat avec Junot',
      description: 'Tokenisez des propriétés d\'excellence, investissez de manière fractionnée, et gérez vos revenus locatifs sur Solana.',
      expertiseTag: '35 ans d\'expertise Junot × La puissance de Solana',
      discoverBtn: 'Découvrir les Biens',
      exploreBtn: 'Explorer le Marché',

      whyJunot: 'Pourquoi Junot × Solana ?',
      excellenceTitle: 'Excellence & Héritage',
      excellenceDesc: 'Depuis 1984, Junot est une référence de l\'immobilier de luxe en France et en Belgique. Plus de 35 ans d\'expertise dans l\'accompagnement des transactions les plus prestigieuses.',
      innovationTitle: 'Innovation Blockchain',
      innovationDesc: 'La rapidité de Solana (400ms) et ses frais ultra-faibles (0,0003€) permettent de démocratiser l\'accès aux biens d\'exception parisiens et bruxellois.',

      feature1Title: 'Biens Tokenisés',
      feature1Desc: 'Transformez des propriétés d\'exception en NFTs sur Solana. Propriété transparente avec registre immuable.',
      feature2Title: 'Investissement Fractionné',
      feature2Desc: 'Accédez aux biens premium parisiens dès 100€. Avenue Foch, Triangle d\'Or, et plus encore.',
      feature3Title: 'Loyers Automatisés',
      feature3Desc: 'Encaissement automatique en USDC. Sans intermédiaire, règlement instantané.',

      stats: {
        tvl: 'Valeur Totale Verrouillée',
        properties: 'Propriétés Listées',
        investors: 'Investisseurs Actifs',
        fees: 'Frais Moyenne Transaction',
      },

      howItWorks: 'Comment Ça Marche',
      step1Title: 'Connectez votre Wallet',
      step1Desc: 'Liez votre wallet Solana pour commencer',
      step2Title: 'Parcourez les Biens',
      step2Desc: 'Explorez les opportunités immobilières tokenisées',
      step3Title: 'Investissez',
      step3Desc: 'Achetez des parts fractionnées avec SOL ou USDC',
      step4Title: 'Percevez des Revenus',
      step4Desc: 'Recevez les loyers directement sur votre wallet',

      readyTitle: 'Prêt à Commencer ?',
      readyDesc: 'Connectez votre wallet pour explorer la plateforme',

      footerBuilt: 'Construit pour le',
      footerHackathon: 'Solana Colosseum Hackathon',
      footerPartnership: 'en partenariat avec',
      footerPowered: 'Propulsé par',
      footerExpertise: '35 ans d\'excellence Junot',
    },

    // Properties Page
    properties: {
      title: 'Propriétés',
      subtitle: 'Découvrez l\'immobilier de luxe tokenisé',
      createBtn: 'Lister une Propriété',

      filters: {
        all: 'Toutes les Propriétés',
        available: 'Disponibles',
        funded: 'Entièrement Financées',
      },

      card: {
        location: 'Localisation',
        totalValue: 'Valeur Totale',
        sharePrice: 'Prix par Part',
        availableShares: 'Parts Disponibles',
        roi: 'ROI Annuel',
        funded: 'Financé',
        viewDetails: 'Voir Détails',
        buyShares: 'Acheter des Parts',
      },

      detail: {
        overview: 'Aperçu',
        financials: 'Finances',
        documents: 'Documents',
        activity: 'Activité',

        propertyType: 'Type de Bien',
        bedrooms: 'Chambres',
        bathrooms: 'Salles de bain',
        squareFeet: 'Pieds carrés',
        yearBuilt: 'Année de construction',

        totalValue: 'Valeur Totale',
        totalShares: 'Parts Totales',
        pricePerShare: 'Prix par Part',
        availableShares: 'Parts Disponibles',
        monthlyRent: 'Loyer Mensuel',
        annualRoi: 'ROI Annuel',

        sharesToBuy: 'Parts à Acheter',
        totalPrice: 'Prix Total',
        buyNow: 'Acheter Maintenant',
        connectWallet: 'Connectez le Wallet pour Investir',
      },

      create: {
        title: 'Lister une Propriété',
        subtitle: 'Tokenisez votre bien immobilier sur Solana',

        basicInfo: 'Informations de Base',
        propertyName: 'Nom de la Propriété',
        propertyNamePlaceholder: 'ex: Appartement de Luxe Paris 16ème',
        location: 'Localisation',
        locationPlaceholder: 'ex: 75016 Paris, France',
        description: 'Description',
        descriptionPlaceholder: 'Décrivez la propriété...',

        financialDetails: 'Détails Financiers',
        totalValue: 'Valeur Totale (USD)',
        totalShares: 'Parts Totales',
        monthlyRent: 'Loyer Mensuel (USD)',
        pricePerShare: 'Prix par part',
        yieldPerShare: 'Rendement mensuel par part',

        propertyDetails: 'Détails de la Propriété',
        propertyType: 'Type de Bien',
        apartment: 'Appartement',
        house: 'Maison',
        condo: 'Copropriété',
        commercial: 'Commercial',
        bedrooms: 'Chambres',
        bathrooms: 'Salles de bain',
        squareFeet: 'Pieds carrés',
        yearBuilt: 'Année de construction',

        media: 'Médias de la Propriété',
        mediaDesc: 'Téléchargez des photos et modèles 3D de votre propriété',
        photos: 'Photos de la Propriété',
        model3d: 'Modèle 3D (Optionnel)',
        modelPreview: 'Aperçu du Modèle 3D',
        interactivePreview: 'Aperçu interactif - Utilisez la souris pour pivoter et zoomer',

        cancel: 'Annuler',
        create: 'Créer la Propriété',
        creating: 'Création en cours...',
      },
    },

    // Marketplace
    marketplace: {
      title: 'Marché Secondaire',
      subtitle: 'Échangez des parts de propriétés sur le marché secondaire',

      stats: {
        volume24h: 'Volume 24h',
        activeListings: 'Annonces Actives',
        avgChange: 'Variation Moy.',
        totalTrades: 'Total Trades',
        properties: 'propriétés',
        last7Days: '7 derniers jours',
        thisMonth: 'Ce mois-ci',
      },

      filters: {
        bestROI: 'Meilleur ROI',
        lowestPrice: 'Prix le Plus Bas',
        mostFunded: 'Plus Financé',
      },

      listing: {
        seller: 'Vendeur',
        roi: 'ROI',
        location: 'Localisation',
        sharesAvailable: 'Parts Disponibles',
        pricePerShare: 'Prix par Part',
        totalValue: 'Valeur Totale',
        buyNow: 'Acheter Maintenant',
      },

      demoNotice: 'Mode Démo - Les données du marché sont simulées. Le trading réel sera disponible une fois l\'intégration blockchain terminée.',
    },

    // Rentals
    rentals: {
      title: 'Paiements Locatifs',
      subtitle: 'Collection automatique des loyers via USDC sur Solana',

      stats: {
        asTenant: 'En Tant Que Locataire',
        asLandlord: 'En Tant Que Propriétaire',
        totalCollected: 'Total Collecté',
        rentalAgreements: 'contrats de location',
        totalRevenue: 'revenus totaux',
      },

      tabs: {
        tenant: 'Locataire',
        landlord: 'Propriétaire',
      },

      agreement: {
        landlord: 'Propriétaire',
        tenant: 'Locataire',
        active: 'ACTIF',
        monthlyRent: 'Loyer Mensuel',
        nextPayment: 'Prochain Paiement',
        lastPayment: 'Dernier Paiement',
        totalPayments: 'Total Paiements',
        days: 'jours',
        overdue: 'EN RETARD',
        payRent: 'Payer le Loyer en USDC',
        payOverdue: 'Payer Maintenant (EN RETARD)',
        dueIn: 'Paiement dû dans',
        viewDetails: 'Voir Détails',
      },

      modal: {
        title: 'Détails du Contrat de Location',
        propertyInfo: 'Info Propriété',
        terms: 'Conditions du Contrat',
        monthlyRent: 'Loyer Mensuel',
        paymentFrequency: 'Fréquence de Paiement',
        agreementStatus: 'Statut du Contrat',
        totalPayments: 'Total Paiements Effectués',
        paymentSchedule: 'Calendrier de Paiement',
        lastPayment: 'Dernier Paiement',
        nextDue: 'Prochain Paiement Dû',
        daysUntil: 'Jours Restants',
        paymentHistory: 'Historique de Paiement',
        paymentNum: 'Paiement #',
        amount: 'Montant',
        date: 'Date',
        status: 'Statut',
        paid: 'PAYÉ',
        financialSummary: 'Résumé Financier',
        totalPaid: 'Total Payé/Collecté',
        avgMonthly: 'Moyenne Mensuelle',
        payWithUSDC: 'Payer le Loyer avec USDC',
        terminate: 'Résilier le Contrat',
        close: 'Fermer',
      },

      landlordView: {
        activeAgreements: 'Contrats de Location Actifs',
        incomeHistory: 'Historique des Revenus',
        property: 'Propriété',
        tenant: 'Locataire',
        amount: 'Montant',
        date: 'Date',
        status: 'Statut',
        received: 'Reçu',
        nextExpected: 'Prochain Paiement Attendu',
        lastReceived: 'Dernier Reçu',
        totalCollected: 'Total Collecté',
      },

      noRentals: 'Aucune Location Active',
      noRentalsDesc: 'Vous ne louez actuellement aucune propriété',

      demoNotice: 'Mode Démo - Les données de location sont simulées. Les paiements USDC réels seront automatisés une fois l\'intégration blockchain terminée.',
    },

    // DeFi
    defi: {
      title: 'Hub DeFi',
      subtitle: 'Hypothèques, Collatéral et Staking',

      loyaltyStats: {
        tier: 'Niveau Fidélité',
        points: 'Points',
        stakedTokens: 'Tokens Stakés',
        totalRewards: 'Total Récompenses',
      },

      tabs: {
        mortgages: 'Hypothèques',
        collateral: 'Collatéral',
        staking: 'Staking',
      },

      mortgage: {
        applyTitle: 'Demander une Hypothèque',
        propertyAddress: 'Adresse de la Propriété',
        propertyAddressPlaceholder: 'Entrez l\'adresse de la propriété',
        loanAmount: 'Montant du Prêt (USDC)',
        loanAmountPlaceholder: '50000',
        term: 'Durée du Prêt',
        years10: '10 ans (120 mois)',
        years15: '15 ans (180 mois)',
        years20: '20 ans (240 mois)',
        years30: '30 ans (360 mois)',
        collateralTokens: 'Tokens de Collatéral',
        collateralTokensPlaceholder: '1000',
        apply: 'Demander',
        processing: 'Traitement...',

        yourMortgages: 'Vos Hypothèques',
        noMortgages: 'Aucune hypothèque pour le moment',
        loanAmount: 'Montant du Prêt',
        monthlyPayment: 'Paiement Mensuel',
        interestRate: 'Taux d\'Intérêt',
        status: 'Statut',
        active: 'ACTIF',
        pending: 'EN ATTENTE',
      },

      collateral: {
        lockTitle: 'Verrouiller le Collatéral',
        propertyAddress: 'Adresse de la Propriété',
        tokensToLock: 'Tokens à Verrouiller',
        tokensToLockPlaceholder: '100',
        collateralValue: 'Valeur du collatéral',
        borrowAmount: 'Montant à Emprunter (USDC)',
        borrowAmountPlaceholder: '5000',
        maxBorrow: 'Emprunt max (60% LTV)',
        lockCollateral: 'Verrouiller le Collatéral',
        processing: 'Traitement...',

        yourPositions: 'Vos Positions',
        noPositions: 'Aucune position pour le moment',
        lockedTokens: 'Tokens Verrouillés',
        borrowed: 'Emprunté',
        healthFactor: 'Facteur de Santé',
        status: 'Statut',
        active: 'ACTIF',
      },

      staking: {
        stakeTitle: 'Staker des Tokens',
        propertyAddress: 'Adresse de la Propriété',
        tokensToStake: 'Tokens à Staker',
        tokensToStakePlaceholder: '100',
        apy: 'APY',
        stake: 'Staker',
        processing: 'Traitement...',

        yourStaking: 'Votre Staking',
        noStaking: 'Aucune position de staking pour le moment',
        staked: 'Staké',
        rewards: 'Récompenses',
        claimRewards: 'Réclamer les Récompenses',
        tokens: 'tokens',
      },

      connectWallet: 'Connectez Votre Wallet',
      connectDesc: 'Connectez votre wallet pour accéder aux fonctionnalités DeFi',
    },

    // Governance
    governance: {
      title: 'Gouvernance',
      subtitle: 'Votez sur les décisions et propositions immobilières',
      createProposal: 'Créer une Proposition',

      stats: {
        totalProposals: 'Total Propositions',
        activeVotes: 'Votes Actifs',
        passed: 'Approuvées',
        votingPower: 'Votre Pouvoir de Vote',
      },

      noProposals: 'Aucune proposition pour le moment',
      createFirst: 'Créer la Première Proposition',

      proposal: {
        proposedBy: 'Proposé par',
        votesFor: 'Pour',
        votesAgainst: 'Contre',
        voteFor: 'Voter Pour',
        voteAgainst: 'Voter Contre',
        endsOn: 'Se termine le',
        active: 'ACTIF',
        passed: 'APPROUVÉ',
        rejected: 'REJETÉ',
        executed: 'EXÉCUTÉ',
      },

      createModal: {
        title: 'Créer une Proposition',
        propertyAddress: 'Adresse de la Propriété',
        propertyAddressPlaceholder: 'Entrez l\'adresse de la propriété',
        titleLabel: 'Titre',
        titlePlaceholder: 'Titre de la proposition',
        description: 'Description',
        descriptionPlaceholder: 'Décrivez la proposition...',
        cancel: 'Annuler',
        create: 'Créer la Proposition',
        creating: 'Création...',
      },

      connectWallet: 'Connectez Votre Wallet',
      connectDesc: 'Connectez votre wallet pour participer à la gouvernance',
    },

    // Portfolio
    portfolio: {
      title: 'Mon Portfolio',
      subtitle: 'Suivez vos investissements immobiliers',

      overview: 'Aperçu du Portfolio',
      totalValue: 'Valeur Totale',
      totalProperties: 'Propriétés',
      totalShares: 'Parts Totales',
      avgROI: 'ROI Moyen',
      monthlyIncome: 'Revenu Mensuel',

      myInvestments: 'Mes Investissements',
      noInvestments: 'Aucun investissement pour le moment',
      noInvestmentsDesc: 'Commencez à investir dans des propriétés tokenisées pour construire votre portfolio',
      browseProperties: 'Parcourir les Propriétés',

      investment: {
        sharesOwned: 'Parts Détenues',
        totalInvested: 'Total Investi',
        currentValue: 'Valeur Actuelle',
        monthlyIncome: 'Revenu Mensuel',
        roi: 'ROI',
        viewProperty: 'Voir la Propriété',
      },

      connectWallet: 'Connectez Votre Wallet',
      connectDesc: 'Connectez votre wallet pour voir votre portfolio',
    },

    // Notifications
    notifications: {
      title: 'Notifications',
      subtitle: 'Restez informé de vos investissements',
      markAllRead: 'Tout Marquer comme Lu',

      filters: {
        all: 'Toutes',
        unread: 'Non lues',
        payments: 'Paiements',
        investments: 'Investissements',
        governance: 'Gouvernance',
      },

      noNotifications: 'Aucune notification',
      noNotificationsDesc: 'Vous êtes à jour !',

      types: {
        payment: 'Paiement Reçu',
        investment: 'Mise à Jour d\'Investissement',
        governance: 'Vote de Gouvernance',
        property: 'Mise à Jour de Propriété',
      },

      connectWallet: 'Connectez Votre Wallet',
      connectDesc: 'Connectez votre wallet pour voir vos notifications',
    },

    // Badges
    badges: {
      title: 'Badges de Réussite',
      subtitle: 'Collectionnez des badges en utilisant la plateforme',

      earned: 'Gagnés',
      locked: 'Verrouillés',

      noEarned: 'Aucun badge gagné pour le moment',
      noEarnedDesc: 'Commencez à investir et à utiliser la plateforme pour gagner des badges',

      connectWallet: 'Connectez Votre Wallet',
      connectDesc: 'Connectez votre wallet pour voir vos badges',
    },

    // Compare Page
    compare: {
      title: 'Comparateur de Propriétés',
      subtitle: 'Sélectionnez jusqu\'à 3 propriétés pour les comparer côte à côte',

      selectedProperties: 'Propriétés sélectionnées',
      selectBelow: 'Sélectionnez des propriétés ci-dessous',
      selectAtLeast2: 'Sélectionnez au moins 2 propriétés pour comparer',
      comparisonReady: 'Comparaison prête!',
      reset: 'Réinitialiser',

      selectProperties: 'Sélectionner des Propriétés',
      hide: 'Masquer',
      show: 'Afficher',

      comparisonTable: 'Tableau Comparatif',
      criteria: 'Critère',
      image: 'Image',
      location: 'Localisation',
      totalValue: 'Valeur Totale',
      annualROI: 'ROI Annuel',
      monthlyRent: 'Loyer Mensuel',
      annualYield: 'Rendement Annuel',
      totalShares: 'Parts Totales',
      availableShares: 'Parts Disponibles',
      pricePerShare: 'Prix par Part',
      funding: 'Financement',
      bedrooms: 'Chambres',
      bathrooms: 'Salles de Bain',
      surface: 'Surface',
      pricePerSqm: 'Prix / m²',
      yearBuilt: 'Année de Construction',
      actions: 'Actions',
      viewDetails: 'Voir Détails',

      badges: {
        lowestPrice: '🏆 Prix le plus bas',
        bestROI: '🏆 Meilleur ROI',
        highestYield: '🏆 Meilleur rendement',
        lowestPricePerSqm: '🏆 Prix/m² le plus bas',
      },

      emptyState: {
        title: 'Commencez la Comparaison',
        description: 'Sélectionnez au moins 2 propriétés pour voir le tableau comparatif',
      },

      maxProperties: 'Vous ne pouvez comparer que 3 propriétés maximum',
    },

    // Common
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      close: 'Fermer',
      save: 'Sauvegarder',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Voir',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      connectWallet: 'Connecter le Wallet',
      disconnectWallet: 'Déconnecter',
      comingSoon: 'Bientôt Disponible',
      demoMode: 'Mode Démo',
    },
  },
};
