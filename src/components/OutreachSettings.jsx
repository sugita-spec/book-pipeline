import { Icon } from './Icons.jsx'

export function OutreachSettings({ profile, setProfile }) {
  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  return (
    <section className="outreach-settings" aria-labelledby="outreach-settings-title">
      <div className="outreach-heading">
        <span className="outreach-kicker"><Icon name="instagram" size={17} /> Instagram営業DM</span>
        <h2 id="outreach-settings-title">差出人情報を入力</h2>
        <p>各書籍の「DMをコピー」に自動で差し込みます。入力内容はこの端末にだけ保存されます。</p>
      </div>
      <div className="outreach-fields">
        <label>
          <span>差出人名・会社名</span>
          <input
            autoComplete="organization"
            onChange={(event) => updateField('senderName', event.target.value)}
            placeholder="例：山田太郎／株式会社○○"
            value={profile.senderName}
          />
        </label>
        <label>
          <span>連絡先</span>
          <input
            autoComplete="email"
            onChange={(event) => updateField('senderContact', event.target.value)}
            placeholder="例：info@example.jp"
            value={profile.senderContact}
          />
        </label>
      </div>
    </section>
  )
}
