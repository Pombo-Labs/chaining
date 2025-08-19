'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { createChain } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import { ChainCategory, ChainingMethod } from '@/types';

export default function CreateChain() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'daily-living' as ChainCategory,
    chainingMethod: 'forward' as ChainingMethod,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const chainData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        chainingMethod: formData.chainingMethod,
        steps: [],
        isTemplate: false,
        isActive: true,
        totalSessions: 0,
      };

      const { id: chainId, error: createError } = await createChain(user.uid, chainData);
      if (createError) {
        throw new Error(createError);
      }
      router.push(`/chains/${chainId}/edit`);
    } catch (err: any) {
      setError(err.message || 'Failed to create chain');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-black transition-colors mb-4"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-light text-black">Create New Chain</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Chain Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., Brushing Teeth"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Brief description of this skill chain..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="daily-living">Daily Living</option>
              <option value="hygiene">Hygiene</option>
              <option value="dressing">Dressing</option>
              <option value="eating">Eating</option>
              <option value="social-skills">Social Skills</option>
              <option value="academic">Academic</option>
              <option value="play">Play</option>
              <option value="communication">Communication</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Chaining Method */}
          <div>
            <label htmlFor="chainingMethod" className="block text-sm font-medium text-gray-700 mb-2">
              Chaining Method *
            </label>
            <select
              id="chainingMethod"
              name="chainingMethod"
              value={formData.chainingMethod}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="forward">Forward Chaining</option>
              <option value="backward">Backward Chaining</option>
              <option value="total-task">Total Task</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              {formData.chainingMethod === 'forward' && 'Teach steps from beginning to end, one at a time.'}
              {formData.chainingMethod === 'backward' && 'Teach steps from end to beginning, one at a time.'}
              {formData.chainingMethod === 'total-task' && 'Practice the entire sequence every time.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="flex-1 bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Chain'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
