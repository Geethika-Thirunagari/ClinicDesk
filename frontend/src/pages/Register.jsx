import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '',
    confirmPassword: '',
    role: 'patient'
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      // API call to register
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/login');
    } catch (error) {
      setErrors({ form: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Create an account</h2>
        <p className="text-slate-500 mt-2">Join ClinicDesk to manage your healthcare practice.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100">
            {errors.form}
          </div>
        )}

        <Input
          label="Full Name"
          type="text"
          icon={User}
          placeholder="Dr. Sarah Smith"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          error={errors.fullName}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 ml-1 mb-2">I am a</label>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input type="radio" className="peer sr-only" name="role" value="patient" checked={formData.role === 'patient'} onChange={() => setFormData({...formData, role: 'patient'})} />
              <div className="rounded-xl border border-slate-200 bg-white/50 p-3 text-center hover:bg-white/80 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all shadow-sm">
                <span className="text-sm font-medium">Patient</span>
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input type="radio" className="peer sr-only" name="role" value="doctor" checked={formData.role === 'doctor'} onChange={() => setFormData({...formData, role: 'doctor'})} />
              <div className="rounded-xl border border-slate-200 bg-white/50 p-3 text-center hover:bg-white/80 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all shadow-sm">
                <span className="text-sm font-medium">Doctor</span>
              </div>
            </label>
          </div>
        </div>

        <Input
          label="Email address"
          type="email"
          icon={Mail}
          placeholder="sarah@clinicdesk.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
        />

        <Button 
          type="submit" 
          className="w-full text-base py-6 rounded-xl mt-6" 
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
