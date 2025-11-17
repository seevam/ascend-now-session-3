import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ascend Now
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Career Discovery Platform - Session 3
          </p>
          <p className="text-md text-gray-500">
            Discover your personality and match it with ideal careers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Activity 5: DISC Explorer */}
          <Link
            href="/activities/disc-explorer"
            className="group bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-8 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold mb-3">DISC Personality Explorer</h2>
            <p className="text-purple-100 mb-4">
              Discover your work personality through the DISC assessment. Understand how you communicate, make decisions, and thrive in different environments.
            </p>
            <div className="flex items-center text-purple-100 group-hover:text-white">
              <span className="mr-2">Start Activity 5</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>

          {/* Activity 6: Career Matcher */}
          <Link
            href="/activities/career-matcher"
            className="group bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-8 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">💼</div>
            <h2 className="text-2xl font-bold mb-3">Personality-Career Matcher</h2>
            <p className="text-blue-100 mb-4">
              Match your personality profile with careers that fit your natural strengths. Get personalized recommendations and next steps.
            </p>
            <div className="flex items-center text-blue-100 group-hover:text-white">
              <span className="mr-2">Start Activity 6</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">Session 3 Journey</h3>
          <p className="text-sm text-gray-700 mb-4">
            Complete both activities to gain deep insights into your personality and ideal career paths.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎭</span>
              <span className="text-gray-600">DISC Explorer</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💼</span>
              <span className="text-gray-600">Career Matcher</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              <span className="text-gray-600">Your Career Path</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>⏱️ Total time: 45-60 minutes | 💾 All data saved locally | 🔒 Private & secure</p>
        </div>
      </div>
    </div>
  );
}
