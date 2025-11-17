'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { hasDISCProfile } from '@/lib/personality-data';
import { ChevronRight, Info } from 'lucide-react';

export default function DISCExplorerLanding() {
  const router = useRouter();
  const [hasExistingProfile] = useState(hasDISCProfile());

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 text-white">
          <h1 className="text-4xl font-bold mb-4">🎭 Discover Your Work Personality</h1>
          <p className="text-lg text-purple-100">
            Understand your DISC personality traits and how they shape your ideal work environment
          </p>
        </div>

        <Card className="p-8">
          {/* What is DISC? */}
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              What is DISC?
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              DISC measures four personality traits that influence how you work:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💪</span>
                <div>
                  <span className="text-sm font-bold">Dominance</span>
                  <p className="text-xs text-gray-600">Results-focused</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                <div>
                  <span className="text-sm font-bold">Influence</span>
                  <p className="text-xs text-gray-600">People-oriented</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <div>
                  <span className="text-sm font-bold">Steadiness</span>
                  <p className="text-xs text-gray-600">Stability-seeking</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <div>
                  <span className="text-sm font-bold">Conscientiousness</span>
                  <p className="text-xs text-gray-600">Quality-focused</p>
                </div>
              </div>
            </div>
          </div>

          {/* Existing Profile Alert */}
          {hasExistingProfile && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertTitle>You have an existing DISC profile!</AlertTitle>
              <AlertDescription>
                You can view your previous results or retake the assessment.
              </AlertDescription>
            </Alert>
          )}

          {/* Input Method Selection */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Choose how to get started:</h3>

            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
              onClick={() => router.push('/activities/disc-explorer/input')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg mb-1">I already have my DISC scores</h4>
                  <p className="text-sm text-gray-600">
                    Enter your scores directly from a previous assessment
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
              onClick={() => router.push('/activities/disc-explorer/quiz')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg mb-1">Take a quick DISC quiz</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    12 questions • 5-7 minutes
                  </p>
                  <Badge>Recommended</Badge>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </Card>

            {hasExistingProfile && (
              <Card
                className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-green-500"
                onClick={() => router.push('/activities/disc-explorer/results')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg mb-1">View my existing profile</h4>
                    <p className="text-sm text-gray-600">
                      See your previous DISC assessment results
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              </Card>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">⏱️ Total time: 20-25 minutes</p>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-white hover:text-purple-200"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
