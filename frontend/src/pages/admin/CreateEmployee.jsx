import React, { useState } from 'react';
import { UserPlus, Copy, Check } from 'lucide-react';

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    role: 'Employee',
    department: '',
    phone: '',
    jobPosition: '',
    gender: 'Male',
    location: '',
    workingDaysPerWeek: 5,
    breakTimeHrs: 1.0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessData(null);
    setCopied(false);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create employee');
      }

      setSuccessData(data);
      setFormData({ 
        email: '', displayName: '', role: 'Employee', department: '', 
        phone: '', jobPosition: '', gender: 'Male', location: '', 
        workingDaysPerWeek: 5, breakTimeHrs: 1.0 
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = `Email: ${successData.user.email}\nPassword: ${successData.generatedPassword}\nEmployee ID: ${successData.user.employeeId}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Add New Employee</h2>
        <p className="text-slate-500 text-sm mt-1">Create an account for a new team member. A secure password will be auto-generated.</p>
      </div>

      <div className="saas-panel p-6 bg-white border border-slate-200">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-100 flex items-start gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        {successData && (
          <div className="mb-6 p-5 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-emerald-800 font-semibold text-lg flex items-center gap-2">
                  <Check size={20} className="text-emerald-600" />
                  Employee Created Successfully
                </h3>
                <p className="text-emerald-600 text-sm mt-1">Please securely share these credentials with the employee.</p>
              </div>
              <button 
                onClick={handleCopy}
                className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-md transition-colors flex items-center gap-1 text-sm font-medium"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-emerald-200/60 font-mono text-sm text-slate-700 space-y-2">
              <div className="flex"><span className="w-24 text-slate-400">EMP ID:</span> <span className="font-semibold text-slate-800">{successData.user.employeeId}</span></div>
              <div className="flex"><span className="w-24 text-slate-400">Email:</span> <span className="font-semibold text-slate-800">{successData.user.email}</span></div>
              <div className="flex"><span className="w-24 text-slate-400">Password:</span> <span className="font-semibold text-slate-800">{successData.generatedPassword}</span></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Primary Details */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input 
                type="text" name="displayName" value={formData.displayName} onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm"
                placeholder="John Doe" required
              />
            </div>
            
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm"
                placeholder="john.doe@company.com" required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
              <input 
                type="tel" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm"
                placeholder="+1 234 567 890" required
              />
            </div>

            {/* Employment Details */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
              <input 
                type="text" name="department" value={formData.department} onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm"
                placeholder="Engineering" required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Position</label>
              <input 
                type="text" name="jobPosition" value={formData.jobPosition} onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm"
                placeholder="Senior Developer" required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Work Location</label>
              <input 
                type="text" name="location" value={formData.location} onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm"
                placeholder="New York HQ / Remote" required
              />
            </div>

            {/* Additional Specs */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Working Days per Week</label>
              <input 
                type="number" min="1" max="7" name="workingDaysPerWeek" value={formData.workingDaysPerWeek} onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Daily Break Time (Hrs)</label>
              <input 
                type="number" step="0.5" min="0" max="4" name="breakTimeHrs" value={formData.breakTimeHrs} onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
              <select 
                name="gender" value={formData.gender} onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">System Role & Access</label>
              <select 
                name="role" value={formData.role} onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm"
              >
                <option value="Employee">Employee (Dashboard, Attendance, Leave Requests)</option>
                <option value="Admin">Admin (Full System Access & Payroll)</option>
              </select>
            </div>
          </div>
          
          <div className="pt-2 border-t border-slate-100 mt-2 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <UserPlus size={18} />
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployee;
