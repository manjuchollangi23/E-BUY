import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText = 'Continue Shopping', 
  actionLink = '/products' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fadeIn">
      <div className="w-24 h-24 mb-6 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
        <Icon className="text-slate-300 dark:text-slate-600 w-12 h-12" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
        {description}
      </p>
      {actionText && (
        <Link to={actionLink}>
          <Button variant="primary">
            {actionText}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
