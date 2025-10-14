import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trash2, 
  Upload, 
  X
} from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface PhotoSliderProps {
  photos: Photo[];
  onAddPhoto?: (file: File, title: string, description?: string) => void;
  onDeletePhoto?: (photoId: string) => void;
  isGovernmentUser?: boolean;
  autoPlay?: boolean;
  slideDelay?: number;
}

const PhotoSlider: React.FC<PhotoSliderProps> = ({
  photos,
  onAddPhoto,
  onDeletePhoto,
  isGovernmentUser = false,
  autoPlay = true,
  slideDelay = 6000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    file: null as File | null,
    title: '',
    description: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && photos.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
      }, slideDelay);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, photos.length, slideDelay]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewPhoto(prev => ({ ...prev, file }));
    }
  };

  const handleAddPhoto = () => {
    if (newPhoto.file && newPhoto.title && onAddPhoto) {
      onAddPhoto(newPhoto.file, newPhoto.title, newPhoto.description);
      setNewPhoto({ file: null, title: '', description: '' });
      setShowAddForm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    if (onDeletePhoto) {
      onDeletePhoto(photoId);
      // Adjust current index if needed
      if (currentIndex >= photos.length - 1) {
        setCurrentIndex(0);
      }
    }
  };


  if (photos.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">
            <Upload className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600 mb-4">No photos available</p>
          {isGovernmentUser && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Photo
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Photo Slider */}
      <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
        {/* Current Photo */}
        <div className="relative w-full h-full">
          <img
            src={photos[currentIndex]?.url}
            alt={photos[currentIndex]?.title}
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          
          {/* Overlay with photo info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h3 className="text-white text-xl font-semibold mb-2">
              {photos[currentIndex]?.title}
            </h3>
            {photos[currentIndex]?.description && (
              <p className="text-white/90 text-sm mb-2">
                {photos[currentIndex]?.description}
              </p>
            )}
            <div className="flex items-center justify-between text-white/80 text-xs">
              <span>By {photos[currentIndex]?.uploadedBy}</span>
              <span>
                {new Date(photos[currentIndex]?.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          </div>


          {/* Delete Button for Government Users */}
          {isGovernmentUser && onDeletePhoto && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDeletePhoto(photos[currentIndex]?.id)}
              className="absolute top-4 left-4 bg-red-500/20 hover:bg-red-500/30 text-white border-red-500/30"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

      </div>

      {/* Add Photo Form for Government Users */}
      {isGovernmentUser && showAddForm && (
        <Card className="mt-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Photo</h3>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAddForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="photo-upload">Select Photo</Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  className="mt-1"
                />
                {newPhoto.file && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {newPhoto.file.name}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="photo-title">Title</Label>
                <Input
                  id="photo-title"
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter photo title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="photo-description">Description (Optional)</Label>
                <Textarea
                  id="photo-description"
                  value={newPhoto.description}
                  onChange={(e) => setNewPhoto(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter photo description"
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleAddPhoto} disabled={!newPhoto.file || !newPhoto.title}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Photo
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Photo Button for Government Users */}
      {isGovernmentUser && !showAddForm && (
        <div className="mt-4 flex justify-center">
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Photo
          </Button>
        </div>
      )}
    </div>
  );
};

export default PhotoSlider;
