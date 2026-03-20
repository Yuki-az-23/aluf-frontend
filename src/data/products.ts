export interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
  specs: string[];
  price: number;
  originalPrice?: number;
  inStock: boolean;
  href?: string;
  filterAttrs?: Record<string, string>;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface ItemDetail {
  id: string;
  title: string;
  sku?: string;
  images: string[];
  price: number;
  originalPrice?: number;
  descriptionHtml: string;
  specs: string[];
  specRows: SpecRow[];
  relatedItems: Product[];
  inStock: boolean;
  warranty?: string;
  faqItems?: { question: string; answer: string }[];
}

export interface BlogPostItem {
  id: string;
  title: string;
  image: string;
  excerpt: string;
  date: string;
  href: string;
}

export interface BlogPostDetail {
  title: string;
  image: string;
  date: string;
  contentHtml: string;
}

export const featuredProducts: Product[] = [
  {
    id: '1',
    title: 'ASUS ROG Zephyrus G16 RTX 4080',
    category: 'מחשבים ניידים',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQxyOH8O043BcMwhsQN_kM4PVF-L9l8Jb9O7H39Wx5DQVIhLtUCLyWAOssVBRdZPerfhaCdbbbA3teoEHfHEcU72IO6tHWykMC6fXLY91_Ej66b4_G85PpCb5dJnrOB0VjjO5nKa1EDvjPrYSWyQ6jxx6idFRV0Pr1qeb8If8-19H9Mj_a-eXRliop-y-LxERw1arGmKB9iU1uHiQ7XjddDfz3qthfLyLwKwv1-VbmTCp7hk4EpmWI6je6SJoOyIc7nyWkbtIwR8g',
    specs: ['Intel Ultra 9 185H', 'RTX 4080', '32GB DDR5'],
    price: 9999,
    inStock: true,
  },
  {
    id: '2',
    title: 'MSI MAG Z790 TOMAHAWK WIFI',
    category: 'לוחות אם',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEqISU3TirfsOGPyRAxAFlhBUCJxI65kvbXi_rGzXWDl14ZkbaiJFHt10EZT7IkP2afSRg7quWNqZeFDwtppcRGWbbYB_a0CRc1Sovdtl5nNJl2Ks5yimf7gr0inBvySwdd4aC2HKfNb56Ctjmsw47iGDtlfABxqZjvhcCCeFZouVhJk_tfjfPfhjOxeWrd8khGRwrbs2dYLBTPdLbZIqPvYR-cq4TN5YlwXZKi600vmtTN7R5_sPD6uH6P_esIE6XH6GM5V1hlRI',
    specs: ['LGA 1700', 'DDR5', 'WiFi 6E'],
    price: 1290,
    originalPrice: 1490,
    inStock: true,
  },
  {
    id: '3',
    title: 'Corsair Vengeance 32GB DDR5 6000MHz',
    category: 'זיכרון RAM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7OXqpJJv18Vq3bWyZag5e3KG1nkoKBCXNzY_pchsbc666upNA1FdzTnL2TJzpc-MEivE1dDIKju7bXvFUaXNPcC23c36eQsrYEkEyAWdVrmCKnQ0A1eu17okeGOJ4h9S78BaQ09elZrkhXMsRgt4ni_4OYKaA3H1dbkngpWC-4aKkierv40GD3mHNerBmuQKQ7LQAuUuW5ce2OY1FdLWfx-nJnBdV0xzBg9O5qFh9Ur5IdyLKdUF51f7z0VNdEKeVmbUHGc_xZVk',
    specs: ['DDR5', '6000MHz', 'CL36'],
    price: 850,
    inStock: true,
  },
  {
    id: '4',
    title: 'Samsung Odyssey G7 27" 240Hz',
    category: 'מסכים',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsa3qiEr584OX3vvkx5O9bJIqpfqxMYSPHSOUc7hatDUCe0N30VXgqjD6BlZGzuIY_vN660JV5B3XY_z8Rpo9CgxT5Bvf__WfAejqihFsCWHOSnuX29eWh-xRvMlbqBAqqd5SRUV3beaggqWD_sRswyF5mAmGvwUDnajyghC9vKK4UznMfZCgsyQcFnC7CslmclVLosuGzhMrMdiG8oB4AD6JdXdKsdK0SudHLHVnjlhdX6vBkFOWCqxvIRhPB3WdvO08Wzthqs24',
    specs: ['27"', '2560x1440', '240Hz'],
    price: 2450,
    originalPrice: 2890,
    inStock: true,
  },
];
