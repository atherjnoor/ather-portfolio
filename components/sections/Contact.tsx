import { contact, profile } from '@/content/profile';
import CopyEmail from '../fx/CopyEmail';

/** Sheet 07 — rendered inside the About section, as in the original layout. */
export default function Contact() {
  return (
    <div className="panel crop contact rv" id="contact" data-name="Contact" style={{ scrollMarginTop: 60 }}>
      <span className="label" style={{ color: 'var(--mint)' }}>
        {contact.label}
      </span>
      <h3>{contact.heading}</h3>
      <p className="note" style={{ fontSize: 16, color: 'var(--muted)' }}>
        {contact.lead}
      </p>
      <div className="email">
        <a href={'mailto:' + profile.email}>{profile.email}</a>
        <CopyEmail />
      </div>
      <ul className="links">
        <li>
          <a href={profile.github.url} target="_blank" rel="noopener">
            <span>GitHub</span>
            <span>{profile.github.handle} ↗</span>
          </a>
        </li>
        <li>
          <a href={profile.linkedin.url} target="_blank" rel="noopener">
            <span>LinkedIn</span>
            <span>{profile.linkedin.handle} ↗</span>
          </a>
        </li>
      </ul>
      <p className="note">{contact.note}</p>
    </div>
  );
}
