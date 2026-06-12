import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { RotateCcw, ChevronLeft, ChevronRight, Star, Volume2 } from 'lucide-react';
import { KidioPageHeader } from '../../components/KidioPageHeader';
import { advanceJourney } from '../utils/journeyProgress';

// Letter path data with multiple strokes for each letter (A-Z)
interface Stroke {
  path: string;
  points: { x: number; y: number }[];
}

interface LetterData {
  strokes: Stroke[];
}

const letterPaths: Record<string, LetterData> = {
  A: {
    strokes: [
      // Stroke 1: Left diagonal
      {
        path: 'M 100 250 L 150 50',
        points: [
          { x: 100, y: 250 },
          { x: 112, y: 200 },
          { x: 125, y: 150 },
          { x: 137, y: 100 },
          { x: 150, y: 50 },
        ],
      },
      // Stroke 2: Right diagonal
      {
        path: 'M 150 50 L 200 250',
        points: [
          { x: 150, y: 50 },
          { x: 162, y: 100 },
          { x: 175, y: 150 },
          { x: 187, y: 200 },
          { x: 200, y: 250 },
        ],
      },
      // Stroke 3: Horizontal bar
      {
        path: 'M 115 180 L 185 180',
        points: [
          { x: 115, y: 180 },
          { x: 135, y: 180 },
          { x: 150, y: 180 },
          { x: 165, y: 180 },
          { x: 185, y: 180 },
        ],
      },
    ],
  },
  B: {
    strokes: [
      // Stroke 1: Vertical line
      {
        path: 'M 100 50 L 100 250',
        points: [
          { x: 100, y: 50 },
          { x: 100, y: 100 },
          { x: 100, y: 150 },
          { x: 100, y: 200 },
          { x: 100, y: 250 },
        ],
      },
      // Stroke 2: Top bump
      {
        path: 'M 100 50 Q 200 50 200 100 Q 200 150 100 150',
        points: [
          { x: 100, y: 50 },
          { x: 140, y: 50 },
          { x: 180, y: 65 },
          { x: 190, y: 100 },
          { x: 180, y: 135 },
          { x: 140, y: 150 },
          { x: 100, y: 150 },
        ],
      },
      // Stroke 3: Bottom bump
      {
        path: 'M 100 150 Q 210 150 210 200 Q 210 250 100 250',
        points: [
          { x: 100, y: 150 },
          { x: 145, y: 150 },
          { x: 190, y: 165 },
          { x: 200, y: 200 },
          { x: 190, y: 235 },
          { x: 145, y: 250 },
          { x: 100, y: 250 },
        ],
      },
    ],
  },
  C: {
    strokes: [
      // Single curved stroke
      {
        path: 'M 200 80 Q 100 50 100 150 Q 100 250 200 220',
        points: [
          { x: 200, y: 80 },
          { x: 160, y: 55 },
          { x: 120, y: 60 },
          { x: 100, y: 90 },
          { x: 95, y: 120 },
          { x: 95, y: 150 },
          { x: 95, y: 180 },
          { x: 100, y: 210 },
          { x: 130, y: 235 },
          { x: 170, y: 235 },
          { x: 200, y: 220 },
        ],
      },
    ],
  },
  D: {
    strokes: [
      // Stroke 1: Vertical line
      {
        path: 'M 100 50 L 100 250',
        points: [
          { x: 100, y: 50 },
          { x: 100, y: 100 },
          { x: 100, y: 150 },
          { x: 100, y: 200 },
          { x: 100, y: 250 },
        ],
      },
      // Stroke 2: Curved part
      {
        path: 'M 100 50 Q 220 50 220 150 Q 220 250 100 250',
        points: [
          { x: 100, y: 50 },
          { x: 150, y: 50 },
          { x: 190, y: 70 },
          { x: 210, y: 110 },
          { x: 210, y: 150 },
          { x: 210, y: 190 },
          { x: 190, y: 230 },
          { x: 150, y: 250 },
          { x: 100, y: 250 },
        ],
      },
    ],
  },
  E: {
    strokes: [
      // Stroke 1: Vertical line
      {
        path: 'M 100 50 L 100 250',
        points: [
          { x: 100, y: 50 },
          { x: 100, y: 100 },
          { x: 100, y: 150 },
          { x: 100, y: 200 },
          { x: 100, y: 250 },
        ],
      },
      // Stroke 2: Top horizontal
      {
        path: 'M 100 50 L 200 50',
        points: [
          { x: 100, y: 50 },
          { x: 130, y: 50 },
          { x: 160, y: 50 },
          { x: 200, y: 50 },
        ],
      },
      // Stroke 3: Middle horizontal
      {
        path: 'M 100 150 L 180 150',
        points: [
          { x: 100, y: 150 },
          { x: 130, y: 150 },
          { x: 160, y: 150 },
          { x: 180, y: 150 },
        ],
      },
      // Stroke 4: Bottom horizontal
      {
        path: 'M 100 250 L 200 250',
        points: [
          { x: 100, y: 250 },
          { x: 130, y: 250 },
          { x: 160, y: 250 },
          { x: 200, y: 250 },
        ],
      },
    ],
  },
  F: {
    strokes: [
      // Stroke 1: Vertical line
      {
        path: 'M 100 50 L 100 250',
        points: [
          { x: 100, y: 50 },
          { x: 100, y: 100 },
          { x: 100, y: 150 },
          { x: 100, y: 200 },
          { x: 100, y: 250 },
        ],
      },
      // Stroke 2: Top horizontal
      {
        path: 'M 100 50 L 200 50',
        points: [
          { x: 100, y: 50 },
          { x: 130, y: 50 },
          { x: 160, y: 50 },
          { x: 200, y: 50 },
        ],
      },
      // Stroke 3: Middle horizontal
      {
        path: 'M 100 150 L 180 150',
        points: [
          { x: 100, y: 150 },
          { x: 130, y: 150 },
          { x: 160, y: 150 },
          { x: 180, y: 150 },
        ],
      },
    ],
  },
  G: {
    strokes: [
      // Stroke 1: Main curve
      {
        path: 'M 200 80 Q 100 50 100 150 Q 100 250 200 220',
        points: [
          { x: 200, y: 80 },
          { x: 160, y: 55 },
          { x: 120, y: 60 },
          { x: 100, y: 90 },
          { x: 95, y: 150 },
          { x: 100, y: 210 },
          { x: 140, y: 240 },
          { x: 200, y: 220 },
        ],
      },
      // Stroke 2: Inner horizontal
      {
        path: 'M 200 150 L 200 220',
        points: [
          { x: 200, y: 150 },
          { x: 200, y: 180 },
          { x: 200, y: 220 },
        ],
      },
      // Stroke 3: Horizontal bar
      {
        path: 'M 150 150 L 200 150',
        points: [
          { x: 150, y: 150 },
          { x: 175, y: 150 },
          { x: 200, y: 150 },
        ],
      },
    ],
  },
  H: {
    strokes: [
      // Stroke 1: Left vertical
      {
        path: 'M 100 50 L 100 250',
        points: [
          { x: 100, y: 50 },
          { x: 100, y: 100 },
          { x: 100, y: 150 },
          { x: 100, y: 200 },
          { x: 100, y: 250 },
        ],
      },
      // Stroke 2: Right vertical
      {
        path: 'M 200 50 L 200 250',
        points: [
          { x: 200, y: 50 },
          { x: 200, y: 100 },
          { x: 200, y: 150 },
          { x: 200, y: 200 },
          { x: 200, y: 250 },
        ],
      },
      // Stroke 3: Horizontal bar
      {
        path: 'M 100 150 L 200 150',
        points: [
          { x: 100, y: 150 },
          { x: 130, y: 150 },
          { x: 160, y: 150 },
          { x: 200, y: 150 },
        ],
      },
    ],
  },
  I: {
    strokes: [
      // Stroke 1: Top horizontal
      {
        path: 'M 120 50 L 180 50',
        points: [
          { x: 120, y: 50 },
          { x: 150, y: 50 },
          { x: 180, y: 50 },
        ],
      },
      // Stroke 2: Vertical line
      {
        path: 'M 150 50 L 150 250',
        points: [
          { x: 150, y: 50 },
          { x: 150, y: 100 },
          { x: 150, y: 150 },
          { x: 150, y: 200 },
          { x: 150, y: 250 },
        ],
      },
      // Stroke 3: Bottom horizontal
      {
        path: 'M 120 250 L 180 250',
        points: [
          { x: 120, y: 250 },
          { x: 150, y: 250 },
          { x: 180, y: 250 },
        ],
      },
    ],
  },
  J: {
    strokes: [
      // Stroke 1: Top horizontal
      {
        path: 'M 120 50 L 200 50',
        points: [
          { x: 120, y: 50 },
          { x: 160, y: 50 },
          { x: 200, y: 50 },
        ],
      },
      // Stroke 2: Vertical and curve
      {
        path: 'M 170 50 L 170 200 Q 170 250 120 250 Q 80 250 80 210',
        points: [
          { x: 170, y: 50 },
          { x: 170, y: 100 },
          { x: 170, y: 150 },
          { x: 170, y: 200 },
          { x: 160, y: 230 },
          { x: 140, y: 250 },
          { x: 110, y: 250 },
          { x: 90, y: 240 },
          { x: 80, y: 210 },
        ],
      },
    ],
  },
  K: {
    strokes: [
      // Stroke 1: Vertical line
      {
        path: 'M 100 50 L 100 250',
        points: [
          { x: 100, y: 50 },
          { x: 100, y: 100 },
          { x: 100, y: 150 },
          { x: 100, y: 200 },
          { x: 100, y: 250 },
        ],
      },
      // Stroke 2: Upper diagonal
      {
        path: 'M 200 50 L 100 150',
        points: [
          { x: 200, y: 50 },
          { x: 175, y: 75 },
          { x: 150, y: 100 },
          { x: 125, y: 125 },
          { x: 100, y: 150 },
        ],
      },
      // Stroke 3: Lower diagonal
      {
        path: 'M 100 150 L 200 250',
        points: [
          { x: 100, y: 150 },
          { x: 125, y: 175 },
          { x: 150, y: 200 },
          { x: 175, y: 225 },
          { x: 200, y: 250 },
        ],
      },
    ],
  },
  L: {
    strokes: [
      // Stroke 1: Vertical line
      {
        path: 'M 100 50 L 100 250',
        points: [
          { x: 100, y: 50 },
          { x: 100, y: 100 },
          { x: 100, y: 150 },
          { x: 100, y: 200 },
          { x: 100, y: 250 },
        ],
      },
      // Stroke 2: Horizontal line
      {
        path: 'M 100 250 L 200 250',
        points: [
          { x: 100, y: 250 },
          { x: 130, y: 250 },
          { x: 160, y: 250 },
          { x: 200, y: 250 },
        ],
      },
    ],
  },
  M: {
    strokes: [
      // Stroke 1: Left vertical
      {
        path: 'M 80 250 L 80 50',
        points: [
          { x: 80, y: 250 },
          { x: 80, y: 200 },
          { x: 80, y: 150 },
          { x: 80, y: 100 },
          { x: 80, y: 50 },
        ],
      },
      // Stroke 2: Left diagonal down
      {
        path: 'M 80 50 L 150 180',
        points: [
          { x: 80, y: 50 },
          { x: 97, y: 85 },
          { x: 115, y: 115 },
          { x: 132, y: 145 },
          { x: 150, y: 180 },
        ],
      },
      // Stroke 3: Right diagonal up
      {
        path: 'M 150 180 L 220 50',
        points: [
          { x: 150, y: 180 },
          { x: 167, y: 145 },
          { x: 185, y: 115 },
          { x: 202, y: 85 },
          { x: 220, y: 50 },
        ],
      },
      // Stroke 4: Right vertical
      {
        path: 'M 220 50 L 220 250',
        points: [
          { x: 220, y: 50 },
          { x: 220, y: 100 },
          { x: 220, y: 150 },
          { x: 220, y: 200 },
          { x: 220, y: 250 },
        ],
      },
    ],
  },
  N: {
    strokes: [
      // Stroke 1: Left vertical
      {
        path: 'M 100 250 L 100 50',
        points: [
          { x: 100, y: 250 },
          { x: 100, y: 200 },
          { x: 100, y: 150 },
          { x: 100, y: 100 },
          { x: 100, y: 50 },
        ],
      },
      // Stroke 2: Diagonal
      {
        path: 'M 100 50 L 200 250',
        points: [
          { x: 100, y: 50 },
          { x: 125, y: 100 },
          { x: 150, y: 150 },
          { x: 175, y: 200 },
          { x: 200, y: 250 },
        ],
      },
      // Stroke 3: Right vertical
      {
        path: 'M 200 250 L 200 50',
        points: [
          { x: 200, y: 250 },
          { x: 200, y: 200 },
          { x: 200, y: 150 },
          { x: 200, y: 100 },
          { x: 200, y: 50 },
        ],
      },
    ],
  },
  O: {
    strokes: [
      // Single oval stroke
      {
        path: 'M 150 50 Q 220 50 220 150 Q 220 250 150 250 Q 80 250 80 150 Q 80 50 150 50',
        points: [
          { x: 150, y: 50 },
          { x: 190, y: 55 },
          { x: 215, y: 90 },
          { x: 220, y: 150 },
          { x: 215, y: 210 },
          { x: 190, y: 245 },
          { x: 150, y: 250 },
          { x: 110, y: 245 },
          { x: 85, y: 210 },
          { x: 80, y: 150 },
          { x: 85, y: 90 },
          { x: 110, y: 55 },
          { x: 150, y: 50 },
        ],
      },
    ],
  },
  P: {
    strokes: [
      // Stroke 1: Vertical line
      {
        path: 'M 100 50 L 100 250',
        points: [
          { x: 100, y: 50 },
          { x: 100, y: 100 },
          { x: 100, y: 150 },
          { x: 100, y: 200 },
          { x: 100, y: 250 },
        ],
      },
      // Stroke 2: Top bump
      {
        path: 'M 100 50 Q 210 50 210 100 Q 210 160 100 160',
        points: [
          { x: 100, y: 50 },
          { x: 140, y: 50 },
          { x: 180, y: 55 },
          { x: 200, y: 80 },
          { x: 200, y: 110 },
          { x: 180, y: 140 },
          { x: 140, y: 155 },
          { x: 100, y: 160 },
        ],
      },
    ],
  },
  Q: {
    strokes: [
      // Stroke 1: Circle
      {
        path: 'M 150 50 Q 220 50 220 150 Q 220 250 150 250 Q 80 250 80 150 Q 80 50 150 50',
        points: [
          { x: 150, y: 50 },
          { x: 190, y: 55 },
          { x: 215, y: 90 },
          { x: 220, y: 150 },
          { x: 215, y: 210 },
          { x: 190, y: 245 },
          { x: 150, y: 250 },
          { x: 110, y: 245 },
          { x: 85, y: 210 },
          { x: 80, y: 150 },
          { x: 85, y: 90 },
          { x: 110, y: 55 },
          { x: 150, y: 50 },
        ],
      },
      // Stroke 2: Tail
      {
        path: 'M 170 200 L 220 260',
        points: [
          { x: 170, y: 200 },
          { x: 185, y: 220 },
          { x: 200, y: 240 },
          { x: 220, y: 260 },
        ],
      },
    ],
  },
  R: {
    strokes: [
      // Stroke 1: Vertical line
      {
        path: 'M 100 50 L 100 250',
        points: [
          { x: 100, y: 50 },
          { x: 100, y: 100 },
          { x: 100, y: 150 },
          { x: 100, y: 200 },
          { x: 100, y: 250 },
        ],
      },
      // Stroke 2: Top bump
      {
        path: 'M 100 50 Q 200 50 200 100 Q 200 150 100 150',
        points: [
          { x: 100, y: 50 },
          { x: 140, y: 50 },
          { x: 175, y: 60 },
          { x: 190, y: 90 },
          { x: 185, y: 120 },
          { x: 160, y: 145 },
          { x: 100, y: 150 },
        ],
      },
      // Stroke 3: Leg
      {
        path: 'M 130 150 L 200 250',
        points: [
          { x: 130, y: 150 },
          { x: 150, y: 180 },
          { x: 170, y: 210 },
          { x: 200, y: 250 },
        ],
      },
    ],
  },
  S: {
    strokes: [
      // Single S curve
      {
        path: 'M 190 70 Q 190 50 150 50 Q 100 50 100 100 Q 100 150 150 150 Q 200 150 200 200 Q 200 250 150 250 Q 100 250 100 230',
        points: [
          { x: 190, y: 70 },
          { x: 185, y: 55 },
          { x: 165, y: 50 },
          { x: 140, y: 50 },
          { x: 115, y: 55 },
          { x: 100, y: 75 },
          { x: 100, y: 100 },
          { x: 110, y: 130 },
          { x: 135, y: 145 },
          { x: 165, y: 155 },
          { x: 190, y: 170 },
          { x: 200, y: 200 },
          { x: 195, y: 230 },
          { x: 170, y: 250 },
          { x: 140, y: 250 },
          { x: 115, y: 245 },
          { x: 100, y: 230 },
        ],
      },
    ],
  },
  T: {
    strokes: [
      // Stroke 1: Top horizontal
      {
        path: 'M 80 50 L 220 50',
        points: [
          { x: 80, y: 50 },
          { x: 115, y: 50 },
          { x: 150, y: 50 },
          { x: 185, y: 50 },
          { x: 220, y: 50 },
        ],
      },
      // Stroke 2: Vertical line
      {
        path: 'M 150 50 L 150 250',
        points: [
          { x: 150, y: 50 },
          { x: 150, y: 100 },
          { x: 150, y: 150 },
          { x: 150, y: 200 },
          { x: 150, y: 250 },
        ],
      },
    ],
  },
  U: {
    strokes: [
      // Stroke 1: Left side down and curve
      {
        path: 'M 100 50 L 100 200 Q 100 250 150 250 Q 200 250 200 200 L 200 50',
        points: [
          { x: 100, y: 50 },
          { x: 100, y: 100 },
          { x: 100, y: 150 },
          { x: 100, y: 200 },
          { x: 110, y: 230 },
          { x: 130, y: 245 },
          { x: 150, y: 250 },
          { x: 170, y: 245 },
          { x: 190, y: 230 },
          { x: 200, y: 200 },
          { x: 200, y: 150 },
          { x: 200, y: 100 },
          { x: 200, y: 50 },
        ],
      },
    ],
  },
  V: {
    strokes: [
      // Stroke 1: Left diagonal
      {
        path: 'M 80 50 L 150 250',
        points: [
          { x: 80, y: 50 },
          { x: 97, y: 100 },
          { x: 115, y: 150 },
          { x: 132, y: 200 },
          { x: 150, y: 250 },
        ],
      },
      // Stroke 2: Right diagonal
      {
        path: 'M 150 250 L 220 50',
        points: [
          { x: 150, y: 250 },
          { x: 167, y: 200 },
          { x: 185, y: 150 },
          { x: 202, y: 100 },
          { x: 220, y: 50 },
        ],
      },
    ],
  },
  W: {
    strokes: [
      // Stroke 1: First down
      {
        path: 'M 60 50 L 100 250',
        points: [
          { x: 60, y: 50 },
          { x: 70, y: 100 },
          { x: 80, y: 150 },
          { x: 90, y: 200 },
          { x: 100, y: 250 },
        ],
      },
      // Stroke 2: First up
      {
        path: 'M 100 250 L 150 100',
        points: [
          { x: 100, y: 250 },
          { x: 112, y: 210 },
          { x: 125, y: 170 },
          { x: 137, y: 130 },
          { x: 150, y: 100 },
        ],
      },
      // Stroke 3: Second down
      {
        path: 'M 150 100 L 200 250',
        points: [
          { x: 150, y: 100 },
          { x: 162, y: 140 },
          { x: 175, y: 180 },
          { x: 187, y: 215 },
          { x: 200, y: 250 },
        ],
      },
      // Stroke 4: Second up
      {
        path: 'M 200 250 L 240 50',
        points: [
          { x: 200, y: 250 },
          { x: 210, y: 200 },
          { x: 220, y: 150 },
          { x: 230, y: 100 },
          { x: 240, y: 50 },
        ],
      },
    ],
  },
  X: {
    strokes: [
      // Stroke 1: Diagonal down-right
      {
        path: 'M 80 50 L 220 250',
        points: [
          { x: 80, y: 50 },
          { x: 115, y: 100 },
          { x: 150, y: 150 },
          { x: 185, y: 200 },
          { x: 220, y: 250 },
        ],
      },
      // Stroke 2: Diagonal down-left
      {
        path: 'M 220 50 L 80 250',
        points: [
          { x: 220, y: 50 },
          { x: 185, y: 100 },
          { x: 150, y: 150 },
          { x: 115, y: 200 },
          { x: 80, y: 250 },
        ],
      },
    ],
  },
  Y: {
    strokes: [
      // Stroke 1: Left diagonal to center
      {
        path: 'M 80 50 L 150 150',
        points: [
          { x: 80, y: 50 },
          { x: 97, y: 75 },
          { x: 115, y: 100 },
          { x: 132, y: 125 },
          { x: 150, y: 150 },
        ],
      },
      // Stroke 2: Right diagonal to center
      {
        path: 'M 220 50 L 150 150',
        points: [
          { x: 220, y: 50 },
          { x: 202, y: 75 },
          { x: 185, y: 100 },
          { x: 167, y: 125 },
          { x: 150, y: 150 },
        ],
      },
      // Stroke 3: Vertical down
      {
        path: 'M 150 150 L 150 250',
        points: [
          { x: 150, y: 150 },
          { x: 150, y: 175 },
          { x: 150, y: 200 },
          { x: 150, y: 225 },
          { x: 150, y: 250 },
        ],
      },
    ],
  },
  Z: {
    strokes: [
      // Stroke 1: Top horizontal
      {
        path: 'M 80 50 L 220 50',
        points: [
          { x: 80, y: 50 },
          { x: 115, y: 50 },
          { x: 150, y: 50 },
          { x: 185, y: 50 },
          { x: 220, y: 50 },
        ],
      },
      // Stroke 2: Diagonal
      {
        path: 'M 220 50 L 80 250',
        points: [
          { x: 220, y: 50 },
          { x: 185, y: 100 },
          { x: 150, y: 150 },
          { x: 115, y: 200 },
          { x: 80, y: 250 },
        ],
      },
      // Stroke 3: Bottom horizontal
      {
        path: 'M 80 250 L 220 250',
        points: [
          { x: 80, y: 250 },
          { x: 115, y: 250 },
          { x: 150, y: 250 },
          { x: 185, y: 250 },
          { x: 220, y: 250 },
        ],
      },
    ],
  },
};

