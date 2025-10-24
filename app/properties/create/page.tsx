'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/upload/ImageUploader';
import Model3DUploader from '@/components/upload/Model3DUploader';
import PageTransition from '@/components/animations/PageTransition';
import Property3DViewer from '@/components/3d/Property3DViewer';
import { usePropertyTokenization } from '@/lib/solana/hooks/usePropertyTokenization';
import { useDueDiligence } from '@/lib/solana/hooks/useDueDiligence';

// Toggle this to enable/disable blockchain integration
const USE_BLOCKCHAIN = process.env.NEXT_PUBLIC_DEMO_MODE !== 'true'; // Uses demo mode from .env.local

export default function CreateProperty() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const { createProperty, tokenizeProperty, loading: blockchainLoading, error: blockchainError } = usePropertyTokenization();
  const { uploadDocument } = useDueDiligence();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    totalValue: '',
    totalShares: '',
    rentPerMonth: '',
    propertyType: 'apartment',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    yearBuilt: '',
  });

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploaded3DModel, setUploaded3DModel] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (USE_BLOCKCHAIN && publicKey) {
        // BLOCKCHAIN MODE: Create property on-chain
        console.log('Creating property on blockchain:', formData);

        const result = await createProperty({
          name: formData.name,
          location: formData.location,
          totalValue: Number(formData.totalValue),
          totalShares: Number(formData.totalShares),
          rentPerMonth: Number(formData.rentPerMonth),
          metadataUri: '', // Will be IPFS/Arweave URI in production
        });

        console.log('Property created on-chain!', result);

        // Tokenize the property (create SPL tokens)
        const tokenizeResult = await tokenizeProperty(formData.name);
        console.log('Property tokenized!', tokenizeResult);

        // Upload property images as documents
        if (uploadedImages.length > 0) {
          for (const image of uploadedImages) {
            await uploadDocument(result.propertyAddress, 'other', image.name, image);
          }
        }

        // Upload 3D model as document
        if (uploaded3DModel) {
          await uploadDocument(result.propertyAddress, 'other', uploaded3DModel.name, uploaded3DModel);
        }

        alert(`Property created successfully on Solana!\n\nProperty Address: ${result.propertyAddress}\nToken Mint: ${tokenizeResult.mintAddress}\n\nTransaction: ${result.signature}`);

      } else {
        // DEMO MODE: Just simulate the creation
        console.log('Creating property (demo mode):', formData);

        // Simulate blockchain transaction
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Store property data locally for demo
        const demoProperty = {
          id: `demo_${Date.now()}`,
          ...formData,
          owner: publicKey?.toBase58() || 'demo',
          created: Date.now(),
        };

        const properties = JSON.parse(localStorage.getItem('demo_properties') || '[]');
        properties.push(demoProperty);
        localStorage.setItem('demo_properties', JSON.stringify(properties));

        alert('Property created successfully! (Demo mode)\n\nConnect to Devnet and enable USE_BLOCKCHAIN for on-chain transactions.');
      }

      router.push('/properties');
    } catch (err: any) {
      console.error('Error creating property:', err);
      setError(err.message || 'Failed to create property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!connected) {
    return (
      <div className="min-h-screen  text-junot-text-dark">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="modern-card p-12 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-junot-text-muted">You need to connect your wallet to list a property</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <PageTransition>
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">List a Property</h1>
          <p className="text-junot-text-muted mb-8">Tokenize your real estate on Solana</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="modern-card p-8">
              <h2 className="text-2xl font-bold mb-6">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Luxury Apartment Paris 16th"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 75016 Paris, France"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe the property..."
                  />
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="modern-card p-8">
              <h2 className="text-2xl font-bold mb-6">Financial Details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Total Value (USD) *</label>
                  <input
                    type="number"
                    name="totalValue"
                    value={formData.totalValue}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="500000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Total Shares *</label>
                  <input
                    type="number"
                    name="totalShares"
                    value={formData.totalShares}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Rent (USD) *</label>
                  <input
                    type="number"
                    name="rentPerMonth"
                    value={formData.rentPerMonth}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="2500"
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                <div className="text-sm text-junot-text-muted space-y-1">
                  <p>Price per share: <span className="text-white font-semibold">
                    ${formData.totalValue && formData.totalShares
                      ? (Number(formData.totalValue) / Number(formData.totalShares)).toFixed(2)
                      : '0.00'}
                  </span></p>
                  <p>Monthly yield per share: <span className="text-white font-semibold">
                    ${formData.rentPerMonth && formData.totalShares
                      ? (Number(formData.rentPerMonth) / Number(formData.totalShares)).toFixed(2)
                      : '0.00'}
                  </span></p>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="modern-card p-8">
              <h2 className="text-2xl font-bold mb-6">Property Details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Type *</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Square Feet</label>
                  <input
                    type="number"
                    name="squareFeet"
                    value={formData.squareFeet}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="1200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Year Built</label>
                  <input
                    type="number"
                    name="yearBuilt"
                    value={formData.yearBuilt}
                    onChange={handleChange}
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="2020"
                  />
                </div>

              </div>
            </div>

            {/* Media Upload Section */}
            <div className="modern-card p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Property Media</h3>
                <p className="text-sm text-junot-text-muted">Upload photos and 3D models of your property</p>
              </div>

              {/* Image Upload */}
              <div>
                <h4 className="text-lg font-semibold mb-4">📸 Property Photos</h4>
                <ImageUploader
                  onUpload={(files) => setUploadedImages(files)}
                  maxFiles={10}
                  maxSize={5}
                />
              </div>

              {/* 3D Model Upload */}
              <div>
                <h4 className="text-lg font-semibold mb-4">🎨 3D Model (Optional)</h4>
                <Model3DUploader
                  onUpload={(file) => setUploaded3DModel(file)}
                  maxSize={50}
                />
              </div>

              {/* 3D Model Preview */}
              {uploaded3DModel && (
                <div>
                  <h4 className="text-lg font-semibold mb-4">🔍 3D Model Preview</h4>
                  <Property3DViewer
                    propertyName={formData.name || 'Property Preview'}
                    modelFile={uploaded3DModel}
                  />
                  <p className="text-xs text-neutral-500 mt-2 text-center">
                    Interactive preview - Use mouse to rotate and zoom
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/properties')}
                className="flex-1 px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-4 modern-button disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Creating Property...' : 'Create Property'}
              </button>
            </div>
          </form>
        </div>
      </main>
      </PageTransition>
    </div>
  );
}
