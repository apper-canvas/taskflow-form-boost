import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const Dashboard = () => {
  const ChartIcon = getIcon('BarChart');
  const UsersIcon = getIcon('Users');
  const ClockIcon = getIcon('Clock');
  const CheckCircleIcon = getIcon('CheckCircle');
  const ArrowUpIcon = getIcon('ArrowUp');
  const ArrowDownIcon = getIcon('ArrowDown');
  
  const stats = [
    { 
      title: "Total Projects", 
      value: "12", 
      change: "+8.2%", 
      isPositive: true,
      icon: ChartIcon,
      color: "primary"
    },
    { 
      title: "Team Members", 
      value: "24", 
      change: "+12%", 
      isPositive: true,
      icon: UsersIcon,
      color: "tertiary"
    },
    { 
      title: "Hours Tracked", 
      value: "186", 
      change: "-4.3%", 
      isPositive: false,
      icon: ClockIcon,
      color: "secondary"
    },
    { 
      title: "Tasks Completed", 
      value: "64", 
      change: "+23.1%", 
      isPositive: true,
      icon: CheckCircleIcon,
      color: "accent"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-3">
          <button className="btn-outline flex items-center space-x-2">
            <span>Export</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <span>New Project</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            className="card-glass hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}/15 flex items-center justify-center text-${stat.color} mb-4`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <div className="flex justify-between items-center">
              <p className="text-surface-600 dark:text-surface-300">{stat.title}</p>
              <span className={`flex items-center text-sm ${stat.isPositive ? 'text-secondary' : 'text-red-500'}`}>
                {stat.isPositive ? <ArrowUpIcon size={14} className="mr-1" /> : <ArrowDownIcon size={14} className="mr-1" />} {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;