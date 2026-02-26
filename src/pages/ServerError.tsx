import React from 'react';
import { AlertTriangle, WifiOff } from 'lucide-react';

const ServerError = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-red-500/20 rounded-full animate-pulse"></div>
          </div>
          <WifiOff className="w-20 h-20 text-red-500 mx-auto relative z-10" />
        </div>
        
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-4">
          500
        </h1>
        
        <h2 className="text-2xl font-bold text-white mb-3">
          Server Error
        </h2>
        
        <p className="text-lg text-gray-300 mb-6">
          We're experiencing technical difficulties. Our team is working to resolve this issue.
        </p>

        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 shadow-lg">
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-100">What's happening?</p>
                <p className="text-sm text-slate-300">Our servers are currently unavailable</p>
              </div>
            </div>
            <div className="flex items-start gap-3 mt-4">
              <div className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5">⏱</div>
              <div>
                <p className="font-semibold text-slate-100">How long?</p>
                <p className="text-sm text-slate-300">We're working on a fix and will be back soon</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-8">
          Error Code: {new Date().getTime().toString().slice(-6)}
        </p>
      </div>
    </div>
  );
};

export default ServerError;
