'use client';

import { useState } from 'react';
import JourneyBoard from '@/components/JourneyBoard';

export default function Home() {
  const [selectedDealId, setSelectedDealId] = useState<string>();

  return (
    <main>
      <JourneyBoard selectedDealId={selectedDealId} />
    </main>
  );
}