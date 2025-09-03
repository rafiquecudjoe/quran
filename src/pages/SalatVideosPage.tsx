import React, { useState } from 'react';
import { Play, Clock, Eye, Search } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { SalatVideo } from '../types';

interface SalatVideosPageProps {
  onBack: () => void;
}

// Mock salat videos data
const mockSalatVideos: SalatVideo[] = [
  {
    id: '1',
    title: 'How to Perform Fajr Prayer',
    description: 'Complete guide to performing the morning prayer with proper recitation and movements.',
    videoUrl: '/videos/fajr-prayer.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584463380996-1c8dcb4c8d6b?w=400&h=225&fit=crop',
    duration: 12,
    category: 'fajr',
    language: 'English',
    uploadDate: '2024-01-15',
    views: 1250,
    isPublished: true
  },
  {
    id: '2',
    title: 'Dhuhr Prayer Step by Step',
    description: 'Learn the midday prayer with detailed explanation of each step and recitation.',
    videoUrl: '/videos/dhuhr-prayer.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop',
    duration: 15,
    category: 'dhuhr',
    language: 'English',
    uploadDate: '2024-01-12',
    views: 980,
    isPublished: true
  },
  {
    id: '3',
    title: 'Asr Prayer Tutorial',
    description: 'Afternoon prayer guide with Arabic pronunciation and English translation.',
    videoUrl: '/videos/asr-prayer.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=225&fit=crop',
    duration: 13,
    category: 'asr',
    language: 'English',
    uploadDate: '2024-01-10',
    views: 1105,
    isPublished: true
  },
  {
    id: '4',
    title: 'Maghrib Prayer Guide',
    description: 'Evening prayer demonstration with proper timing and recitation.',
    videoUrl: '/videos/maghrib-prayer.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=225&fit=crop',
    duration: 11,
    category: 'maghrib',
    language: 'English',
    uploadDate: '2024-01-08',
    views: 875,
    isPublished: true
  },
  {
    id: '5',
    title: 'Isha Prayer Complete Tutorial',
    description: 'Night prayer guide with detailed steps and spiritual significance.',
    videoUrl: '/videos/isha-prayer.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584463380996-1c8dcb4c8d6b?w=400&h=225&fit=crop',
    duration: 16,
    category: 'isha',
    language: 'English',
    uploadDate: '2024-01-05',
    views: 1320,
    isPublished: true
  },
  {
    id: '6',
    title: 'Basic Prayer Movements and Positions',
    description: 'Learn the fundamental movements and positions used in Islamic prayer.',
    videoUrl: '/videos/prayer-basics.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&h=225&fit=crop',
    duration: 20,
    category: 'general',
    language: 'English',
    uploadDate: '2024-01-03',
    views: 2150,
    isPublished: true
  }
];

export const SalatVideosPage: React.FC<SalatVideosPageProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<SalatVideo | null>(null);

  const categories = [
    { value: 'all', label: 'All Prayers' },
    { value: 'fajr', label: 'Fajr' },
    { value: 'dhuhr', label: 'Dhuhr' },
    { value: 'asr', label: 'Asr' },
    { value: 'maghrib', label: 'Maghrib' },
    { value: 'isha', label: 'Isha' },
    { value: 'general', label: 'General' }
  ];

  const filteredVideos = mockSalatVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory && video.isPublished;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      fajr: 'bg-blue-100 text-blue-800',
      dhuhr: 'bg-yellow-100 text-yellow-800',
      asr: 'bg-orange-100 text-orange-800',
      maghrib: 'bg-red-100 text-red-800',
      isha: 'bg-purple-100 text-purple-800',
      general: 'bg-blue-100 text-blue-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (selectedVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-blue-700 hover:text-blue-800 font-medium"
              >
                ← Back to Videos
              </button>
              <button
                onClick={onBack}
                className="text-slate-600 hover:text-slate-900"
              >
                ← Home
              </button>
            </div>
          </div>
        </header>

        {/* Video Player */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card variant="elevated">
            <CardContent className="p-0">
              <div className="aspect-video bg-slate-900 rounded-t-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Video Player</p>
                  <p className="text-sm opacity-75">
                    In production, this would be your actual video player
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                      {selectedVideo.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {selectedVideo.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDuration(selectedVideo.duration)}
                      </span>
                      <Badge className={getCategoryColor(selectedVideo.category)}>
                        {selectedVideo.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {selectedVideo.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Free Salat Videos</h1>
              <p className="text-sm text-slate-600">Learn how to perform Islamic prayers</p>
            </div>
            <button
              onClick={onBack}
              className="text-slate-600 hover:text-slate-900"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-5 h-5 text-slate-400" />}
              />
            </div>
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <Card variant="elevated" className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-t-xl">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getCategoryColor(video.category)}>
                        {video.category}
                      </Badge>
                      <span className="text-sm text-slate-500 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {video.views.toLocaleString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No videos found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
