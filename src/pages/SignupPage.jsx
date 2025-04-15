import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const { user } = await signup(email, password);
      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        email,
        createdAt: new Date(),
        photoURL: '',
        status: 'Hey there! I am using WhatsApp',
      });
      navigate('/');
    } catch (err) {
      setError('Failed to create an account');
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111B21]">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-[#202C33] text-white">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold">Sign up to WhatsApp</h2>
          <p className="text-sm text-gray-400 mt-1">Create your account and start chatting</p>
        </div>

        {error && (
          <div className="bg-red-500 text-white text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="displayName" className="block text-sm mb-1 text-gray-300">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#2A3942] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-1 text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#2A3942] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1 text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#2A3942] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              placeholder="********"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#25D366] hover:bg-[#1fa958] text-white rounded font-medium transition-colors"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 