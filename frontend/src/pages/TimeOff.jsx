import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Calendar, AlertCircle } from 'lucide-react';

const TimeOff = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [myLeaves, setMyLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  
  const [formData, setFormData] = useState({
    type: 'Paid',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const isAdmin = user?.role === 'Admin';

  const fetchMyLeaves = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leave/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setMyLeaves(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const fetchAllLeaves = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leave/all', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setAllLeaves(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchMyLeaves();
    if (isAdmin) fetchAllLeaves();
  }, [isAdmin]);

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/leave/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to apply');
      alert('Leave requested successfully!');
      setFormData({ type: 'Paid', startDate: '', endDate: '', reason: '' });
      fetchMyLeaves();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/leave/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchAllLeaves();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Time Off & Leaves</h1>
          <p className="text-slate-500 mt-1">Manage your absences and track balances.</p>
        </div>
        {!isAdmin && (
          <div className="text-right">
            <p className="text-sm font-bold text-slate-400 uppercase">Available Balance</p>
            <p className="text-3xl font-black text-indigo-600">
              {Math.max(0, (user?.totalLeavesAllowed || 20) - (user?.leavesTaken || 0))} 
              <span className="text-sm font-semibold text-slate-500 ml-1">Days</span>
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Leave Application Form */}
        {!isAdmin && (
          <Card className="p-6 col-span-1 border-indigo-100 shadow-indigo-100/50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-indigo-500" /> Apply for Leave
            </h3>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Leave Type</label>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Paid">Paid Time Off</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date</label>
                  <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">End Date</label>
                  <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Reason</label>
                <textarea required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]" placeholder="Explain briefly..."></textarea>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </Card>
        )}

        {/* My Leaves List (For Employee) */}
        {!isAdmin && (
          <Card className="p-6 col-span-2">
            <h3 className="text-xl font-bold mb-4">My Request History</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {myLeaves.length === 0 ? <p className="text-slate-500">No requests found.</p> : myLeaves.map(leave => (
                <div key={leave.id} className="border border-slate-100 p-4 rounded-xl flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-800">{leave.type} Leave</p>
                    <p className="text-sm text-slate-500">{new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</p>
                    <p className="text-sm mt-2 text-slate-600 italic">"{leave.reason}"</p>
                  </div>
                  <div>
                    {leave.status === 'Pending' && <span className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full text-xs">Pending</span>}
                    {leave.status === 'Approved' && <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">Approved</span>}
                    {leave.status === 'Rejected' && <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-xs">Rejected</span>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Admin Approval Dashboard */}
        {isAdmin && (
          <Card className="p-6 col-span-3">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900">
              <AlertCircle size={20} className="text-indigo-500" /> Pending Approvals
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 text-sm font-bold text-slate-400">Employee</th>
                    <th className="pb-3 text-sm font-bold text-slate-400">Dates</th>
                    <th className="pb-3 text-sm font-bold text-slate-400">Reason</th>
                    <th className="pb-3 text-sm font-bold text-slate-400">Status</th>
                    <th className="pb-3 text-sm font-bold text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allLeaves.length === 0 ? (
                    <tr><td colSpan="5" className="py-4 text-center text-slate-500">No pending leave requests.</td></tr>
                  ) : (
                    allLeaves.map(leave => (
                      <tr key={leave.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 font-semibold text-slate-800">
                          {leave.user?.displayName} <br/>
                          <span className="text-xs font-normal text-slate-500">{leave.user?.department}</span>
                        </td>
                        <td className="py-3 text-sm text-slate-600">
                          {new Date(leave.startDate).toLocaleDateString()} <br/>to<br/> {new Date(leave.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-sm text-slate-600 max-w-xs truncate" title={leave.reason}>{leave.reason}</td>
                        <td className="py-3">
                          <span className={`font-bold px-2 py-1 rounded text-xs ${leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : leave.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button 
                            disabled={leave.status === 'Approved'}
                            onClick={() => handleStatusChange(leave.id, 'Approved')}
                            className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button 
                            disabled={leave.status === 'Rejected'}
                            onClick={() => handleStatusChange(leave.id, 'Rejected')}
                            className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

export default TimeOff;
