import React from 'react';
import { getScoreTone } from '@/constants/smartMatchingConfig';

const SCORE_COLORS = {
  emerald: 'stroke-emerald-500',
  blue: 'stroke-blue-500',
  amber: 'stroke-amber-500',
  rose: 'stroke-rose-400',
};

const SCORE_TEXT_COLORS = {
  emerald: 'text-emerald-700',
  blue: 'text-blue-700',
  amber: 'text-amber-700',
  rose: 'text-rose-500',
};

export default function ScoreRing({ score, size = 56, strokeWidth = 4 }) {
  const tone = getScoreTone(score);
  const toneName = score >= 80 ? 'emerald' : score >= 60 ? 'blue' : score >= 40 ? 'amber' : 'rose';
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={SCORE_COLORS[toneName]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-mono text-xs font-bold ${SCORE_TEXT_COLORS[toneName]}`}>
          {score}%
        </span>
      </div>
    </div>
  );
}
