"use client";

import React from 'react';
import Link from 'next/link';

export default function CensusManagementPage() {
  const censusStats = {
    totalPopulation: 9856234,
    registeredCitizens: 7234567,
    coveragePercentage: 73.4,
    malePopulation: 5123456,
    femalePopulation: 4732778,
    averageAge: 24.7,
    householdsRegistered: 1867432,
    birthsThisYear: 298765,
    deathsThisYear: 87654
  };

  const provinceData = [
    { name: 'National Capital District', population: 674640, registered: 612453, coverage: 90.8, households: 156780 },
    { name: 'Western Highlands', population: 362850, registered: 298234, coverage: 82.2, households: 84567 },
    { name: 'Morobe', population: 674358, registered: 534567, coverage: 79.3, households: 145678 },
    { name: 'Eastern Highlands', population: 579825, registered: 445234, coverage: 76.8, households: 123456 },
    { name: 'Southern Highlands', population: 515511, registered: 387654, coverage: 75.2, households: 98765 }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f8fafc, #e0f2fe)', padding: '2rem' }}>
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
                National Census Management
              </h1>
              <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
                Population data management and demographic analytics for Papua New Guinea
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
                Census Data Active
              </span>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Key Statistics */}
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
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Population</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: '0.5rem 0 0 0' }}>
                  {censusStats.totalPopulation.toLocaleString()}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#059669' }}>
              +{censusStats.birthsThisYear.toLocaleString()} births this year
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
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Registered Citizens</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', margin: '0.5rem 0 0 0' }}>
                  {censusStats.registeredCitizens.toLocaleString()}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              {censusStats.coveragePercentage}% coverage
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
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Households</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', margin: '0.5rem 0 0 0' }}>
                  {censusStats.householdsRegistered.toLocaleString()}
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
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Average Age</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ea580c', margin: '0.5rem 0 0 0' }}>
                  {censusStats.averageAge}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              Years old
            </div>
          </div>
        </div>

        {/* Demographics Overview */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: '0 0 1rem 0' }}>
            Demographics Overview
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#2563eb',
                marginBottom: '0.5rem'
              }}>
                {censusStats.malePopulation.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Male Population (52%)
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#ec4899',
                marginBottom: '0.5rem'
              }}>
                {censusStats.femalePopulation.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Female Population (48%)
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#059669',
                marginBottom: '0.5rem'
              }}>
                {censusStats.birthsThisYear.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Births This Year
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#dc2626',
                marginBottom: '0.5rem'
              }}>
                {censusStats.deathsThisYear.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Deaths This Year
              </div>
            </div>
          </div>
        </div>

        {/* Province Data */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: '0 0 1rem 0' }}>
            Provincial Data Summary
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600', color: '#374151' }}>Province</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', fontWeight: '600', color: '#374151' }}>Population</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', fontWeight: '600', color: '#374151' }}>Registered</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', fontWeight: '600', color: '#374151' }}>Coverage</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', fontWeight: '600', color: '#374151' }}>Households</th>
                </tr>
              </thead>
              <tbody>
                {provinceData.map((province, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{province.name}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{province.population.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{province.registered.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: province.coverage >= 85 ? '#dcfce7' : province.coverage >= 75 ? '#fef3c7' : '#fef2f2',
                        color: province.coverage >= 85 ? '#166534' : province.coverage >= 75 ? '#92400e' : '#991b1b',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {province.coverage}%
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{province.households.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0 0 1rem 0' }}>
              📊 Data Export
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
              Export census data for analysis and reporting
            </p>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Export Data
            </button>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0 0 1rem 0' }}>
              🔍 Search Records
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
              Find specific census records and citizen data
            </p>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#059669',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Search Database
            </button>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0 0 1rem 0' }}>
              📈 Generate Reports
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
              Create statistical reports and analytics
            </p>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Generate Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
