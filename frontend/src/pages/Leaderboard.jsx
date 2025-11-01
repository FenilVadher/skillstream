import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { gamificationService } from '../services/gamificationService';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await gamificationService.getLeaderboard(50);
      setLeaderboard(data);
    } catch (error) {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position) => {
    if (position === 1) return <Trophy className="text-yellow-500" size={24} />;
    if (position === 2) return <Medal className="text-gray-400" size={24} />;
    if (position === 3) return <Medal className="text-orange-600" size={24} />;
    return null;
  };

  const getRankBadge = (rank) => {
    const rankColors = {
      'Beginner': 'default',
      'Learner': 'info',
      'Explorer': 'primary',
      'Achiever': 'success',
      'Expert': 'warning',
      'Master': 'danger',
      'Legend': 'danger',
    };
    return rankColors[rank] || 'default';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
          <Trophy size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Top performers in the training system
        </p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center pt-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <div className="w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 text-center">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {leaderboard[1]?.trainee?.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {leaderboard[1]?.totalPoints} pts
              </p>
              <Badge variant={getRankBadge(leaderboard[1]?.rank)} className="mt-2">
                {leaderboard[1]?.rank}
              </Badge>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-3 ring-4 ring-yellow-200 dark:ring-yellow-900">
              <Trophy size={40} className="text-white" />
            </div>
            <div className="w-full bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 text-center border-2 border-yellow-400">
              <p className="font-bold text-gray-900 dark:text-white truncate">
                {leaderboard[0]?.trainee?.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {leaderboard[0]?.totalPoints} pts
              </p>
              <Badge variant={getRankBadge(leaderboard[0]?.rank)} className="mt-2">
                {leaderboard[0]?.rank}
              </Badge>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center pt-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <div className="w-full bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 text-center">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {leaderboard[2]?.trainee?.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {leaderboard[2]?.totalPoints} pts
              </p>
              <Badge variant={getRankBadge(leaderboard[2]?.rank)} className="mt-2">
                {leaderboard[2]?.rank}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Rankings
          </h2>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trainee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Avg Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboard.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getRankIcon(index + 1)}
                        <span className="font-semibold text-gray-900 dark:text-white">
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-400 font-semibold">
                            {entry.trainee?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {entry.trainee?.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {entry.trainee?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-primary-600" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {entry.level}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getRankBadge(entry.rank)}>
                        {entry.rank}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-primary-600 dark:text-primary-400">
                        {entry.totalPoints}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      {entry.coursesCompleted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      {entry.averageScore}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Leaderboard;
