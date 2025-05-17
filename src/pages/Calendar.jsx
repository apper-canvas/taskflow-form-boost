import { motion } from 'framer-motion';

const Calendar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="card">Calendar content will appear here</div>
      </div>
    </motion.div>
  );
};

export default Calendar;