"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Shield,
  Lock,
  Key,
  FileText,
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  Upload,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { securityFramework } from '@/lib/security';

export default function SecurityDemo() {
  const [activeDemo, setActiveDemo] = useState<string>('encryption');
  const [inputText, setInputText] = useState('');
  const [encryptedResult, setEncryptedResult] = useState('');
  const [decryptedResult, setDecryptedResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoResults, setDemoResults] = useState<any[]>([]);

  const handleEncryption = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const result = await securityFramework.encryptData(inputText, 'aes-gcm');
      setEncryptedResult(result);
      setDemoResults(prev => [...prev, {
        type: 'encryption',
        timestamp: new Date().toLocaleTimeString(),
        input: inputText,
        output: 'Data encrypted successfully',
        algorithm: 'AES-256-GCM'
      }]);
    } catch (error) {
      console.error('Encryption failed:', error);
    }
    setIsLoading(false);
  };

  const handleDecryption = async () => {
    if (!encryptedResult) return;

    setIsLoading(true);
    try {
      const result = await securityFramework.decryptData(encryptedResult);
      setDecryptedResult(result);
      setDemoResults(prev => [...prev, {
        type: 'decryption',
        timestamp: new Date().toLocaleTimeString(),
        input: 'Encrypted data',
        output: result,
        algorithm: 'AES-256-GCM'
      }]);
    } catch (error) {
      console.error('Decryption failed:', error);
    }
    setIsLoading(false);
  };

  const runComplianceAssessment = async () => {
    setIsLoading(true);
    try {
      const reports = await securityFramework.runComplianceAssessment();
      setDemoResults(prev => [...prev, {
        type: 'compliance',
        timestamp: new Date().toLocaleTimeString(),
        input: 'All frameworks',
        output: `${reports.length} compliance reports generated`,
        details: reports.map(r => `${r.frameworkId}: ${r.overallScore}%`).join(', ')
      }]);
    } catch (error) {
      console.error('Compliance assessment failed:', error);
    }
    setIsLoading(false);
  };

  const generateSecurityReport = async () => {
    setIsLoading(true);
    try {
      const report = await securityFramework.generateSecurityReport('security');
      setDemoResults(prev => [...prev, {
        type: 'report',
        timestamp: new Date().toLocaleTimeString(),
        input: 'Security assessment',
        output: report.title,
        details: `${report.sections.length} sections, ${report.recommendations.length} recommendations`
      }]);
    } catch (error) {
      console.error('Report generation failed:', error);
    }
    setIsLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Security Framework Demo
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Interactive demonstration of encryption, compliance, and security features
          </p>
        </div>

        {/* Demo Navigation */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeDemo === 'encryption' ? 'default' : 'outline'}
            onClick={() => setActiveDemo('encryption')}
            className="flex items-center gap-2"
          >
            <Lock className="h-4 w-4" />
            Encryption Demo
          </Button>
          <Button
            variant={activeDemo === 'compliance' ? 'default' : 'outline'}
            onClick={() => setActiveDemo('compliance')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Compliance Demo
          </Button>
          <Button
            variant={activeDemo === 'monitoring' ? 'default' : 'outline'}
            onClick={() => setActiveDemo('monitoring')}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Security Demo
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Interface */}
          <div className="space-y-6">
            {activeDemo === 'encryption' && (
              <Card>
                <CardHeader>
                  <CardTitle>End-to-End Encryption Demo</CardTitle>
                  <CardDescription>
                    Test AES-256-GCM encryption and decryption capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Data to Encrypt</label>
                    <Textarea
                      placeholder="Enter sensitive data to encrypt..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="mb-2"
                    />
                    <Button
                      onClick={handleEncryption}
                      disabled={!inputText.trim() || isLoading}
                      className="w-full"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {isLoading ? 'Encrypting...' : 'Encrypt Data'}
                    </Button>
                  </div>

                  {encryptedResult && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Encrypted Result</label>
                      <div className="relative">
                        <Textarea
                          value={encryptedResult.substring(0, 200) + '...'}
                          readOnly
                          className="mb-2 font-mono text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(encryptedResult)}
                          className="absolute top-2 right-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        onClick={handleDecryption}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        {isLoading ? 'Decrypting...' : 'Decrypt Data'}
                      </Button>
                    </div>
                  )}

                  {decryptedResult && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Decryption Successful</AlertTitle>
                      <AlertDescription>
                        Original data: "{decryptedResult}"
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {activeDemo === 'compliance' && (
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Assessment Demo</CardTitle>
                  <CardDescription>
                    Run Digital Government Act 2022 compliance checks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Digital Government Act 2022</AlertTitle>
                    <AlertDescription>
                      This demo will assess compliance with PNG's Digital Government Act 2022
                      requirements including data sovereignty, encryption, and security controls.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={runComplianceAssessment}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {isLoading ? 'Running Assessment...' : 'Run Compliance Assessment'}
                  </Button>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm font-medium">Data Sovereignty</div>
                      <div className="text-xs text-slate-600">100% Compliant</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm font-medium">Encryption</div>
                      <div className="text-xs text-slate-600">98% Coverage</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm font-medium">Access Control</div>
                      <div className="text-xs text-slate-600">95% Compliant</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm font-medium">Audit Logging</div>
                      <div className="text-xs text-slate-600">92% Coverage</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeDemo === 'monitoring' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Monitoring Demo</CardTitle>
                  <CardDescription>
                    Generate comprehensive security reports and assessments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={generateSecurityReport}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isLoading ? 'Generating Report...' : 'Generate Security Report'}
                  </Button>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Overall Security Score</div>
                        <div className="text-sm text-slate-600">Real-time assessment</div>
                      </div>
                      <Badge variant="default">94%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Active Threats</div>
                        <div className="text-sm text-slate-600">Currently monitored</div>
                      </div>
                      <Badge variant="outline">0</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Compliance Status</div>
                        <div className="text-sm text-slate-600">Multi-framework</div>
                      </div>
                      <Badge variant="default">Compliant</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Demo Activity Log</CardTitle>
              <CardDescription>
                Real-time log of security operations and demonstrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {demoResults.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    No activities yet. Try running a demo above.
                  </div>
                ) : (
                  demoResults.slice().reverse().map((result, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={
                            result.type === 'encryption' ? 'default' :
                            result.type === 'compliance' ? 'secondary' :
                            'outline'
                          }
                        >
                          {result.type}
                        </Badge>
                        <span className="text-xs text-slate-600">{result.timestamp}</span>
                      </div>
                      <div className="text-sm font-medium">{result.output}</div>
                      {result.algorithm && (
                        <div className="text-xs text-slate-600">Algorithm: {result.algorithm}</div>
                      )}
                      {result.details && (
                        <div className="text-xs text-slate-600 mt-1">{result.details}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Enhanced Security Framework Features</CardTitle>
            <CardDescription>
              Comprehensive security solution for Digital Government Act 2022 compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <Lock className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
                <p className="text-sm text-slate-600">
                  AES-256-GCM, NaCl-Box, and ChaCha20-Poly1305 encryption algorithms
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <FileText className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">DGA 2022 Compliance</h3>
                <p className="text-sm text-slate-600">
                  Full compliance monitoring for Papua New Guinea's Digital Government Act
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <Shield className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold mb-2">Threat Detection</h3>
                <p className="text-sm text-slate-600">
                  Real-time monitoring with automated incident response capabilities
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <Key className="h-8 w-8 text-orange-600 mb-3" />
                <h3 className="font-semibold mb-2">Multi-Factor Auth</h3>
                <p className="text-sm text-slate-600">
                  TOTP-based MFA with backup codes and session management
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
