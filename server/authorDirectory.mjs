// Public corporate profiles checked on 2026-07-16.
// Entries are keyed by the author label used by BOOK☆WALKER.
export const authorDirectory = new Map(Object.entries({
  '中島敦': { employerName: '株式会社第一不動産', employerUrl: 'https://www.daiichi-fu.co.jp/', employerPhone: '054-272-1111' },
  '脇健仁': { employerName: '株式会社ゆりかご', employerUrl: 'https://www.yurikago-kaigo.com/', employerPhone: '029-229-7562' },
  '佐野敏哉': { employerName: '株式会社Smash', employerUrl: 'https://smash.ne.jp/', employerPhone: '03-3406-8858' },
  '露木裕良': { employerName: 'ZAE Japan株式会社', employerUrl: 'https://zae.jp/', employerPhone: '03-6860-8392' },
  '端羽英子': { employerName: '株式会社ビザスク', employerUrl: 'https://corp.visasq.co.jp/', employerPhone: '03-6407-8405' },
  '木下智之': { employerName: '合同会社ゆうあい防災', employerUrl: 'https://ui-b.co.jp/', employerPhone: '047-409-5255' },
  '橋本志津': { employerName: '株式会社アーク', employerUrl: 'https://www.arkfarm.co.jp/', employerPhone: '0191-63-5151' },
  '清水隆司': { employerName: '株式会社JPRON（日本メディメンタル研究所）', employerUrl: 'https://www.medi-mental.com/', employerPhone: '03-5953-1540' },
  '横松邦明': { employerName: '株式会社横松建築設計事務所', employerUrl: 'https://www.yokomatsu.info/', employerPhone: '028-635-7226', instagramUrl: 'https://www.instagram.com/kuni_architect/' },
  '武内大': { employerName: 'LULA美容クリニック', employerUrl: 'https://lula-shinjuku.com/', employerPhone: '03-6265-9310', instagramUrl: 'https://www.instagram.com/daitakeuchi0428/' },
  'リライズコンサルティング株式会社': { employerName: 'リライズコンサルティング株式会社', employerUrl: 'https://rerise-consulting.com/', employerPhone: '06-4708-6044' },
  '曽根恵子': { employerName: '株式会社夢相続', employerUrl: 'https://www.yume-souzoku.co.jp/', employerPhone: '03-6222-9233', instagramUrl: 'https://www.instagram.com/sone.keiko.yume/' },
  '久野康成': { employerName: '東京コンサルティンググループ', employerUrl: 'https://kuno-cpa.co.jp/', employerPhone: '03-5369-2930' },
  '鈴木聡': { employerName: '合同会社鈴木聡薬業事務所', employerUrl: 'https://j-sspo.com/', employerPhone: '公開なし' },
  '仲思遥': { employerName: '株式会社Linc', employerUrl: 'https://linc-info.com/', employerPhone: '公開なし' },
  '松本淳': { employerName: '株式会社エムスリー・カンパニー', employerUrl: 'https://m3c.co.jp/', employerPhone: '公開なし' },
}))

export function findEmployment(authors) {
  for (const author of authors) {
    const employment = authorDirectory.get(author)
    if (employment) {
      return {
        facebookUrl: '',
        instagramUrl: '',
        ...employment,
        employmentStatus: 'confirmed',
      }
    }
  }

  return {
    employerName: '未確認',
    employerUrl: '',
    employerPhone: '未確認',
    facebookUrl: '',
    instagramUrl: '',
    employmentStatus: 'unverified',
  }
}
