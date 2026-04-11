import React from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { LogIn, LogOut, User as UserIcon, Shield, LayoutDashboard, Settings, History } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Ensure user document exists in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'user',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          });
        } else {
          await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
        }
      }
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => signOut(auth);

  return { user, loading, loginWithGoogle, logout };
};

export function AuthButton() {
  const { user, loginWithGoogle, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!user) {
    return (
      <button
        onClick={loginWithGoogle}
        className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white font-bold rounded-xl hover:bg-sky-600 transition-all shadow-sm"
      >
        <LogIn className="w-4 h-4" />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 pr-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-all border border-slate-200"
      >
        <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-white shadow-sm" referrerPolicy="no-referrer" />
        <span className="text-sm font-bold text-slate-700 hidden sm:block">{user.displayName?.split(' ')[0]}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-2">
            <div className="px-4 py-3 border-b border-slate-100 mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
              <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
            </div>
            
            <Link 
              to="/dashboard" 
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-sky-500 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            
            <Link 
              to="/dashboard/history" 
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-sky-500 transition-colors"
            >
              <History className="w-4 h-4" />
              <span className="text-sm font-medium">Tool History</span>
            </Link>

            <Link 
              to="/dashboard/settings" 
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-sky-500 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
            </Link>

            <div className="border-t border-slate-100 mt-2 pt-2">
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-bold">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
