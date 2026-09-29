type P = { className?: string }
export function Owl({ className = '' }: P) {
  return <svg className={`doodle ${className}`} viewBox="0 0 120 140" aria-hidden="true">
    <path d="M20 48 L14 18 L40 36 Q60 28 80 36 L106 18 L100 48 Q112 80 96 112 Q60 136 24 112 Q8 80 20 48Z" fill="var(--secondary)" stroke="var(--silver)" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M38 96 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0" fill="none" stroke="var(--violet)" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M42 110 q6 6 12 0 q6 6 12 0 q6 6 12 0" fill="none" stroke="var(--violet)" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="42" cy="62" r="17" fill="var(--paper)" stroke="var(--silver)" strokeWidth="3"/>
    <circle cx="78" cy="62" r="17" fill="var(--paper)" stroke="var(--silver)" strokeWidth="3"/>
    <circle cx="45" cy="63" r="7" fill="var(--background)"/><circle cx="75" cy="63" r="7" fill="var(--background)"/>
    <circle cx="47" cy="60" r="2.2" fill="var(--paper)"/><circle cx="77" cy="60" r="2.2" fill="var(--paper)"/>
    <path d="M55 76 L60 88 L65 76Z" fill="var(--primary)" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M30 134 h60" stroke="var(--silver)" strokeWidth="4" strokeLinecap="round"/>
  </svg>
}
export function Crow({ className = '' }: P) {
  return <svg className={`doodle ${className}`} viewBox="0 0 160 110" aria-hidden="true">
    <path d="M18 70 Q30 40 62 38 Q70 18 92 20 Q108 22 112 36 L138 40 L112 48 Q112 70 92 82 L60 86 L20 104 L36 84 Q16 84 18 70Z" fill="var(--background)" stroke="var(--silver)" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M44 62 Q66 52 86 64" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="98" cy="32" r="4.5" fill="var(--primary)"/>
    <path d="M74 86 l-4 16 M84 84 l2 16" stroke="var(--silver)" strokeWidth="3" strokeLinecap="round"/>
  </svg>
}
export function Web({ className = '' }: P) {
  return <svg className={`doodle ${className}`} viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="var(--silver)" strokeWidth="1.4" opacity=".55">
    <path d="M0 0 L100 100 M0 0 L100 40 M0 0 L40 100 M0 0 L100 0 M0 0 L0 100"/>
    {[25, 48, 72, 96].map(r => <path key={r} d={`M${r} 0 Q${r * .8} ${r * .25} ${r * .93} ${r * .38} Q${r * .62} ${r * .58} ${r * .7} ${r * .7} Q${r * .45} ${r * .78} ${r * .38} ${r * .93} Q${r * .2} ${r * .82} 0 ${r}`}/>)}
  </svg>
}
export function Potion({ className = '' }: P) {
  return <svg className={`doodle ${className}`} viewBox="0 0 80 110" aria-hidden="true">
    <rect x="30" y="6" width="20" height="14" rx="3" fill="var(--paper)" stroke="var(--silver)" strokeWidth="2.5"/>
    <path d="M33 20 v16 Q10 50 12 76 Q14 104 40 104 Q66 104 68 76 Q70 50 47 36 v-16Z" fill="var(--secondary)" stroke="var(--silver)" strokeWidth="3"/>
    <path d="M16 70 Q40 60 64 70 Q66 100 40 100 Q14 100 16 70Z" fill="var(--primary)" opacity=".85"/>
    <circle cx="30" cy="80" r="3" fill="var(--paper)"/><circle cx="46" cy="88" r="2" fill="var(--paper)"/><circle cx="38" cy="72" r="1.6" fill="var(--paper)"/>
  </svg>
}
export function Staple({ className = '' }: P) {
  return <span className={`staple ${className}`} aria-hidden="true"/>
}