import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Login failed';
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
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your TravelHub account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              Sign In
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <a
              href="/register"
              className="text-primary font-semibold hover:text-primary-dark"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
