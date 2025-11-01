import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Trophy,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { cn } from '../../utils/cn';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { to: '/admin/quizzes', icon: ClipboardList, label: 'Quizzes' },
    { to: '/admin/trainees', icon: Users, label: 'Trainees' },
    { to: '/admin/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const traineeLinks = [
    { to: '/trainee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/trainee/courses', icon: BookOpen, label: 'My Courses' },
    { to: '/trainee/quizzes', icon: ClipboardList, label: 'Quizzes' },
    { to: '/trainee/progress', icon: BarChart3, label: 'Progress' },
    { to: '/trainee/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/trainee/recommendations', icon: Sparkles, label: 'AI Recommendations' },
  ];

  const links = user?.role === 'admin' ? adminLinks : traineeLinks;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen transition-transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
          'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
              AI Training System
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {user?.role === 'admin' ? 'Admin Panel' : 'Trainee Portal'}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )
                    }
                  >
                    <link.icon size={20} />
                    <span className="font-medium">{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
