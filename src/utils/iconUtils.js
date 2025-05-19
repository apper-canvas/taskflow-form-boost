import { 
  Check, 
  CheckSquare, 
  Calendar, 
  Plus, 
  X, 
  LogOut, 
  Clock,
  Edit,
  Folder,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  User,
  Settings,
  Trash2
} from 'lucide-react';

// Map of icon names to their components
const iconMap = {
  Check, CheckSquare, Calendar, Plus, X, LogOut, 
  Clock, Edit, Folder, AlertTriangle, ChevronRight,
  ChevronDown, User, Settings, Trash2
};

/**
 * Utility function to get icon component by name
 */
export const getIcon = (name) => {
  return iconMap[name] || null;
};