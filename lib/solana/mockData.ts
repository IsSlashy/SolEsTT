import { Property } from './types';
import { PublicKey } from '@solana/web3.js';

// Re-export Property type for external use
export type { Property } from './types';

// Mock properties for demo - Premium Junot Properties in Paris & Brussels
export const mockProperties: Property[] = [
  {
    id: '1',
    address: new PublicKey('DwmQ4kQ8EBSeY3w9FBbkKJ6jMW3BnuqvmZKw7UzX8ZYV'),
    name: 'Appartement Haussmannien - Avenue Foch',
    description: 'Appartement d\'exception de 250m² au 3ème étage d\'un immeuble haussmannien. Vue imprenable sur l\'Arc de Triomphe. Plafonds moulurés 3,5m, cheminées en marbre, parquet point de Hongrie. Cave et parking inclus. Conciergerie 24/7.',
    location: 'Avenue Foch, 75116 Paris',
    price: 4500000,
    totalValue: 4500000,
    totalShares: 9000,
    availableShares: 6300,
    rentPerMonth: 15000,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200'
    ],
    owner: new PublicKey('7fUAJdStEuGbc3sM84cKRL6yYaaSstyLSU4ve5oovLS7'),
    isTokenized: true,
    createdAt: Date.now() - 86400000 * 45,
    metadata: {
      bedrooms: 5,
      bathrooms: 3,
      squareFeet: 2691,
      yearBuilt: 1880,
      propertyType: 'apartment',
    },
  },
  {
    id: '2',
    address: new PublicKey('8sKQXqp6k7Y3ZpEr5MdJvdKzUnGk2aeW9FxVCqD3nWjt'),
    name: 'Penthouse - Triangle d\'Or',
    description: 'Exceptionnel penthouse de 180m² avec terrasse de 120m² offrant une vue panoramique sur la Tour Eiffel et le Sacré-Cœur. Entièrement rénové par architecte d\'intérieur. Domotique, climatisation, cuisine Boffi, salles de bains marbre de Carrare.',
    location: 'Avenue Montaigne, 75008 Paris',
    price: 3200000,
    totalValue: 3200000,
    totalShares: 6400,
    availableShares: 4480,
    rentPerMonth: 12000,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200'
    ],
    owner: new PublicKey('GZWqhju2r5L8NqB4vX8vDHJMkyVKpNZQFzGj4zYtNcML'),
    isTokenized: true,
    createdAt: Date.now() - 86400000 * 30,
    metadata: {
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 1937,
      yearBuilt: 2023,
      propertyType: 'apartment',
    },
  },
  {
    id: '3',
    address: new PublicKey('3XpQxWfpqZYeLKLEJvqvD5Uw5sVc8vKHzPkXnDfYqYMh'),
    name: 'Hôtel Particulier - Ixelles',
    description: 'Magnifique maison de maître Art Nouveau de 320m² sur 4 niveaux. Vitraux d\'époque, escalier monumental, jardin paysager 200m². Quartier prisé des institutions européennes. Garage 2 voitures, cave à vin.',
    location: 'Avenue Louise, 1050 Ixelles, Bruxelles',
    price: 2800000,
    totalValue: 2800000,
    totalShares: 5600,
    availableShares: 1680,
    rentPerMonth: 10000,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200'
    ],
    owner: new PublicKey('BvzKvn6nUUAYtKu2pH3h5SbUkUNcRPQawg4bURBiojJx'),
    isTokenized: true,
    createdAt: Date.now() - 86400000 * 20,
    metadata: {
      bedrooms: 6,
      bathrooms: 4,
      squareFeet: 3444,
      yearBuilt: 1905,
      propertyType: 'house',
    },
  },
];

// Helper function to get all properties
export function getAllProperties(): Property[] {
  return mockProperties;
}

// Helper function to get property by ID
export function getPropertyById(id: string): Property | undefined {
  return mockProperties.find(p => p.id === id);
}

// Helper function to calculate ROI
export function calculateROI(property: Property): number {
  const annualRent = property.rentPerMonth * 12;
  const roi = (annualRent / property.totalValue) * 100;
  return Number(roi.toFixed(2));
}

// Helper function to format price in EUR
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper to convert sqft to m²
export function formatSquareMeters(squareFeet: number): string {
  const squareMeters = Math.round(squareFeet * 0.092903);
  return `${squareMeters} m²`;
}
