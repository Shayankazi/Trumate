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
  Check,
  ArrowRight,
  Loader2,
  Edit2,
  Lock,
  LogOut,
  Mail,
  ChevronLeft,
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
          headers: { Authorization: `Bearer ${token}` },
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
          setIsEditing(!(data.images?.length > 0 && data.name));
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

    if (token) fetchProfile();
  }, [token, user?.name]);

  const interestsList = [
    'Music', 'Travel', 'Cooking', 'Art', 'Gaming',
    'Movies', 'Fitness', 'Photography', 'Reading', 'Coding',
    'Dancing', 'Yoga', 'Hiking', 'Anime', 'Politics',
  ];

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const firstName = formData.name.split(' ')[0] || 'User';
      const finalImages = formData.images[0]
        ? formData.images
        : [`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || firstName)}&size=256&background=D94F1E&color=ffffff&bold=true&format=svg`];

      const response = await fetch(apiUrl('/api/users/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D94F1E] animate-spin" />
      </div>
    );
  }

  // Profile view
  if (!isEditing && !showPasswordReset) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] pb-10">
        <div className="max-w-xl mx-auto px-5 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#E8E5DF]"
          >
            {/* Cover */}
            <div className="h-44 bg-gradient-to-br from-[#FEF0EB] to-[#F0EDFF] relative rounded-t-2xl">
              <button
                onClick={() => navigate('/discover')}
                className="absolute top-4 left-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-xl border border-white flex items-center justify-center text-[#706B64] hover:text-[#1A1714] transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => logout()}
                className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-xl border border-white flex items-center justify-center text-[#D94F1E] hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>

            {/* Avatar row */}
            <div className="px-5 pb-5">
              <div className="flex items-end gap-4 -mt-12 mb-4 relative z-10">
                <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden shadow-md flex-shrink-0">
                  <img
                    src={formData.images[0] || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&size=256&background=D94F1E&color=ffffff&bold=true`}
                    alt={formData.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="pb-2">
                  <h1 className="text-xl font-bold text-[#1A1714]">
                    {formData.name}, {formData.age}
                  </h1>
                  <span className="text-xs font-medium text-[#D94F1E] capitalize">{user?.role}</span>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {[
                  { Icon: Mail, label: 'Email', value: user?.email },
                  { Icon: MapPin, label: 'Location', value: formData.location.city },
                  { Icon: GraduationCap, label: 'College', value: formData.college },
                  { Icon: Book, label: 'Major', value: formData.major },
                ].map(({ Icon, label, value }) => (
                  <div
                    key={label}
                    className="p-3 bg-[#F8F6F2] rounded-xl border border-[#E8E5DF]"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={12} className="text-[#D94F1E]" />
                      <span className="text-[10px] font-medium text-[#A09890]">{label}</span>
                    </div>
                    <p className="text-sm font-medium text-[#1A1714] truncate">{value || '—'}</p>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-[#706B64] mb-2">About me</h3>
                <p className="text-sm text-[#706B64] leading-relaxed bg-[#F8F6F2] rounded-xl p-3 border border-[#E8E5DF]">
                  {formData.bio || 'No bio yet.'}
                </p>
              </div>

              {/* Interests */}
              {formData.interests.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-semibold text-[#706B64] mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.interests.map((i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-[#FEF0EB] text-[#D94F1E] rounded-lg text-xs font-medium border border-[#F5C4B2]"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1A1714] text-white rounded-xl text-sm font-semibold hover:bg-[#2d2926] transition-colors"
                >
                  <Edit2 size={15} />
                  Edit profile
                </button>
                <button
                  onClick={() => setShowPasswordReset(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#F8F6F2] text-[#706B64] rounded-xl text-sm font-semibold hover:bg-[#F0EDE8] border border-[#E8E5DF] transition-colors"
                >
                  <Lock size={15} />
                  Security
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Password reset
  if (showPasswordReset) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-white rounded-2xl border border-[#E8E5DF] p-7"
        >
          <button
            onClick={() => { setShowPasswordReset(false); setResetMessage(''); }}
            className="flex items-center gap-1.5 text-sm text-[#706B64] hover:text-[#1A1714] transition-colors mb-7"
          >
            <ChevronLeft size={18} />
            Back to profile
          </button>

          <div className="mb-7">
            <div className="w-12 h-12 bg-[#FEF0EB] rounded-xl flex items-center justify-center mb-4">
              <Lock className="text-[#D94F1E] w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[#1A1714]">Change password</h2>
            <p className="text-[#706B64] text-sm mt-1">Keep your account secure</p>
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1714] mb-1.5">
                Current password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#F8F6F2] border border-[#E8E5DF] rounded-xl px-4 py-3 text-[#1A1714] text-sm focus:outline-none focus:ring-2 focus:ring-[#D94F1E]/30 focus:border-[#D94F1E] transition-all"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1714] mb-1.5">
                New password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#F8F6F2] border border-[#E8E5DF] rounded-xl px-4 py-3 text-[#1A1714] text-sm focus:outline-none focus:ring-2 focus:ring-[#D94F1E]/30 focus:border-[#D94F1E] transition-all"
                placeholder="••••••••"
              />
            </div>

            {resetMessage && (
              <p
                className={`text-sm font-medium text-center ${
                  resetMessage.includes('successfully') ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {resetMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#1A1714] text-white font-semibold rounded-xl hover:bg-[#2d2926] transition-colors text-sm mt-1"
            >
              Update password
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Profile setup / edit form
  return (
    <div className="min-h-screen bg-[#F8F6F2] py-10 px-5">
      <div className="max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#E8E5DF] p-7"
        >
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      step > s
                        ? 'bg-[#1A1714] text-white'
                        : step === s
                        ? 'bg-[#D94F1E] text-white'
                        : 'bg-[#F0EDE8] text-[#A09890]'
                    }`}
                  >
                    {step > s ? <Check size={13} /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-8 h-0.5 rounded-full ${
                        step > s ? 'bg-[#1A1714]' : 'bg-[#E8E5DF]'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <span className="text-xs text-[#A09890] font-medium">Step {step} of 3</span>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="space-y-5"
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#1A1714]">Personal details</h2>
                    <p className="text-[#706B64] text-sm mt-1">Let's start with the basics.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1714] mb-1.5">Age</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A09890] w-4 h-4" />
                        <input
                          type="number"
                          min="18"
                          max="99"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                          className="w-full bg-[#F8F6F2] border border-[#E8E5DF] rounded-xl pl-9 pr-3 py-3 text-[#1A1714] text-sm focus:outline-none focus:ring-2 focus:ring-[#D94F1E]/30 focus:border-[#D94F1E] transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1714] mb-1.5">City</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A09890] w-4 h-4" />
                        <input
                          type="text"
                          value={formData.location.city}
                          onChange={(e) =>
                            setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })
                          }
                          className="w-full bg-[#F8F6F2] border border-[#E8E5DF] rounded-xl pl-9 pr-3 py-3 text-[#1A1714] text-sm focus:outline-none focus:ring-2 focus:ring-[#D94F1E]/30 focus:border-[#D94F1E] transition-all"
                          placeholder="Pune"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1714] mb-1.5">Gender</label>
                    <div className="flex gap-2">
                      {['Man', 'Woman', 'Non-binary'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: val })}
                          className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                            formData.gender === val
                              ? 'bg-[#1A1714] text-white border-[#1A1714]'
                              : 'bg-[#F8F6F2] border-[#E8E5DF] text-[#706B64] hover:border-[#D8D4CC]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1714] mb-1.5">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-[#F8F6F2] border border-[#E8E5DF] rounded-xl px-4 py-3 text-[#1A1714] text-sm focus:outline-none focus:ring-2 focus:ring-[#D94F1E]/30 focus:border-[#D94F1E] h-28 resize-none transition-all"
                      placeholder="What makes you a great roommate?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1714] mb-1.5">
                      Profile photo URL
                      <span className="text-[#A09890] font-normal ml-1">(optional)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.images[0]}
                      onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                      className="w-full bg-[#F8F6F2] border border-[#E8E5DF] rounded-xl px-4 py-3 text-[#1A1714] text-sm focus:outline-none focus:ring-2 focus:ring-[#D94F1E]/30 focus:border-[#D94F1E] transition-all"
                      placeholder="https://example.com/your-photo.jpg"
                    />
                    {formData.images[0] && (
                      <div className="mt-2 flex items-center gap-2">
                        <img
                          src={formData.images[0]}
                          alt="Preview"
                          className="w-10 h-10 rounded-lg object-cover border border-[#E8E5DF]"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <span className="text-xs text-[#A09890]">Preview</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full flex items-center justify-center gap-2 bg-[#D94F1E] text-white font-semibold py-3.5 rounded-xl hover:bg-[#C2441A] transition-colors"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="space-y-5"
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#1A1714]">Academic info</h2>
                    <p className="text-[#706B64] text-sm mt-1">Tell us about your student life.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1714] mb-1.5">Major</label>
                    <div className="relative">
                      <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A09890] w-4 h-4" />
                      <input
                        type="text"
                        value={formData.major}
                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                        className="w-full bg-[#F8F6F2] border border-[#E8E5DF] rounded-xl pl-9 pr-4 py-3 text-[#1A1714] text-sm focus:outline-none focus:ring-2 focus:ring-[#D94F1E]/30 focus:border-[#D94F1E] transition-all"
                        placeholder="Computer Engineering"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1714] mb-1.5">College</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A09890] w-4 h-4" />
                      <input
                        type="text"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        className="w-full bg-[#F8F6F2] border border-[#E8E5DF] rounded-xl pl-9 pr-4 py-3 text-[#1A1714] text-sm focus:outline-none focus:ring-2 focus:ring-[#D94F1E]/30 focus:border-[#D94F1E] transition-all"
                        placeholder="MIT World Peace University"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1714] mb-1.5">Year of study</label>
                    <div className="flex flex-wrap gap-2">
                      {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFormData({ ...formData, year: val })}
                          className={`px-3.5 py-2 rounded-lg border text-sm font-medium transition-all ${
                            formData.year === val
                              ? 'bg-[#1A1714] text-white border-[#1A1714]'
                              : 'bg-[#F8F6F2] border-[#E8E5DF] text-[#706B64] hover:border-[#D8D4CC]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {user?.role === 'owner' && (
                    <div>
                      <label className="block text-sm font-medium text-[#1A1714] mb-1.5">
                        Monthly rent (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.rent}
                        onChange={(e) => setFormData({ ...formData, rent: parseInt(e.target.value) })}
                        className="w-full bg-[#F8F6F2] border border-[#E8E5DF] rounded-xl px-4 py-3 text-[#1A1714] text-sm focus:outline-none focus:ring-2 focus:ring-[#D94F1E]/30 focus:border-[#D94F1E] transition-all"
                      />
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-3 rounded-xl border border-[#E8E5DF] text-sm font-medium text-[#706B64] hover:bg-[#F0EDE8] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-[2] flex items-center justify-center gap-2 bg-[#D94F1E] text-white font-semibold py-3 rounded-xl hover:bg-[#C2441A] transition-colors text-sm"
                    >
                      Almost there
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="space-y-5"
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#1A1714]">Your lifestyle</h2>
                    <p className="text-[#706B64] text-sm mt-1">What's it like living with you?</p>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1714] mb-2">Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {interestsList.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            formData.interests.includes(interest)
                              ? 'bg-[#FEF0EB] border-[#D94F1E] text-[#D94F1E]'
                              : 'bg-[#F8F6F2] border-[#E8E5DF] text-[#706B64] hover:border-[#D8D4CC]'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferences toggles */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1714] mb-2">Preferences</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Smoking', key: 'smoking' },
                        { label: 'Drinking', key: 'drinking' },
                        { label: 'Gaming', key: 'gaming' },
                        { label: 'Guests ok', key: 'guests' },
                      ].map((pref) => {
                        const val = formData.preferences[pref.key as keyof typeof formData.preferences];
                        return (
                          <button
                            key={pref.key}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                preferences: {
                                  ...formData.preferences,
                                  [pref.key]: !val,
                                },
                              })
                            }
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                              val
                                ? 'bg-[#FEF0EB] border-[#D94F1E] text-[#D94F1E]'
                                : 'bg-[#F8F6F2] border-[#E8E5DF] text-[#706B64] hover:border-[#D8D4CC]'
                            }`}
                          >
                            {pref.label}
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                val ? 'bg-[#D94F1E] border-[#D94F1E]' : 'border-[#D8D4CC]'
                              }`}
                            >
                              {val && <Check size={10} className="text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dropdowns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1714] mb-1.5">Pets</label>
                      <select
                        value={formData.preferences.pets}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              pets: e.target.value as 'yes' | 'no' | 'love_them',
                            },
                          })
                        }
                        className="w-full bg-[#F8F6F2] border border-[#E8E5DF] rounded-xl px-3 py-3 text-[#1A1714] text-sm outline-none appearance-none"
                      >
                        <option value="no">No pets</option>
                        <option value="yes">Have pets</option>
                        <option value="love_them">Love pets</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1714] mb-1.5">Diet</label>
                      <select
                        value={formData.preferences.diet}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              diet: e.target.value as 'vegan' | 'vegetarian' | 'non_veg' | 'anything',
                            },
                          })
                        }
                        className="w-full bg-[#F8F6F2] border border-[#E8E5DF] rounded-xl px-3 py-3 text-[#1A1714] text-sm outline-none appearance-none"
                      >
                        <option value="anything">Anything</option>
                        <option value="non_veg">Non-veg</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-3 rounded-xl border border-[#E8E5DF] text-sm font-medium text-[#706B64] hover:bg-[#F0EDE8] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] flex items-center justify-center gap-2 bg-[#1A1714] text-white font-semibold py-3 rounded-xl hover:bg-[#2d2926] transition-colors text-sm"
                    >
                      Save profile
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