const letters = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

export function TraceLetterGame() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tracedPoints, setTracedPoints] = useState<{ x: number; y: number }[]>([]);
  const [progress, setProgress] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<string[]>([]);
  const [completedStrokes, setCompletedStrokes] = useState<number[]>([]);
  const [showStrokeAnimation, setShowStrokeAnimation] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);

  const currentLetter = letters[currentLetterIndex];
  const letterData = letterPaths[currentLetter];
  const currentStroke = letterData.strokes[currentStrokeIndex];
  const totalStrokes = letterData.strokes.length;

  const speakCurrentLetter = useCallback(() => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentLetter);
        const englishVoices = window.speechSynthesis
          .getVoices()
          .filter((voice) => voice.lang.toLowerCase().startsWith('en-us'));
        const preferredVoiceNames = [
          'aria',
          'jenny',
          'google us english',
          'samantha',
          'ava',
          'zira',
        ];
        const preferredVoice = preferredVoiceNames
          .map((name) =>
            englishVoices.find((voice) => voice.name.toLowerCase().includes(name)),
          )
          .find(Boolean);

        utterance.lang = 'en-US';
        utterance.voice = preferredVoice ?? englishVoices[0] ?? null;
        utterance.rate = 0.72;
        utterance.pitch = 1.05;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Speech is optional; tracing remains usable when it is unavailable.
    }
  }, [currentLetter]);

  // Draw the letter guide on canvas
  const drawLetterGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all strokes in gray (completed strokes in blue)
    letterData.strokes.forEach((stroke, index) => {
      ctx.save();

      if (completedStrokes.includes(index)) {
        // Completed stroke - solid blue
        ctx.strokeStyle = '#2BADEE';
        ctx.lineWidth = 35;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([]);
      } else if (index === currentStrokeIndex) {
        // Current stroke - dotted gray (to trace)
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 40;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([2, 8]);
      } else {
        // Future stroke - light dotted
        ctx.strokeStyle = '#F3F4F6';
        ctx.lineWidth = 35;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([2, 12]);
      }

      const path = new Path2D(stroke.path);
      ctx.stroke(path);
      ctx.restore();
    });

    // Draw guide points for current stroke only
    if (!completedStrokes.includes(currentStrokeIndex)) {
      currentStroke.points.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = index === 0 ? '#22C55E' : '#D1D5DB';
        ctx.fill();

        if (index === 0) {
          // Start point indicator
          ctx.beginPath();
          ctx.arc(point.x, point.y, 15, 0, Math.PI * 2);
          ctx.strokeStyle = '#22C55E';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });
    }
  }, [letterData, currentStroke, currentStrokeIndex, completedStrokes]);

  // Animate stroke guide
  useEffect(() => {
    if (!showStrokeAnimation) return;

    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [showStrokeAnimation]);

  // Draw animation stroke
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !showStrokeAnimation) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawLetterGuide();

    // Draw animated stroke for current stroke
    ctx.save();
    ctx.strokeStyle = '#2BADEE';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([]);

    const totalPoints = currentStroke.points.length;
    const pointsToShow = Math.floor((animationProgress / 100) * totalPoints);

    if (pointsToShow > 1) {
      ctx.beginPath();
      ctx.moveTo(currentStroke.points[0].x, currentStroke.points[0].y);
      for (let i = 1; i < pointsToShow; i++) {
        ctx.lineTo(currentStroke.points[i].x, currentStroke.points[i].y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }, [animationProgress, showStrokeAnimation, currentStroke, drawLetterGuide]);

  // Draw user's traced path
  useEffect(() => {
    if (showStrokeAnimation) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawLetterGuide();

    // Draw user's path
    if (tracedPoints.length > 1) {
      ctx.save();
      ctx.strokeStyle = '#2BADEE';
      ctx.lineWidth = 35;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(tracedPoints[0].x, tracedPoints[0].y);
      for (let i = 1; i < tracedPoints.length; i++) {
        ctx.lineTo(tracedPoints[i].x, tracedPoints[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }
  }, [tracedPoints, showStrokeAnimation, drawLetterGuide]);

  // Calculate distance from point to nearest guide point
  const getDistanceToPath = (x: number, y: number): number => {
    let minDist = Infinity;
    for (const point of currentStroke.points) {
      const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
      if (dist < minDist) minDist = dist;
    }
    return minDist;
  };

  // Calculate tracing progress for current stroke
  const calculateProgress = useCallback(() => {
    if (tracedPoints.length < 2) return 0;

    let coveredPoints = 0;
    const tolerance = 25; // Smaller tolerance for more accurate tracing - requires staying close to the line

    for (const guidePoint of currentStroke.points) {
      for (const tracedPoint of tracedPoints) {
        const dist = Math.sqrt(
          (tracedPoint.x - guidePoint.x) ** 2 + (tracedPoint.y - guidePoint.y) ** 2
        );
        if (dist < tolerance) {
          coveredPoints++;
          break;
        }
      }
    }

    return Math.min(100, (coveredPoints / currentStroke.points.length) * 100);
  }, [tracedPoints, currentStroke.points]);

  // Update progress and check stroke completion
  useEffect(() => {
    const newProgress = calculateProgress();
    setProgress(newProgress);

    // Check if current stroke is completed (98% threshold - requires almost complete tracing)
    if (newProgress >= 98 && !completedStrokes.includes(currentStrokeIndex)) {
      const newCompletedStrokes = [...completedStrokes, currentStrokeIndex];
      setCompletedStrokes(newCompletedStrokes);

      // Check if all strokes are completed
      if (newCompletedStrokes.length === totalStrokes) {
        // All strokes done - letter completed!
        setCompletedLetters((prev) => [...new Set([...prev, currentLetter])]);
        speakCurrentLetter();
      } else {
        // Move to next stroke after a short delay
        setTimeout(() => {
          setCurrentStrokeIndex((prev) => prev + 1);
          setTracedPoints([]);
          setProgress(0);
          setShowStrokeAnimation(true);
          setAnimationProgress(0);
        }, 500);
      }
    }
  }, [
    tracedPoints,
    calculateProgress,
    completedStrokes,
    currentStrokeIndex,
    totalStrokes,
    currentLetter,
    speakCurrentLetter,
  ]);

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (showStrokeAnimation) {
      setShowStrokeAnimation(false);
    }
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    setTracedPoints([coords]);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const coords = getCanvasCoordinates(e);
    const distance = getDistanceToPath(coords.x, coords.y);

    // Only add point if close to the guide path
    if (distance < 60) {
      setTracedPoints((prev) => [...prev, coords]);
    }
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  const resetLetter = () => {
    setTracedPoints([]);
    setProgress(0);
    setCurrentStrokeIndex(0);
    setCompletedStrokes([]);
    setShowStrokeAnimation(true);
    setAnimationProgress(0);
  };

  const goToNextLetter = () => {
    if (currentLetterIndex === letters.length - 1) {
      advanceJourney('starter', 5);
      navigate('/kid-dashboard');
      return;
    }

    setCurrentLetterIndex((prev) => prev + 1);
    resetLetter();
  };

  const goToPrevLetter = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex((prev) => prev - 1);
      resetLetter();
    }
  };

  return (
    <div className="min-h-screen app-sky-background px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <KidioPageHeader
          backLabel="Back"
          backTo="/kid-dashboard"
          title={
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-gray-900">Trace the Letter</h1>
              <p className="text-gray-600 mt-2">Follow the dots to trace the letter!</p>
            </motion.div>
          }
        />

        {/* Letter Progress - scrollable */}
        <div className="mb-6 w-full overflow-x-auto pb-2">
          <div className="flex w-max min-w-full justify-start gap-2">
            {letters.map((letter, index) => (
              <motion.button
                key={letter}
                onClick={() => {
                  setCurrentLetterIndex(index);
                  resetLetter();
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: Math.min(index * 0.02, 0.5) }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                  completedLetters.includes(letter)
                    ? 'bg-green-500 text-white'
                    : index === currentLetterIndex
                    ? 'bg-[#2BADEE] text-white scale-110'
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                }`}
              >
                {completedLetters.includes(letter) ? (
                  <Star className="w-5 h-5 fill-current" />
                ) : (
                  letter
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-6"
        >
          {/* Current Letter Display */}
          <div className="flex flex-col items-center gap-3 text-center mb-4">
            <span className="text-8xl font-bold text-gray-200">{currentLetter}</span>
            <button
              type="button"
              onClick={speakCurrentLetter}
              aria-label={`Listen to letter ${currentLetter}`}
              className="flex items-center gap-2 rounded-full bg-[#E3F8FF] px-5 py-2.5 font-bold text-[#167EAF] shadow-sm transition-all hover:scale-105 hover:bg-[#D2F2FF] active:scale-95"
            >
              <Volume2 className="h-5 w-5" />
              Listen
            </button>
          </div>

          {/* Stroke Progress Indicator */}
          <div className="flex justify-center gap-2 mb-4">
            {letterData.strokes.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  completedStrokes.includes(index)
                    ? 'bg-green-500'
                    : index === currentStrokeIndex
                    ? 'bg-[#2BADEE] scale-125'
                    : 'bg-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">
              Stroke {currentStrokeIndex + 1}/{totalStrokes}
            </span>
          </div>

          {/* Canvas */}
          <div className="relative flex justify-center">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="border-4 border-dashed border-gray-200 rounded-2xl cursor-crosshair touch-none bg-white"
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
            />

            {/* Instruction Overlay */}
            {showStrokeAnimation && (
              <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#2BADEE] text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  Watch the guide, then trace stroke {currentStrokeIndex + 1}!
                </motion.div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Stroke Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#2BADEE] to-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={goToPrevLetter}
            disabled={currentLetterIndex === 0}
            className="flex items-center gap-2 px-4 py-3 bg-white rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={resetLetter}
            className="flex items-center gap-2 px-6 py-3 bg-amber-400 text-white rounded-full shadow-md hover:bg-amber-500 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Try Again</span>
          </button>

          <button
            onClick={goToNextLetter}
            className="flex items-center gap-2 px-5 py-3 bg-[#2BADEE] text-white rounded-full shadow-md hover:bg-[#1a9ad4] transition-colors"
          >
            <span>{currentLetterIndex === letters.length - 1 ? 'Done' : 'Next'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
