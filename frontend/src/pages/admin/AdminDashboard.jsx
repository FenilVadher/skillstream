import { useEffect, useState } from 'react';
import { Users, BookOpen, ClipboardCheck, TrendingUp, Award, Download } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <Card>
    <CardBody className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </CardBody>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const blob = await adminService.generateBulkReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulk_report_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview of your training management system
          </p>
        </div>
        <Button onClick={handleDownloadReport} variant="outline">
          <Download size={20} />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Trainees"
          value={stats?.overview?.totalTrainees || 0}
          color="bg-blue-500"
        />
        <StatCard
          icon={BookOpen}
          title="Active Courses"
          value={stats?.overview?.totalCourses || 0}
          color="bg-green-500"
        />
        <StatCard
          icon={ClipboardCheck}
          title="Quiz Attempts"
          value={stats?.overview?.totalQuizAttempts || 0}
          subtitle={`${stats?.overview?.quizPassRate || 0}% pass rate`}
          color="bg-purple-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Course Completion"
          value={`${stats?.overview?.courseCompletionRate || 0}%`}
          subtitle={`${stats?.overview?.completedCourses || 0} completed`}
          color="bg-orange-500"
        />
      </div>

      {/* Recent Activity & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Assignments
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {stats?.recentAssignments?.length > 0 ? (
                stats.recentAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {assignment.course?.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {assignment.trainee?.name}
                      </p>
                    </div>
                    <Badge variant={assignment.status === 'completed' ? 'success' : 'warning'}>
                      {assignment.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No recent assignments
                </p>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="text-yellow-500" size={20} />
              Top Performers
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {stats?.topPerformers?.length > 0 ? (
                stats.topPerformers.map((performer, index) => (
                  <div
                    key={performer.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {performer.trainee?.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {performer.rank} • Level {performer.level}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600 dark:text-primary-400">
                        {performer.totalPoints}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">points</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No data available
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
