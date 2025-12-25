import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateOfBirthPickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (value: string) => void;
  error?: string;
  maxDate?: Date;
  minAge?: number;
  maxAge?: number;
  className?: string;
}

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export const DateOfBirthPicker: React.FC<DateOfBirthPickerProps> = ({
  value,
  onChange,
  error,
  maxDate = new Date(),
  minAge = 0,
  maxAge = 120,
  className = '',
}) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-');
      setYear(y || '');
      setMonth(m || '');
      setDay(d || '');
    }
  }, [value]);

  // Generate year options (from maxAge years ago to minAge years ago)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: maxAge - minAge + 1 },
    (_, i) => currentYear - minAge - i
  );

  // Generate day options based on selected month and year
  const getDaysInMonth = (month: string, year: string): number => {
    if (!month || !year) return 31;
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  };

  const daysInMonth = getDaysInMonth(month, year);
  const days = Array.from({ length: daysInMonth }, (_, i) => 
    String(i + 1).padStart(2, '0')
  );

  // Update parent when all fields are filled
  useEffect(() => {
    if (day && month && year) {
      const dateString = `${year}-${month}-${day}`;
      // Validate the date
      const date = new Date(dateString);
      if (date <= maxDate) {
        onChange(dateString);
      }
    } else if (!day && !month && !year) {
      onChange('');
    }
  }, [day, month, year, onChange, maxDate]);

  // Adjust day if it exceeds days in the selected month
  useEffect(() => {
    if (day && parseInt(day) > daysInMonth) {
      setDay(String(daysInMonth).padStart(2, '0'));
    }
  }, [month, year, day, daysInMonth]);

  const selectClassName = `
    appearance-none bg-white border rounded-lg px-3 py-3 pr-8
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    transition-colors cursor-pointer
    text-slate-700 font-medium
    ${error ? 'border-red-500' : 'border-slate-300 hover:border-slate-400'}
  `;

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-5 h-5 text-slate-400" />
        <span className="text-sm font-medium text-slate-700">Date of Birth</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {/* Day */}
        <div className="relative">
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={selectClassName}
            aria-label="Day"
          >
            <option value="">Day</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {parseInt(d)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Month */}
        <div className="relative">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={selectClassName}
            aria-label="Month"
          >
            <option value="">Month</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Year */}
        <div className="relative">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={selectClassName}
            aria-label="Year"
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default DateOfBirthPicker;

