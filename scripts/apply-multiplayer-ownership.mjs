import fs from 'node:fs';

const path = 'src/App.jsx';
let s = fs.readFileSync(path, 'utf8');

const anchor = "const mergedOwners = { ...(snapshotRef.current?.owners || {}), ...(message.owners || {}) };";
const replacement = `// Host ownership wins on conflicts; import guest-owned properties only when unclaimed.
            const hostOwners = snapshotRef.current?.owners || {};
            const guestOwners = message.owners || {};
            const mergedOwners = { ...guestOwners, ...hostOwners };`;

if (s.includes(anchor)) {
  s = s.replace(anchor, replacement);
  fs.writeFileSync(path, s, 'utf8');
} else if (!s.includes('Host ownership wins on conflicts; import guest-owned properties only when unclaimed.')) {
  throw new Error('Multiplayer ownership merge anchor not found; refusing to continue.');
}
