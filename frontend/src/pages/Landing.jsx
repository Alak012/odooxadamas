import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Zap, Clock, CalendarDays, Wallet, Building } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
              <Building size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              HRMS
            </span>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/login"
              className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 text-sm transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-2 rounded-lg transition-colors shadow-sm text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight">
            Human Resource <br className="hidden sm:block" /> Management System
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Streamline your workforce management with automated payroll computation, real-time attendance tracking, and secure role-based access — all in one platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/signup"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-md text-sm"
            >
              Start Free Trial
            </Link>
            <Link 
              to="/login"
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3 rounded-lg transition-colors shadow-sm text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white py-16 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900">Everything you need to manage your team</h2>
              <p className="text-slate-500 mt-2 text-sm">Built for growing companies that need a reliable, all-in-one HR solution.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: ShieldCheck, title: 'Secure RBAC', desc: 'Role-based access control with JWT authentication. Employees see only their data; Admins manage everything.' },
                { icon: Clock, title: 'Real-Time Attendance', desc: 'Check In / Check Out system with live status indicators. Track working hours and break times automatically.' },
                { icon: Wallet, title: 'Automated Payroll', desc: 'Auto-compute Basic, HRA, PF, LTA, Professional Tax and Fixed Allowance from a single wage input.' },
                { icon: Users, title: 'Employee Directory', desc: 'Visual employee cards with status indicators. Click any card to view full profile in read-only mode.' },
                { icon: CalendarDays, title: 'Leave Management', desc: 'Paid, Sick, and Unpaid leave types. Employees request, Admins approve/reject with one click.' },
                { icon: Zap, title: 'Auto-Generated IDs', desc: 'System generates employee IDs (OIJODO20260001), temporary passwords, and handles first-login password changes.' },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="p-5 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center mb-3 border border-primary-100">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} HRMS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
