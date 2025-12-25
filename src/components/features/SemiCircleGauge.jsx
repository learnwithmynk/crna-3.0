/**
 * Semi-circle progress gauge with milestone markers
 * Used for Clinical Tracker entry visualization
 *
 * TODO: Replace milestone data with API call to user's earned badges
 */

import React from 'react';

const sizeConfig = {
  sm: { radius: 60, strokeWidth: 8, fontSize: 24, labelSize: 10, iconSize: 14 },
  md: { radius: 80, strokeWidth: 12, fontSize: 32, labelSize: 12, iconSize: 18 },
  lg: { radius: 100, strokeWidth: 14, fontSize: 40, labelSize: 14, iconSize: 22 },
};

export function SemiCircleGauge({
  value = 0,
  max = 100,
  milestones = [],
  size = 'md',
  label = 'Entries',
  className = '',
}) {
  const config = sizeConfig[size] || sizeConfig.md;
  const { radius, strokeWidth, fontSize, labelSize, iconSize } = config;

  // SVG dimensions
  const width = (radius + strokeWidth) * 2;
  const height = radius + strokeWidth * 2 + 10; // Extra space for milestone icons at bottom
  const centerX = width / 2;
  const centerY = radius + strokeWidth;

  // Calculate arc properties
  const circumference = Math.PI * radius; // Half circle
  const progress = Math.min(value / max, 1); // Cap at 100%
  const progressLength = progress * circumference;

  // Arc path (semi-circle from left to right)
  const arcPath = `
    M ${centerX - radius} ${centerY}
    A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}
  `;

  // Calculate position on arc for a given value
  const getMilestonePosition = (milestoneValue) => {
    const normalizedValue = Math.min(milestoneValue / max, 1);
    const angle = Math.PI - normalizedValue * Math.PI; // 180° to 0°
    const x = centerX + radius * Math.cos(angle);
    const y = centerY - radius * Math.sin(angle);
    return { x, y };
  };

  // Find next milestone
  const nextMilestone = milestones.find((m) => m.value > value);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background arc (gray) */}
        <path
          d={arcPath}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress arc (gradient from primary) */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progressLength}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />

        {/* Gradient definition - yellow gradient from light to darker */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>

        {/* Milestone markers */}
        {milestones.map((milestone, index) => {
          const pos = getMilestonePosition(milestone.value);
          const isEarned = value >= milestone.value;

          return (
            <g key={index}>
              {/* Milestone circle - green if earned, gray outline if not */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={8}
                fill={isEarned ? '#fef08a' : 'white'}
                stroke={isEarned ? '#fde68a' : '#d1d5db'}
                strokeWidth={2}
                style={{ transition: 'all 0.3s ease' }}
              />
              {/* Milestone value label (outside arc) */}
              <text
                x={pos.x}
                y={pos.y - 14}
                textAnchor="middle"
                fontSize={10}
                fill={isEarned ? '#374151' : '#9ca3af'}
                fontWeight={isEarned ? '600' : '400'}
              >
                {milestone.value}
              </text>
            </g>
          );
        })}

        {/* Center value */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="bold"
          fill="#111827"
        >
          {value}
        </text>

        {/* Label below value */}
        <text
          x={centerX}
          y={centerY + labelSize + 4}
          textAnchor="middle"
          fontSize={labelSize}
          fill="#6b7280"
        >
          {label}
        </text>
      </svg>

      {/* Next milestone teaser (below gauge) */}
      {nextMilestone && (
        <p className="text-sm text-gray-600 mt-2 text-center">
          Next: <strong>{nextMilestone.name}</strong> ({nextMilestone.value - value} more)
        </p>
      )}
    </div>
  );
}
