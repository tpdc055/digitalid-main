"use client";

import React from 'react';
import Link from 'next/link';

export default function AdminOversightPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f8fafc, #fef2f2)', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Link href="/digital-id" style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              color: '#374151',
              backgroundColor: '#ffffff'
            }}>
              ← Back to Digital ID
            </Link>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Administrative Oversight Dashboard
              </h1>
              <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
                System monitoring, analytics, and administration
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            padding: '1rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#dcfce7',
                color: '#166534',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                System Operational
              </span>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Registrations</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: '0.5rem 0 0 0' }}>
                  1,247,892
                </p>
              </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#059669' }}>
              +1,456 today
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Active Agents</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', margin: '0.5rem 0 0 0' }}>
                  456
                </p>
              </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              Across 22 provinces
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Mobile Units</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', margin: '0.5rem 0 0 0' }}>
                  89
                </p>
              </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              4 offline units
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>System Uptime</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', margin: '0.5rem 0 0 0' }}>
                  99.97%
                </p>
              </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              Last 30 days
            </div>
          </div>
        </div>

        {/* System Health Overview */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: '0 0 1rem 0' }}>
            System Health Overview
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { component: 'Overall', health: 98 },
              { component: 'API', health: 99 },
              { component: 'Database', health: 97 },
              { component: 'Sync', health: 95 },
              { component: 'Mobile', health: 92 }
            ].map((item, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: item.health >= 95 ? '#059669' : item.health >= 90 ? '#d97706' : '#dc2626',
                  marginBottom: '0.5rem'
                }}>
                  {item.health}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'capitalize' }}>
                  {item.component}
                </div>
                <div style={{
                  width: '100%',
                  height: '0.5rem',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '9999px',
                  marginTop: '0.5rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${item.health}%`,
                    height: '100%',
                    backgroundColor: item.health >= 95 ? '#059669' : item.health >= 90 ? '#d97706' : '#dc2626',
                    borderRadius: '9999px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: '0 0 1rem 0' }}>
            System Alerts
          </h2>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              1 Critical
            </span>
          </div>
          <div style={{ space: '1rem' }}>
            {[
              {
                type: 'critical',
                title: 'Mobile Unit Offline',
                message: 'Mobile Unit MU-045 in Enga Province has been offline for 6 hours',
                timestamp: '2024-01-20T10:30:00Z',
                category: 'connectivity'
              },
              {
                type: 'warning',
                title: 'High Processing Load',
                message: 'Document processing queue has reached 85% capacity',
                timestamp: '2024-01-20T09:15:00Z',
                category: 'performance'
              },
              {
                type: 'info',
                title: 'Scheduled Maintenance',
                message: 'Database maintenance scheduled for tonight 02:00 AM',
                timestamp: '2024-01-20T08:45:00Z',
                category: 'maintenance'
              }
            ].map((alert, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  borderLeft: `4px solid ${
                    alert.type === 'critical' ? '#ef4444' :
                    alert.type === 'warning' ? '#f59e0b' : '#3b82f6'
                  }`,
                  backgroundColor: alert.type === 'critical' ? '#fef2f2' :
                    alert.type === 'warning' ? '#fef3c7' : '#eff6ff',
                  marginBottom: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: '500', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>
                      {alert.title}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                      {alert.message}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem'
                      }}>
                        {alert.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: '#ffffff',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}>
                    Investigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Units Status */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
            Mobile Unit Status
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
            Real-time status of mobile registration units across PNG
          </p>
          <div style={{ space: '1rem' }}>
            {[
              { id: 'MU-001', location: 'Port Moresby', status: 'online', enrollments: 23, lastSync: '2 min ago' },
              { id: 'MU-045', location: 'Enga Province', status: 'offline', enrollments: 0, lastSync: '6 hours ago' },
              { id: 'MU-078', location: 'Mount Hagen', status: 'online', enrollments: 15, lastSync: '5 min ago' },
              { id: 'MU-089', location: 'Madang', status: 'syncing', enrollments: 8, lastSync: 'syncing...' }
            ].map((unit, index) => (
              <div key={index} style={{
                border: '1px solid #e5e7eb',
                borderLeft: '4px solid #3b82f6',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontWeight: '500', margin: '0 0 0.5rem 0' }}>{unit.id}</h4>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      📍 {unit.location}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      🕒 Last sync: {unit.lastSync}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: unit.status === 'online' ? '#dcfce7' :
                        unit.status === 'offline' ? '#fef2f2' : '#dbeafe',
                      color: unit.status === 'online' ? '#166534' :
                        unit.status === 'offline' ? '#991b1b' : '#1e40af',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      textTransform: 'uppercase'
                    }}>
                      {unit.status}
                    </span>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {unit.enrollments} enrollments today
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
