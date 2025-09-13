import React from 'react';
import { MonthlyBilling } from '../types';
import { 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface MonthlyBillingCardProps {
  billing: MonthlyBilling;
  onPayNow: () => void;
  onViewDetails: () => void;
}

export const MonthlyBillingCard: React.FC<MonthlyBillingCardProps> = ({
  billing,
  onPayNow,
  onViewDetails
}) => {
  const { totalSpent, receiptsCount, isPaid, dueDate, period } = billing;

  if (isPaid || totalSpent === 0) {
    return (
      <div className="bg-gradient-success rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-8 h-8" />
          <div>
            <h3 className="text-lg font-semibold">All Caught Up!</h3>
            <p className="text-green-100 text-sm">No outstanding bills for {period}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-green-100">Next scan will start new billing cycle</span>
          <button
            onClick={onViewDetails}
            className="text-white hover:text-green-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-warning rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 opacity-10">
        <CreditCard className="w-24 h-24" />
      </div>

      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <AlertCircle className="w-8 h-8" />
        <div>
          <h3 className="text-lg font-semibold">Monthly Billing</h3>
          <p className="text-orange-100 text-sm">{period} expenses ready</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
          <div className="text-orange-100 text-sm">Total Amount</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="text-2xl font-bold">{receiptsCount}</div>
          <div className="text-orange-100 text-sm">Receipts</div>
        </div>
      </div>

      {/* Due Date */}
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-4 h-4 text-orange-100" />
        <span className="text-sm text-orange-100">Due: {dueDate}</span>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={onViewDetails}
          className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center justify-center space-x-2"
        >
          <TrendingUp className="w-4 h-4" />
          <span>View Details</span>
        </button>
        <button
          onClick={onPayNow}
          className="flex-1 bg-white text-orange-600 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2 shadow-lg"
        >
          <CreditCard className="w-4 h-4" />
          <span>Pay Now</span>
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-sm text-orange-100">
          <span>Monthly Progress</span>
          <span>{receiptsCount} receipts tracked</span>
        </div>
        <div className="mt-2 w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${Math.min((receiptsCount / 10) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};