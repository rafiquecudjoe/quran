import React, { useState } from 'react';
import { Plus, Calendar, Clock, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from './Button';
import { Card, CardContent, CardHeader } from './Card';
import { Input } from './Input';
import { RecitationEntry } from '../../types';

interface RecitationTrackerProps {
  entries: RecitationEntry[];
  onAddEntry: (entry: Omit<RecitationEntry, 'id' | 'userId' | 'createdAt'>) => void;
}

export const RecitationTracker: React.FC<RecitationTrackerProps> = ({
  entries,
  onAddEntry
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    surahName: '',
    verses: '',
    duration: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.surahName && formData.verses && formData.duration) {
      onAddEntry({
        date: formData.date,
        surahName: formData.surahName,
        verses: formData.verses,
        duration: parseInt(formData.duration),
        notes: formData.notes || undefined
      });
      
      setFormData({
        date: new Date().toISOString().split('T')[0],
        surahName: '',
        verses: '',
        duration: '',
        notes: ''
      });
      setShowAddForm(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter(entry => entry.date === today);
  const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);
  
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  const thisWeekEntries = entries.filter(entry => 
    new Date(entry.date) >= thisWeekStart
  );
  const weeklyTotal = thisWeekEntries.reduce((sum, entry) => sum + entry.duration, 0);

  const recentEntries = entries.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today</p>
                <p className="text-2xl font-bold text-emerald-600">{todayTotal}min</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">This Week</p>
                <p className="text-2xl font-bold text-blue-600">{weeklyTotal}min</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Sessions</p>
                <p className="text-2xl font-bold text-purple-600">{entries.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Entry Section */}
      <Card variant="elevated">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Daily Recitation Log</h3>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </Button>
        </CardHeader>
        
        {showAddForm && (
          <CardContent className="border-t border-slate-200 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
                <Input
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="30"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Surah Name"
                  value={formData.surahName}
                  onChange={(e) => setFormData({...formData, surahName: e.target.value})}
                  placeholder="Al-Fatiha"
                  required
                />
                <Input
                  label="Verses"
                  value={formData.verses}
                  onChange={(e) => setFormData({...formData, verses: e.target.value})}
                  placeholder="1-7 or complete"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any notes about your recitation session..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Entry
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Recent Entries */}
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-900">Recent Recitations</h3>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No recitation entries yet</p>
              <p className="text-sm text-slate-400 mt-1">Start tracking your daily Quran recitations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{entry.surahName}</h4>
                      <p className="text-sm text-slate-600">
                        Verses {entry.verses} • {new Date(entry.date).toLocaleDateString()}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-slate-500 mt-1">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {entry.duration}min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
