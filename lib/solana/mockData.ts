import { Property } from './types';
import { PublicKey } from '@solana/web3.js';

// Mock properties for demo purposes
export const mockProperties: Property[] = [
  {
    id: '1',
    address: new PublicKey('DwmQ4kQ8EBSeY3w9FBbkKJ6jMW3BnuqvmZKw7UzX8ZYV'),
    name: 'Luxury Apartment - Paris 16th',
    description: 'Beautiful 3-bedroom apartment in the heart of Paris, near the Eiffel Tower. Recently renovated with modern amenities.',
    location: '75016 Paris, France',
    price: 500000,
    totalValue: 500000,
    totalShares: 1000,
    availableShares: 750,
    rentPerMonth: 2500,
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
    owner: new PublicKey('7fUAJdStEuGbc3sM84cKRL6yYaaSstyLSU4ve5oovLS7'),
    isTokenized: true,
    createdAt: Date.now() - 86400000 * 30,
    metadata: {
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
      yearBuilt: 2020,
      propertyType: 'apartment',
    },
  },
  {
    id: '2',
    address: new PublicKey('8sKQXqp6k7Y3ZpEr5MdJvdKzUnGk2aeW9FxVCqD3nWjt'),
    name: 'Modern Villa - Côte d\'Azur',
    description: 'Stunning villa with sea view, infinity pool, and private beach access. Perfect for luxury living.',
    location: 'Nice, French Riviera',
    price: 1500000,
    totalValue: 1500000,
    totalShares: 3000,
    availableShares: 2100,
    rentPerMonth: 7500,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    owner: new PublicKey('GZWqhju2r5L8NqB4vX8vDHJMkyVKpNZQFzGj4zYtNcML'),
    isTokenized: true,
    createdAt: Date.now() - 86400000 * 15,
    metadata: {
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 3500,
      yearBuilt: 2022,
      propertyType: 'house',
    },
  },
  {
    id: '3',
    address: new PublicKey('3XpQxWfpqZYeLKLEJvqvD5Uw5sVc8vKHzPkXnDfYqYMh'),
    name: 'Downtown Loft - Brussels',
    description: 'Contemporary loft in the business district. High ceilings, industrial design, and excellent location.',
    location: 'Brussels, Belgium',
    price: 350000,
    totalValue: 350000,
    totalShares: 700,
    availableShares: 200,
    rentPerMonth: 1800,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    owner: new PublicKey('BvzKvn6nUUAYtKu2pH3h5SbUkUNcRPQawg4bURBiojJx'),
    isTokenized: true,
    createdAt: Date.now() - 86400000 * 7,
    metadata: {
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1000,
      yearBuilt: 2019,
      propertyType: 'condo',
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

// Helper function to format price
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
