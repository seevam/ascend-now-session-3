# Ascend Now Career Discovery Platform - Session 3

A comprehensive web application for personality assessment and career matching, built with Next.js 14, TypeScript, and Tailwind CSS.

## Overview

This platform helps students discover their personality traits through DISC assessment and match them with ideal career paths. It consists of two main activities:

1. **DISC Personality Explorer** - Interactive personality assessment
2. **Personality-Career Matcher** - Career matching based on personality profile

## Features

### Activity 5: DISC Personality Explorer

- ✅ Manual DISC score input
- ✅ Interactive 12-question DISC quiz
- ✅ Personality profile visualization with radar charts
- ✅ Detailed trait analysis (strengths, challenges, work preferences)
- ✅ Work environment scenario matching
- ✅ Comprehensive results summary
- ✅ PDF export functionality
- ✅ Shareable results URLs

### Activity 6: Personality-Career Matcher

- ✅ Import DISC profile from Activity 5
- ✅ Import career interests from Session 2
- ✅ Interactive career matching interface with star ratings
- ✅ AI-powered fit score calculations
- ✅ Detailed fit analysis for each career
- ✅ Top 3 career recommendations
- ✅ Personalized insights and next steps
- ✅ PDF export functionality

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components built with Radix UI primitives
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PDF Export**: jsPDF + html2canvas
- **Data Compression**: lz-string

## Project Structure

```
ascend-now-session-3/
├── app/
│   ├── activities/
│   │   ├── disc-explorer/          # DISC Personality Explorer
│   │   │   ├── page.tsx             # Landing page
│   │   │   ├── input/               # Manual score input
│   │   │   ├── quiz/                # Interactive quiz
│   │   │   ├── profile/             # Profile visualization
│   │   │   ├── scenarios/           # Work scenarios
│   │   │   ├── results/             # Results summary
│   │   │   └── view/                # Shared results
│   │   └── career-matcher/          # Career Matcher
│   │       ├── page.tsx             # Landing page
│   │       ├── matching/            # Matching interface
│   │       ├── results/             # Fit analysis
│   │       └── view/                # Shared results
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page
│   └── globals.css                  # Global styles
├── components/
│   ├── ui/                          # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── alert.tsx
│   │   └── slider.tsx
│   ├── disc-explorer/               # DISC Explorer components
│   └── career-matcher/              # Career Matcher components
├── lib/
│   ├── personality-data.ts          # Data persistence utilities
│   ├── disc-scoring.ts              # Quiz scoring algorithms
│   ├── profile-types.ts             # Profile type determination
│   ├── matching-algorithm.ts        # Career matching logic
│   └── utils.ts                     # Utility functions
├── types/
│   ├── disc-personality.ts          # DISC type definitions
│   └── career-matching.ts           # Career matching types
├── data/
│   ├── disc-traits.json             # DISC trait descriptions
│   ├── disc-quiz.json               # Quiz questions
│   ├── work-scenarios.json          # Work scenarios
│   └── personality-career-map.json  # Career mapping data
├── public/                          # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Data Models

### DISC Profile Structure

```typescript
interface DISCProfile {
  sessionId: string;
  createdAt: Date;
  inputMethod: 'manual' | 'quiz' | 'imported';
  scores: {
    dominance: number;      // 0-100
    influence: number;       // 0-100
    steadiness: number;      // 0-100
    conscientiousness: number; // 0-100
  };
  dominantTraits: DISCTrait[];
  profileType: string;        // e.g., "The Driver"
  traitDescriptions: Record<DISCTrait, TraitAnalysis>;
  workStyles: WorkStyle[];
  idealEnvironments: WorkEnvironment[];
  completedScenarios: ScenarioResult[];
}
```

### Career Match Structure

```typescript
interface CareerMatch {
  sessionId: string;
  createdAt: Date;
  personalityProfile: CombinedPersonalityProfile;
  selectedCareers: CareerForMatching[];
  fitScores: PersonalityFitScore[];
  topMatches: CareerForMatching[];
  recommendations: CareerRecommendation[];
  insights: MatchingInsight[];
  userRatings: Record<string, number>;
}
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ascend-now-session-3.git
cd ascend-now-session-3
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Key Algorithms

### DISC Scoring Algorithm

The quiz scoring system uses weighted responses to calculate DISC scores:

1. Each quiz option has weights for D, I, S, C (0-3 points each)
2. Raw scores are summed across all questions
3. Scores are normalized to 0-100 scale
4. Dominant traits are identified (score >= 60)
5. Profile type is determined based on pattern matching

### Career Matching Algorithm

The matching algorithm calculates fit between personality and careers:

1. **Trait Fit Calculation**: Each DISC trait is evaluated against career requirements
   - Primary traits: High score = high fit
   - Avoid traits: Low score = high fit
   - Neutral traits: Moderate score = best fit

2. **Weighted Fit Score**: Traits are weighted based on importance
   - Primary traits: weight 3
   - Avoid traits: weight 2
   - Secondary traits: weight 1
   - Neutral traits: weight 0.5

3. **Overall Fit**: Weighted average across all traits (0-100)

4. **Reasoning Generation**: Personalized explanation based on profile

5. **Insights**: Patterns identified across all career matches

## Data Storage

All data is stored locally in the browser's `localStorage`:

- **DISC Profile**: `ascend_disc_explorer_v1`
- **TypeFinder Profile**: `ascend_typefinder_v1`
- **Session 2 Data**: `ascend_session2_clusters_v1`
- **Career Matches**: `ascend_career_matcher_v1`

Data expires after 90 days and can be manually cleared.

## Content Specifications

### DISC Traits Data

- 4 personality traits (D, I, S, C)
- 3 levels per trait (low, moderate, high)
- Descriptions, strengths, challenges, work preferences
- Career examples for each level
- 9 profile type patterns

### Quiz Questions

- 12 scenario-based questions
- 4 options per question (one per trait)
- Weighted scoring (0-3 points per trait)

### Work Scenarios

- 7 workplace situations
- 4 response options (aligned with DISC traits)
- Personalized feedback based on user's profile

### Career Mappings

- 30+ careers mapped to personality traits
- Primary, secondary, and avoid DISC traits
- Work environment characteristics
- TypeFinder type alignments
- Reasoning templates for each trait combination

## Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Environment Variables

No environment variables required - all data is client-side.

## Performance Targets

- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: <250KB per activity
- Lighthouse Score: 90+

## Browser Support

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- iOS Safari 14+
- Chrome Android 90+

## Success Metrics

- 80%+ completion rate for both activities
- Average completion time: 20-30 minutes per activity
- <5% mid-activity drop-off rate
- Students can articulate personality-career fit

## Future Enhancements

- [ ] TypeFinder assessment integration
- [ ] Advanced analytics and progress tracking
- [ ] Multi-language support
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Dark mode
- [ ] Mobile app version
- [ ] Integration with career counseling platforms
- [ ] Peer comparison features
- [ ] Career pathway recommendations
- [ ] Video explainers for each profile type

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please contact:
- Email: support@ascendnow.com
- Documentation: https://docs.ascendnow.com

## Acknowledgments

- DISC personality framework
- TypeFinder personality assessment
- Career cluster framework
- shadcn/ui for component inspiration

## Version History

### v1.0.0 (November 2025)
- Initial release
- DISC Personality Explorer
- Personality-Career Matcher
- 30+ career mappings
- PDF export
- Shareable results

---

Built with ❤️ for Ascend Now Career Discovery Platform
