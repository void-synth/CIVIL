/**
 * Dashboard Page
 * 
 * Main landing page and navigation hub for CIVIL.
 * Provides access to all features with modern UI
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const navigate = useNavigate();
  const [recordId, setRecordId] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (recordId.trim()) {
      navigate(`/verify/${recordId.trim()}`);
    }
  };

  const quickActions = [
    {
      icon: '📝',
      title: 'Create Truth Record',
      description: 'Seal a new event into an immutable truth record',
      path: '/create',
      color: 'primary',
    },
    {
      icon: '💭',
      title: 'Memories',
      description: 'View and manage your memory records',
      path: '/memories',
      color: 'blue',
    },
    {
      icon: '🎯',
      title: 'Milestones',
      description: 'Mark significant life events',
      path: '/milestones',
      color: 'purple',
    },
    {
      icon: '📮',
      title: 'Posthumous Delivery',
      description: 'Configure delivery of memories after death',
      path: '/posthumous',
      color: 'gray',
    },
  ];

  const features = [
    {
      icon: '🔒',
      title: 'Immutable',
      description: 'Once sealed, records cannot be modified without detection',
    },
    {
      icon: '✅',
      title: 'Verifiable',
      description: 'Anyone can verify records independently, without CIVIL servers',
    },
    {
      icon: '👤',
      title: 'Owned',
      description: 'You own your records. CIVIL cannot modify or claim ownership',
    },
    {
      icon: '🔐',
      title: 'Private',
      description: 'Records are private by default, shareable by choice',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <header className="text-center mb-12 py-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          CIVIL
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A neutral system for sealing real-world events into verifiable truth records
        </p>
      </header>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Card
              key={action.path}
              hover
              onClick={() => navigate(action.path)}
              className="text-center"
            >
              <div className="text-5xl mb-4">{action.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600">
                {action.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Verify Record */}
      <Card className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Verify a Record</h2>
        <p className="text-gray-600 mb-6">
          Enter a record ID to verify its integrity and authenticity
        </p>
        <form onSubmit={handleVerify} className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={recordId}
              onChange={(e) => setRecordId(e.target.value)}
              placeholder="Enter record ID (UUID)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <Button type="submit" variant="primary" size="lg">
            Verify
          </Button>
        </form>
      </Card>

      {/* About CIVIL */}
      <Card>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">About CIVIL</h2>
        <p className="text-gray-700 mb-8">
          CIVIL is a neutral cryptographic system for preserving truth. It provides cryptographic proof
          that something was recorded at a specific time, making records tamper-evident and independently verifiable.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
