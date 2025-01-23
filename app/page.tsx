import { Suspense } from 'react';
import ContactActions from './components/contactActions';

async function getContacts() {
  const res = await fetch('http://localhost:5001/api/contacts', {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch contacts');
  return res.json();
}

export default async function Home() {
  const contacts = await getContacts();

  return (
    <div className="p-6">
      <Suspense fallback={<div>Loading contacts...</div>}>
        <ContactActions initialContacts={contacts} />
      </Suspense>
    </div>
  );
}