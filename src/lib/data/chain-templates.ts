import type { ChainTemplate } from '@/types';

export const defaultChainTemplates: ChainTemplate[] = [
  {
    id: 'brushing-teeth',
    title: 'Brushing Teeth',
    description: 'Complete tooth brushing routine for daily hygiene',
    category: 'hygiene',
    ageRange: '3-12 years',
    difficulty: 'beginner',
    estimatedTime: 5,
    steps: [
      {
        title: 'Get toothbrush',
        description: 'Pick up toothbrush from holder',
        order: 1,
      },
      {
        title: 'Turn on water',
        description: 'Turn faucet handle to start water flow',
        order: 2,
      },
      {
        title: 'Wet toothbrush',
        description: 'Hold toothbrush under running water',
        order: 3,
      },
      {
        title: 'Apply toothpaste',
        description: 'Squeeze small amount of toothpaste onto bristles',
        order: 4,
      },
      {
        title: 'Brush front teeth',
        description: 'Brush front teeth in circular motions for 30 seconds',
        order: 5,
      },
      {
        title: 'Brush back teeth',
        description: 'Brush back teeth on both sides for 30 seconds each',
        order: 6,
      },
      {
        title: 'Brush tongue',
        description: 'Gently brush tongue surface',
        order: 7,
      },
      {
        title: 'Rinse mouth',
        description: 'Take water in mouth, swish, and spit out',
        order: 8,
      },
      {
        title: 'Rinse toothbrush',
        description: 'Clean toothbrush under running water',
        order: 9,
      },
      {
        title: 'Put toothbrush away',
        description: 'Place toothbrush back in holder',
        order: 10,
      },
    ],
  },
  {
    id: 'getting-dressed',
    title: 'Getting Dressed',
    description: 'Complete morning dressing routine',
    category: 'dressing',
    ageRange: '4-10 years',
    difficulty: 'intermediate',
    estimatedTime: 10,
    steps: [
      {
        title: 'Choose clothes',
        description: 'Select appropriate clothes for the day',
        order: 1,
      },
      {
        title: 'Put on underwear',
        description: 'Put on clean underwear',
        order: 2,
      },
      {
        title: 'Put on shirt',
        description: 'Put arms through sleeves and pull over head',
        order: 3,
      },
      {
        title: 'Put on pants',
        description: 'Step into pants and pull up to waist',
        order: 4,
      },
      {
        title: 'Put on socks',
        description: 'Put on both socks, making sure they fit properly',
        order: 5,
      },
      {
        title: 'Put on shoes',
        description: 'Put on shoes on correct feet',
        order: 6,
      },
      {
        title: 'Tie shoes or fasten',
        description: 'Tie laces or fasten velcro/buckles',
        order: 7,
      },
    ],
  },
  {
    id: 'washing-hands',
    title: 'Washing Hands',
    description: 'Proper handwashing technique',
    category: 'hygiene',
    ageRange: '2-8 years',
    difficulty: 'beginner',
    estimatedTime: 2,
    steps: [
      {
        title: 'Turn on water',
        description: 'Turn faucet to warm water',
        order: 1,
      },
      {
        title: 'Wet hands',
        description: 'Put hands under running water',
        order: 2,
      },
      {
        title: 'Apply soap',
        description: 'Pump soap onto palm',
        order: 3,
      },
      {
        title: 'Rub hands together',
        description: 'Rub palms together to create lather',
        order: 4,
      },
      {
        title: 'Scrub between fingers',
        description: 'Clean between all fingers',
        order: 5,
      },
      {
        title: 'Scrub for 20 seconds',
        description: 'Continue scrubbing for at least 20 seconds',
        order: 6,
      },
      {
        title: 'Rinse hands',
        description: 'Rinse all soap off hands with water',
        order: 7,
      },
      {
        title: 'Dry hands',
        description: 'Dry hands with clean towel',
        order: 8,
      },
      {
        title: 'Turn off water',
        description: 'Turn off faucet',
        order: 9,
      },
    ],
  },
  {
    id: 'setting-table',
    title: 'Setting the Table',
    description: 'Set table for family dinner',
    category: 'daily-living',
    ageRange: '5-12 years',
    difficulty: 'intermediate',
    estimatedTime: 8,
    steps: [
      {
        title: 'Clear table',
        description: 'Remove any items from table surface',
        order: 1,
      },
      {
        title: 'Place placemats',
        description: 'Put placemat at each seat',
        order: 2,
      },
      {
        title: 'Set plates',
        description: 'Place plate in center of each placemat',
        order: 3,
      },
      {
        title: 'Place forks',
        description: 'Put fork to the left of each plate',
        order: 4,
      },
      {
        title: 'Place knives',
        description: 'Put knife to the right of each plate',
        order: 5,
      },
      {
        title: 'Place spoons',
        description: 'Put spoon to the right of each knife',
        order: 6,
      },
      {
        title: 'Set glasses',
        description: 'Place glass above each knife',
        order: 7,
      },
      {
        title: 'Add napkins',
        description: 'Place napkin under fork or on plate',
        order: 8,
      },
    ],
  },
  {
    id: 'making-bed',
    title: 'Making the Bed',
    description: 'Complete bed-making routine',
    category: 'daily-living',
    ageRange: '6-14 years',
    difficulty: 'intermediate',
    estimatedTime: 5,
    steps: [
      {
        title: 'Remove pillows',
        description: 'Take pillows off the bed',
        order: 1,
      },
      {
        title: 'Pull up sheet',
        description: 'Pull bottom sheet tight and smooth',
        order: 2,
      },
      {
        title: 'Straighten top sheet',
        description: 'Pull top sheet up and smooth out wrinkles',
        order: 3,
      },
      {
        title: 'Pull up blanket',
        description: 'Pull blanket up to head of bed',
        order: 4,
      },
      {
        title: 'Fold down top',
        description: 'Fold top sheet and blanket down neatly',
        order: 5,
      },
      {
        title: 'Fluff pillows',
        description: 'Fluff and shape pillows',
        order: 6,
      },
      {
        title: 'Place pillows',
        description: 'Put pillows at head of bed',
        order: 7,
      },
    ],
  },
];
