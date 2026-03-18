/**
 * Category structure and icon images ported from the jQuery CategoryGrid component.
 * CATEGORY_DATA maps parent category names to their subcategory groups.
 * ICON_MAP maps subcategory names to product image URLs.
 */

export interface CategoryGroup {
  group: string;
  items: string[];
}

export const CATEGORY_DATA: Record<string, CategoryGroup[]> = {
  'חומרת מחשב': [
    { group: 'מעבדים', items: ['מעבדי INTEL', 'מעבדי AMD'] },
    { group: 'לוחות אם', items: ['לוחות אם INTEL', 'לוחות אם AMD'] },
    { group: 'קירור למעבד', items: ['קירור אוויר למעבד', 'קירור נוזלי למעבד'] },
    { group: 'זכרונות', items: ['זכרון למחשב נייח DIMM', 'זכרון למחשב נייד SODDIM'] },
    { group: 'אחסון', items: ['אחסון SSD', 'אחסון HDD', 'SSD/HDD חיצוני', 'שרתי אחסון'] },
    { group: 'מארזים ומאוררים', items: ['מארזים', 'פנלים קדמיים ודלתות צד', 'מאוררים'] },
    { group: 'כרטיסי מסך', items: ['כרטיסי מסך NVIDIA', 'כרטיסי מסך AMD'] },
    { group: 'ספקי כוח', items: ['ספקי כוח למחשבים נייחים'] },
  ],
  'ציוד הקפי': [
    { group: 'ציוד הקפי למחשב', items: ['מקלדות', 'עכברים', 'סט מקלדת ועכבר', 'משטחים לעכבר', 'רמקולים', 'אוזניות', 'מצלמות', 'אביזרים', 'הגה לסימולטור'] },
    { group: 'מסכים', items: ['מסכים מחשב', 'מתקני תלייה'] },
    { group: 'תוכנות', items: ['מערכות הפעלה', 'אופיס', 'אנטי וירוס'] },
    { group: 'מקרן', items: ['מקרנים'] },
    { group: 'אל פסק', items: ['אל פסק'] },
  ],
  'מחשבים': [
    { group: 'מחשבים נייחים', items: ['הרכבות מבית אלוף המחשבים', 'מחשבי All In One (AIO)', 'מחשבי MiniPC', 'תחנות עבודה'] },
    { group: 'מחשבים ניידים', items: ['מחשב נייד', 'תחנות עגינה', 'משטחי קירור', 'תיקים', 'מטענים'] },
  ],
  'קונסולות': [
    { group: 'XBOX', items: ['קונסולות XBOX', 'אביזרי XBOX', 'משחקי XBOX'] },
    { group: 'Nintendo', items: ['קונסולות Nintendo', 'אביזרי Nintendo', 'משחקי NINTENDO'] },
    { group: 'Sony PlayStation', items: ['קונסולות PlayStation', 'אביזרי PlayStation', 'משחקי PLAYSTATION'] },
    { group: 'VALVE STEAM DECK', items: ['קונסולה VALVE STEAM DECK'] },
  ],
  'גיימינג': [
    { group: 'מחשבים', items: ['מחשבים ניידים גיימינג', 'מחשבים נייחים גיימינג'] },
    { group: 'ציוד הקפי', items: ['מסכי גיימינג', 'מקלדות גיימנג', 'עכברי גיימינג', 'אוזניות גיימינג'] },
    { group: 'עמדות ישיבה', items: ['כיסאות גיימינג', 'שולחנות גיימינג'] },
  ],
  'ציוד רשת': [
    { group: 'רשתות', items: ['FORTINET FORTIGATE', 'מתגים', 'פנלים'] },
    { group: 'ציוד ביתי', items: ['נתבים', 'מגדילי טווח'] },
    { group: 'ציוד למחשב', items: ['כרטיסי רשת | מתאם רשת'] },
    { group: 'תוכנות', items: ['רישיונות'] },
  ],
};

/** Aliases: different spellings that map to a CATEGORY_DATA key */
export const CATEGORY_ALIASES: Record<string, string> = {
  'ציוד היקפי': 'ציוד הקפי',
};

