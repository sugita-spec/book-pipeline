import { Icon } from './Icons.jsx'

export function AppFooter({ meta }) {
  return (
    <footer className="app-footer">
      <p><Icon name="info" size={19} /> {meta?.notice || '勤務先は公開プロフィールをもとに確認。確認できない著者は「未確認」と表示します。'}</p>
    </footer>
  )
}
