export interface ServiceItem {
  titleKey: string;
  descKey: string;
  icon: string;
}
//there is no strievscse bu we need to crate a ticket maker based on htem and all of data for contant is form the web site page form this thow pages -https://www.aluf.co.il/pages/52434-%D7%98%D7%9B%D7%A0%D7%90%D7%99-%D7%A2%D7%93-%D7%94%D7%91%D7%99%D7%AA https://www.aluf.co.il/pages/52435-%D7%9E%D7%A2%D7%91%D7%93%D7%94-%D7%9C%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D
export const services: ServiceItem[] = [
  { titleKey: 'services.lab.title', descKey: 'services.lab.desc', icon: 'build' },
  { titleKey: 'services.gaming.title', descKey: 'services.gaming.desc', icon: 'sports_esports' },
  { titleKey: 'services.shipping.title', descKey: 'services.shipping.desc', icon: 'local_shipping' },
];