/** Subcategory name -> product image URL */
export const ICON_MAP: Record<string, string> = {
  'מעבדי INTEL': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043080/original/520819385efdf35da102e10cbaa406f9.png?1770287961',
  'מעבדי AMD': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1041859/original/f53e1b1f3a39b694d92bf536f1766ed0.png?1769806845',
  'לוחות אם INTEL': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043081/original/783f7353d412de4108be0c4717bfb2c9.png?1770288044',
  'לוחות אם AMD': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043081/original/783f7353d412de4108be0c4717bfb2c9.png?1770288044',
  'קירור אוויר למעבד': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043049/original/baa152a55c80f8c68363b699530154f5.png?1770286285',
  'קירור נוזלי למעבד': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1041861/original/c14c183b9ffc4c9c31d6e582bbbf5397.png?1769806875',
  'זכרון למחשב נייח DIMM': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043137/original/c7f0e8776b631cad5aab7b1c6f87c7ee.png?1770291163',
  'זכרון למחשב נייד SODDIM': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043138/original/221236c2b2a18b5cef2401f741ccbb2d.png?1770291174',
  'אחסון SSD': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043072/original/91eabd14724225502ffd0b069d88e9cc.png?1770286868',
  'אחסון HDD': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1041871/original/f74448f639a062fb0808811e6205ca8e.png?1769807015',
  'SSD/HDD חיצוני': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1041870/original/5e2579ec9354b31f8dab71f49f4e6b2a.png?1769806998',
  'שרתי אחסון': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043087/original/9dc4aac83fe425ecddd53655fbdbd893.png?1770288614',
  'מארזים': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043089/original/1c455807abb5d239c2a5a838bbe535ac.png?1770288954',
  'פנלים קדמיים ודלתות צד': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043088/original/e40793fb5681c1798da71294cf40fee8.png?1770288912',
  'מאוררים': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043093/original/eb9330d7b6fdef82ef3e7b9c8db33d69.png?1770289208',
  'כרטיסי מסך NVIDIA': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043094/original/76757bacd906d761284b8cf490668d06.png?1770289244',
  'כרטיסי מסך AMD': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043095/original/d9b8b63a56f69d0c344aa30154fd659c.png?1770289283',
  'ספקי כוח למחשבים נייחים': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043092/original/bc9860ba708c3bc59ef5afda2d815d10.png?1770289159',
  'מקלדות': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043073/original/fad58f89ede7be141d1b9d9e0d63a490.png?1770286887',
  'עכברים': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043075/original/b358df7ddaceda1cb497dea2ce8b2290.png?1770287224',
  'סט מקלדת ועכבר': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043096/original/2621db1427d08c76d0e2657fdd5e637c.png?1770289548',
  'משטחים לעכבר': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043102/original/a9241083e9bc55e6a3448a71788276de.png?1770289717',
  'רמקולים': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043071/original/84970be88f7871e1265644f7c9e4f4fa.png?1770286845',
  'אוזניות': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043103/original/c534bcdd1c9fc73016b30804e8da2cca.png?1770289757',
  'מצלמות': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043064/medium/4c38a2b7e744262cde8b076dc597b8d4.png?1770286688',
  'אביזרים': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043127/original/8edd8df32dd18676964a0d43325aa36b.png?1770290253',
  'מסכים מחשב': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043067/original/dced52aa8bc8b324d7b46f26222fcdd2.png?1770286758',
  'מתקני תלייה': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043108/original/c8cdda549b379e574c962cf280a4f1bc.png?1770290022',
  'מערכות הפעלה': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043097/original/3b578b87436b1c484a5379e733724d6d.png?1770289575',
  'אופיס': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043100/original/ac80ba96f7534b400ae6ed870031c38a.png?1770289629',
  'אנטי וירוס': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043054/original/4335f1b9bffe14b4b4e65201a22e5896.png?1770286380',
  'מקרנים': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043091/original/5b1be2e1b658393215e830a2d25c2c73.png?1770289101',
  'אל פסק': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043131/original/7f4c2903ef959795f407494b84a2cb15.png?1770290804',
  'הרכבות מבית אלוף המחשבים': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043089/original/1c455807abb5d239c2a5a838bbe535ac.png?1770288954',
  'מחשבי All In One (AIO)': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043107/original/d2082cf53b968ceb68d899f1c954be23.png?1770289960',
  'מחשבי MiniPC': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043068/original/de8a89928cc5821460578a1af76323e6.png?1770286778',
  'תחנות עבודה': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043063/original/635167e273344a0608f5e150f9a09128.png?1770286665',
  'מחשב נייד': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043106/original/115f6182a08857a54b61378e1ed2e92e.png?1770289911',
  'תחנות עגינה': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043061/original/5c5a5da8be47264a1929919f97d14962.png?1770286603',
  'משטחי קירור': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043104/original/7005028ee290a92ebe6a91716f9c8a91.png?1770289829',
  'תיקים': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043090/original/427d9f92b6f283ba7ac95f0ef328a4c2.png?1770289017',
  'מטענים': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043105/original/0039c3707238efade6b6d23aeaaff55c.png?1770289869',
  'קונסולות XBOX': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043060/original/51d2db2a8ff5839c14dd68cc3a63bb65.png?1770286574',
  'אביזרי XBOX': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043060/original/51d2db2a8ff5839c14dd68cc3a63bb65.png?1770286574',
  'קונסולות Nintendo': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043058/original/db7d3bfe5421658380b87b0f0b237ad5.png?1770286509',
  'אביזרי Nintendo': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043058/original/db7d3bfe5421658380b87b0f0b237ad5.png?1770286509',
  'קונסולות PlayStation': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043059/original/8de3f5963173b3b8aaa517d54b3b90e0.png?1770286531',
  'אביזרי PlayStation': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043059/original/8de3f5963173b3b8aaa517d54b3b90e0.png?1770286531',
  'קונסולה VALVE STEAM DECK': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043065/original/9ed75e3afae79ec816381b1c8f4b8a72.png?1770286711',
  'מחשבים ניידים גיימינג': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043106/original/115f6182a08857a54b61378e1ed2e92e.png?1770289911',
  'מחשבים נייחים גיימינג': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043063/original/635167e273344a0608f5e150f9a09128.png?1770286665',
  'מסכי גיימינג': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043067/original/dced52aa8bc8b324d7b46f26222fcdd2.png?1770286758',
  'מקלדות גיימנג': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043134/original/b9f5f50eadb8ea113b2fc2c64aeac577.png?1770291128',
  'עכברי גיימינג': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043135/original/518cfe5b77e98670c7e16702259d971d.png?1770291138',
  'אוזניות גיימינג': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043133/original/2a96a2afa7e45bc5b97236d4f1a59c02.png?1770291116',
  'כיסאות גיימינג': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043109/original/ebd5e67c222e7fdee8de246a1ed9f807.png?1770290068',
  'שולחנות גיימינג': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043110/original/64293171f5ca9d842260d540e4ed9e63.png?1770290122',
  'FORTINET FORTIGATE': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043062/original/375d0f3cf95103ba77b8dbf932ceda89.png?1770286641',
  'מתגים': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043146/original/a76edc62523ba396f3bee213ac11e8a5.png?1770291613',
  'פנלים': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043062/original/375d0f3cf95103ba77b8dbf932ceda89.png?1770286641',
  'נתבים': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043070/original/afc550c5d111f017fa821168ede5cda8.png?1770286825',
  'מגדילי טווח': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043139/original/2461ef2b97222336d54304d10b8fc8fe.png?1770291188',
  'כרטיסי רשת | מתאם רשת': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043145/original/af6d353b1f4bf8cbd5a74896a50d0e49.png?1770291596',
  'רישיונות': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1043136/original/bfc08442fd7a8df7bb7cd1de9dd0caca.png?1770291152',
  'הגה לסימולטור': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1046780/original/61c29f5dd99488a963bae0a39f6dfcaf.png?1771870610',
  'משחקי XBOX': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1044915/original/cc0aaa23daad17c2e30d51e3164c8bc9.png?1771083102',
  'משחקי NINTENDO': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1044914/original/babbf253a72efe2bf5aea3201ec77667.png?1771083076',
  'משחקי PLAYSTATION': 'https://d3m9l0v76dty0.cloudfront.net/system/photos/1044913/original/8ec9ac93f321b757ba6588293e99021c.png?1771083057',
};
