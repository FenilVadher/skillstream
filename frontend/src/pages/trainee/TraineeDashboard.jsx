import { useEffect, useState } from 'react';
import { BookOpen, Trophy, Target, TrendingUp, Clock, Award } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { gamificationService } from '../../services/gamificationService';
import { analyticsService } from '../../services/analyticsService';
import { progressService } from '../../services/progressService';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <Card>
    <CardBody className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </CardBody>
  </Card>
);

const TraineeDashboard = () => {
  const [gamificationStats, setGamificationStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [engagement, setEngagement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [gamification, recs, eng] = await Promise.all([
        gamificationService.getMyStats(),
        analyticsService.getSavedRecommendations(),
        analyticsService.getEngagementAnalytics(),
      ]);
      setGamificationStats(gamification.data);
      setRecommendations(recs.data.slice(0, 3));
      setEngagement(eng.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your learning progress and achievements
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Trophy}
          title="Total Points"
          value={gamificationStats?.totalPoints || 0}
          color="bg-yellow-500"
        />
        <StatCard
          icon={Target}
          title="Current Level"
          value={gamificationStats?.level || 1}
          color="bg-blue-500"
        />
        <StatCard
          icon={BookOpen}
          title="Courses Completed"
          value={gamificationStats?.coursesCompleted || 0}
          color="bg-green-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Average Score"
          value={`${gamificationStats?.averageScore || 0}%`}
          color="bg-purple-500"
        />
      </div>

      {/* Rank & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Rank */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Current Rank
            </h2>
          </CardHeader>
          <CardBody className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4">
              <Award size={48} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {gamificationStats?.rank || 'Beginner'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Rank #{gamificationStats?.rankPosition || '-'} of {gamificationStats?.totalUsers || '-'}
            </p>
            <div className="mt-4">
              <Badge variant="primary" className="text-sm">
                🔥 {gamificationStats?.streak || 0} day streak
              </Badge>
            </div>
          </CardBody>
        </Card>

        {/* Learning Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Learning Progress
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Overall Completion
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {engagement?.completionRate || 0}%
                </span>
              </div>
              <ProgressBar value={engagement?.completionRate || 0} showLabel={false} />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {engagement?.completedMaterials || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {engagement?.inProgressMaterials || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {engagement?.totalMaterials || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Clock size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total time spent: {Math.floor((engagement?.totalTimeSpent || 0) / 60)} minutes
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Badges & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Badges */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Badges
            </h2>
          </CardHeader>
          <CardBody>
            {gamificationStats?.badges && gamificationStats.badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {gamificationStats.badges.slice(0, 6).map((badge, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <span className="text-3xl mb-2">{badge.icon || '🏆'}</span>
                    <p className="text-xs text-center font-medium text-gray-900 dark:text-white">
                      {badge.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No badges earned yet. Keep learning!
              </p>
            )}
          </CardBody>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Recommendations
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {rec.course?.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {rec.reason}
                        </p>
                      </div>
                      <Badge variant="primary">{rec.score}%</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No recommendations available
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default TraineeDashboard;
