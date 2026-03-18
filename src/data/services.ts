export interface ServiceItem {
  titleKey: string;
  descKey: string;
  icon: string;
}

export const services: ServiceItem[] = [
  { titleKey: 'services.lab.title', descKey: 'services.lab.desc', icon: 'build' },
  { titleKey: 'services.gaming.title', descKey: 'services.gaming.desc', icon: 'sports_esports' },
  { titleKey: 'services.shipping.title', descKey: 'services.shipping.desc', icon: 'local_shipping' },
];
