'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plan } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface PlanFormProps {
  plan?: Plan;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export default function PlanForm({ plan, onSubmit, isLoading }: PlanFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    full_description: '',
    price: '',
    tags: '',
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (plan) {
      setFormData({
        title: plan.title || '',
        short_description: plan.short_description || '',
        full_description: plan.full_description || '',
        price: plan.price || '',
        tags: plan.tags || '',
        is_active: plan.is_active ?? true,
      });
      if (plan.image_url) {
        setImagePreview(plan.image_url);
      }
    }
  }, [plan]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.short_description.trim()) newErrors.short_description = 'Short description is required';
    if (!formData.full_description.trim()) newErrors.full_description = 'Full description is required';
    if (!plan && !imageFile) newErrors.image = 'Image is required for new plans';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('short_description', formData.short_description);
    data.append('full_description', formData.full_description);
    if (formData.price) data.append('price', formData.price);
    if (formData.tags) data.append('tags', formData.tags);
    data.append('is_active', String(formData.is_active));
    if (imageFile) data.append('image', imageFile);

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Input
            label="Title"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            placeholder="e.g., Weight Loss Program"
          />

          <Textarea
            label="Short Description"
            id="short_description"
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            error={errors.short_description}
            placeholder="Brief description for card display (100-150 characters)"
            rows={3}
          />

          <Textarea
            label="Full Description"
            id="full_description"
            value={formData.full_description}
            onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
            error={errors.full_description}
            placeholder="Detailed description for the plan detail page"
            rows={6}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (optional)"
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="99.99"
            />

            <Input
              label="Tags (comma-separated)"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="weight-loss, beginner"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(plan?.image_url || null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer py-8">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="mt-2 text-sm text-gray-600">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
          </div>

          {/* Active Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
              Active (visible on public site)
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/plans')}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {plan ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </form>
  );
}
