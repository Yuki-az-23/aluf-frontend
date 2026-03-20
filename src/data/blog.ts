export interface BlogPost {
  title: string;
  date: string;
  image: string;
  excerpt: string;
  href?: string;
}
// missing the contion to the blog post , real ones form https://www.aluf.co.il/632283-%D7%91%D7%9C%D7%95%D7%92?order=down_created_at
export const blogPosts: BlogPost[] = [
  {
    title: 'מדריך: איך לבחור כרטיס מסך ב-2024',
    date: '15 מרץ, 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcHu3gLVDLsnxXgAZTngrzBtXOvoCp5lPIpu-GPcKtxFUF9p0ZGWK2z_sJ3Aq1zkOzPtco5ic_jArZm5deM-L64G4EJjvAN3rn6U3N6jgf28rB70zj6wq05mdVX03IwMZ7nvzAMWBwmVotvyQde8_vL-oEy0wWdD0PCq2l4ZWBjOTAv8PK8Q_u0ebmIba7xLNIwJtLKjfB5K3P-h1MZDZg76zpI_M8pAJaTjPcTeC1xloycD0li-D-vBzL3pZ4KFXfHxQZoj579KI',
    excerpt: 'כל מה שצריך לדעת כדי לבחור את הכרטיס המסך המושלם למחשב שלכם',
  },
  {
    title: 'DDR5 vs DDR4: האם כדאי לשדרג?',
    date: '10 מרץ, 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt3XEIxxkCyjpoF6F2G_7YXlrGVLrQCZCfuKlTrptAAMdO-yBcgCaSWWpZOpEjMx7s26bk-S53Cn5Noa8jsITVe2PI45hRgvGs5ATH6Z_HfHpQb7-uLb0JeuTkJ0_iG6OLm7BuSaf-uN46nhhTkRJD7OzZHe8r65aXkMYr82lz2sMv4LeSkZ9oOCdpG7unDyj7Id13VmBP_9AEgF8V8rpszV2lUQXwn2ZFEVs4ZFPBTc5IXyeRxMTIRbQ-lRp8oEvYJaEty3mpNVE',
    excerpt: 'השוואה מקיפה בין שני דורות הזיכרון והמלצות לקנייה חכמה',
  },
  {
    title: '5 טיפים לתחזוקת מחשב גיימינג',
    date: '5 מרץ, 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm-jhTdRnCMC6PTVTddH9Ek7hY42UsZlET87a5UN-u3TPYtXb6JMLcTAls7eFaFGmwHCCLvHxZCpRzvd5Mn4MDl-e8SjLCSfsJKT6NPfDH-Q9OlppjlCcnDy3CD0DJuu4gHF15lB-uTxb_AmWq9P-wnkCZYJ46LgU6T8TUbnrxcbQZtPdJltqYt09Zb9E0K7emWpMv1oKf6vBfSwSmoYJYSBjX5OClSUCkSoSpJBhK9DficcbdL8gw_b-xeDyrtLM4SjTAWZV5oLE',
    excerpt: 'שמרו על ביצועי המחשב שלכם בשיא עם הטיפים הפשוטים האלה',
  },
];
