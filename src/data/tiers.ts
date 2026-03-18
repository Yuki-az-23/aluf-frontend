export interface TierConfig {
  name: string;
  price: number;
  specs: string[];
  color: string;
}

export const gamingTiers: TierConfig[] = [
  {
    name: 'Tier 1 — Entry',
    price: 3999,
    specs: ['Intel i5-13400F', 'RTX 4060', '16GB DDR5', '512GB NVMe SSD'],
    color: 'from-blue-500 to-cyan-400',
  },
  {
    name: 'Tier 2 — Performance',
    price: 6999,
    specs: ['Intel i7-13700K', 'RTX 4070 Ti', '32GB DDR5', '1TB NVMe SSD'],
    color: 'from-primary to-amber-400',
  },
  {
    name: 'Tier 3 — Ultimate',
    price: 12999,
    specs: ['Intel i9-13900K', 'RTX 4090', '64GB DDR5', '2TB NVMe SSD'],
    color: 'from-purple-600 to-secondary',
  },
];
