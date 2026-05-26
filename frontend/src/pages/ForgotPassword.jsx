import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // API call to send reset email
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSent(true);
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Check your email</h2>
        <p className="text-slate-500 mb-8">
          We sent a password reset link to <br/><span className="font-medium text-slate-700">{email}</span>
        </p>
        <Link to="/login">
          <Button variant="outline" className="w-full">
            Back to login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Forgot password</h2>
        <p className="text-slate-500 mt-2">Enter your email and we'll send you a link to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email address"
          type="email"
          icon={Mail}
          placeholder="admin@clinicdesk.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />

        <Button 
          type="submit" 
          className="w-full text-base py-6 rounded-xl" 
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send reset link'}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to login
        </Link>
      </div>
    </>
  );
};

export default ForgotPassword;
