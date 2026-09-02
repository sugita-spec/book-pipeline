export const defaultOutreachProfile = {
  senderName: '',
  senderContact: '',
}

export function buildInstagramOutreachMessage(book, profile = defaultOutreachProfile) {
  const authorName = book.authors.join('、') || '著者'
  const senderName = profile.senderName.trim() || '［お名前／会社名］'
  const senderContact = profile.senderContact.trim() || '［ご連絡先］'

  return `${authorName}様

突然のご連絡失礼いたします。
サンテレビの番組「生×カラ！TV」へのご出演について、ご相談したくご連絡いたしました。

ご著書『${book.title}』の出版情報を拝見し、ぜひ番組へのご出演をご検討いただけないかと考えております。

ご関心をお持ちいただけましたら、企画内容・収録日程・出演条件（費用を含む）をご案内いたします。まずは詳細をご覧いただくだけでも構いません。

どうぞよろしくお願いいたします。

${senderName}
${senderContact}`
}
