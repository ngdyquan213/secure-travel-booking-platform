import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.full_name);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Registration failed';
      setErrors({ submit: message });
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white text-3xl mx-auto mb-4">
              ✈
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Join TravelHub and start exploring</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="full_name"
              type="text"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={handleChange}
              icon={<User size={20} />}
              required
              error={errors.full_name}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail size={20} />}
              required
              error={errors.email}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock size={20} />}
              required
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<Lock size={20} />}
              required
              error={errors.confirmPassword}
            />

            {errors.submit && (
              <div className="p-3 bg-error bg-opacity-10 border border-error text-error rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              loading={isLoading}
              className="w-full"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-primary font-semibold hover:text-primary-dark"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
