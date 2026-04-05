import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { apiUrl } from '../lib/api';
import { 
  MapPin, 
  Book, 
  GraduationCap, 
  Calendar, 
  Plus, 
  Check, 
  ArrowRight, 
  Sparkles,
  Loader2,
  Edit2,
  Lock,
  LogOut,
  Mail,
  ChevronLeft
} from 'lucide-react';

export default function Profile() {
  const { user, token, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: 18,
    gender: '',
    major: '',
    college: '',
    year: 'Freshman',
    bio: '',
    location: { city: 'Pune', coordinates: [0, 0] },
    rent: 0,
    images: [''],
    interests: [] as string[],
    preferences: {
      smoking: false,
      drinking: false,
      sleep_schedule: 'early_bird' as 'early_bird' | 'night_owl',
      cleanliness: 'medium' as 'low' | 'medium' | 'high',
      gaming: false,
      guests: true,
      pets: 'no' as 'yes' | 'no' | 'love_them',
      diet: 'anything' as 'vegan' | 'vegetarian' | 'non_veg' | 'anything',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(apiUrl('/api/users/me'), {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name || user?.name || '',
            age: data.age || 18,
            gender: data.gender || '',
            major: data.major || '',
            college: data.college || '',
            year: data.year || 'Freshman',
            bio: data.bio || '',
            location: data.location || { city: 'Pune', coordinates: [0, 0] },
            rent: data.rent || 0,
            images: data.images?.length ? data.images : [''],
            interests: data.interests || [],
            preferences: data.preferences || {
              smoking: false,
              drinking: false,
              sleep_schedule: 'early_bird',
              cleanliness: 'medium',
              gaming: false,
              guests: true,
              pets: 'no',
              diet: 'anything',
            },
          });
          if (data.images?.length > 0 && data.name) {
            setIsEditing(false);
          } else {
            setIsEditing(true);
          }
        } else {
          setIsEditing(true);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setIsEditing(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token, user?.name]);

  const interestsList = [
    'Music', 'Travel', 'Cooking', 'Art', 'Gaming', 
    'Movies', 'Fitness', 'Photography', 'Reading', 'Coding',
    'Dancing', 'Yoga', 'Hiking', 'Anime', 'Politics'
  ];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalImages = formData.images[0]
        ? formData.images
        : [`https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent('modern professional student headshot, soft lighting, campus background')}&image_size=square_hd`];

      const response = await fetch(apiUrl('/api/users/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, images: finalImages }),
      });

      if (response.ok) {
        updateUser({ hasProfile: true });
        setIsEditing(false);
        setStep(1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setResetMessage('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => {
          setShowPasswordReset(false);
          setResetMessage('');
        }, 2000);
      } else {
        setResetMessage(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error(error);
      setResetMessage('Server error');
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!isEditing && !showPasswordReset) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] py-12 px-4 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-pink-600/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-zinc-800/50 shadow-2xl overflow-hidden"
          >
            {/* Header / Cover */}
            <div className="relative h-48 -mx-8 -mt-8 mb-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                <div className="w-32 h-32 rounded-[2rem] border-4 border-[#0A0A0A] overflow-hidden shadow-2xl">
                  <img 
                    src={formData.images[0] || 'https://via.placeholder.com/150'} 
                    alt={formData.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pb-4">
                  <h1 className="text-3xl font-black text-white tracking-tight">{formData.name}, {formData.age}</h1>
                  <p className="text-purple-400 font-bold uppercase text-[10px] tracking-widest">{user?.role}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/discover')}
                className="absolute top-6 left-6 p-2 bg-black/20 backdrop-blur-md rounded-xl border border-white/10 text-white hover:bg-black/40 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => logout()}
                className="absolute top-6 right-6 p-2 bg-red-500/10 backdrop-blur-md rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all"
              >
                <LogOut size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800">
                  <div className="flex items-center gap-3 text-zinc-500 mb-1">
                    <Mail size={14} className="text-purple-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Email</span>
                  </div>
                  <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800">
                  <div className="flex items-center gap-3 text-zinc-500 mb-1">
                    <MapPin size={14} className="text-purple-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Location</span>
                  </div>
                  <p className="text-sm font-medium text-white">{formData.location.city}</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800">
                  <div className="flex items-center gap-3 text-zinc-500 mb-1">
                    <GraduationCap size={14} className="text-purple-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">College</span>
                  </div>
                  <p className="text-sm font-medium text-white truncate">{formData.college}</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800">
                  <div className="flex items-center gap-3 text-zinc-500 mb-1">
                    <Book size={14} className="text-purple-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Major</span>
                  </div>
                  <p className="text-sm font-medium text-white truncate">{formData.major}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">About Me</h3>
                <div className="p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800">
                  <p className="text-zinc-300 text-sm leading-relaxed">{formData.bio || "No bio added yet."}</p>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map(i => (
                    <span key={i} className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-xl text-[10px] font-bold border border-purple-500/20">
                      {i}
                    </span>
                  ))}
                  {formData.interests.length === 0 && <p className="text-zinc-600 text-xs ml-1">No interests selected.</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
                <button 
                  onClick={() => setShowPasswordReset(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 text-white font-black py-4 rounded-2xl hover:bg-zinc-700 transition-all"
                >
                  <Lock size={18} />
                  Security
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showPasswordReset) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] py-12 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-zinc-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-zinc-800/50 shadow-2xl"
        >
          <button 
            onClick={() => { setShowPasswordReset(false); setResetMessage(''); }}
            className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-bold">Back to Profile</span>
          </button>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-purple-400 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white">Reset Password</h2>
            <p className="text-zinc-500 text-sm mt-2">Update your account security</p>
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Current Password</label>
              <input 
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">New Password</label>
              <input 
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {resetMessage && (
              <p className={`text-center text-sm font-bold ${resetMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
                {resetMessage}
              </p>
            )}

            <button 
              type="submit"
              className="w-full bg-white text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Update Password
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-pink-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/40 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-zinc-800/50 shadow-2xl"
        >
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    step >= s ? 'w-8 bg-purple-500' : 'w-4 bg-zinc-800'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">
              Step {step} of 3
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tight">Personal Details</h2>
                    <p className="text-zinc-500 text-sm">Let's start with the basics of who you are.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Age</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                          <input
                            type="number"
                            min="18"
                            max="99"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">City</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                          <input
                            type="text"
                            value={formData.location.city}
                            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                            placeholder="Pune"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Gender</label>
                      <div className="flex gap-2">
                        {['Man', 'Woman', 'Non-binary'].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: val })}
                            className={`flex-1 py-3 rounded-2xl border text-sm font-bold transition-all ${
                              formData.gender === val
                                ? 'bg-white text-black border-white'
                                : 'bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none h-32 resize-none transition-all"
                        placeholder="What makes you a great roommate?"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full group bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tight">Academic Info</h2>
                    <p className="text-zinc-500 text-sm">Tell us about your student life.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Major</label>
                      <div className="relative">
                        <Book className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                        <input
                            type="text"
                            value={formData.major}
                            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                            placeholder="Computer Engineering"
                          />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">College</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                        <input
                            type="text"
                            value={formData.college}
                            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                            placeholder="MIT World Peace University"
                          />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Year of Study</label>
                      <div className="flex flex-wrap gap-2">
                        {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setFormData({ ...formData, year: val })}
                            className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                              formData.year === val
                                ? 'bg-white text-black border-white'
                                : 'bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {user?.role === 'owner' && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Monthly Rent (₹)</label>
                        <input
                          type="number"
                          value={formData.rent}
                          onChange={(e) => setFormData({ ...formData, rent: parseInt(e.target.value) })}
                          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-4 rounded-2xl border border-zinc-800 font-bold text-zinc-500 hover:bg-zinc-900 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-[2] group bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Almost There
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tight">Lifestyle</h2>
                    <p className="text-zinc-500 text-sm">Last step! What's it like living with you?</p>
                  </div>

                  <div className="space-y-8">
                    {/* Interests */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Interests</label>
                      <div className="flex flex-wrap gap-2">
                        {interestsList.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                              formData.interests.includes(interest)
                                ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                : 'bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preferences Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Smoking', key: 'smoking' },
                        { label: 'Drinking', key: 'drinking' },
                        { label: 'Gaming', key: 'gaming' },
                        { label: 'Guests', key: 'guests' },
                      ].map((pref) => (
                        <button
                          key={pref.key}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              preferences: {
                                ...formData.preferences,
                                [pref.key]: !formData.preferences[pref.key as keyof typeof formData.preferences],
                              },
                            })
                          }
                          className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-xs font-bold transition-all ${
                            formData.preferences[pref.key as keyof typeof formData.preferences]
                              ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                              : 'bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                          }`}
                        >
                          {pref.label}
                          {formData.preferences[pref.key as keyof typeof formData.preferences] ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4 opacity-30" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Pets</label>
                        <select 
                          value={formData.preferences.pets}
                          onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, pets: e.target.value as 'yes' | 'no' | 'love_them' } })}
                          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-white text-sm outline-none appearance-none"
                        >
                          <option value="no">No Pets</option>
                          <option value="yes">Have Pets</option>
                          <option value="love_them">Love Pets</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Diet</label>
                        <select 
                          value={formData.preferences.diet}
                          onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, diet: e.target.value as 'vegan' | 'vegetarian' | 'non_veg' | 'anything' } })}
                          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-white text-sm outline-none appearance-none"
                        >
                          <option value="anything">Anything</option>
                          <option value="non_veg">Non-Veg</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="vegan">Vegan</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-4 rounded-2xl border border-zinc-800 font-bold text-zinc-500 hover:bg-zinc-900 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] group bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-500/20"
                    >
                      Complete Profile
                      <Sparkles className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Info Card */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-zinc-900/20 rounded-[2rem] border border-zinc-800/30 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
            <Sparkles size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Smart Match</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">Your data helps us find roommates who share your vibe and habits.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
