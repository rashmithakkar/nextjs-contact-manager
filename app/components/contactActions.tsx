'use client';

import { useState } from 'react';
import { Contact } from '@/app/types/contacts';
import ContactModal from './contactmodal';
import ContactGrid from './contactgrid';

interface ContactActionsProps {
  initialContacts: Contact[];
}

export default function ContactActions({ initialContacts }: ContactActionsProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleAddNew = () => {
    setEditingContact(null); // Ensure we're not in edit mode
    setModalOpen(true);
  };

  const handleSave = async (contact: Contact) => {
    try {
      if (editingContact) {
        // Edit existing contact
        await fetch(`http://localhost:5001/api/contacts/${editingContact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contact),
        });
      } else {
        // Create new contact
        await fetch('http://localhost:5001/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contact),
        });
      }
      
      // Refresh contacts list
      const response = await fetch('http://localhost:5001/api/contacts');
      const updatedContacts = await response.json();
      setContacts(updatedContacts);
      
      setModalOpen(false);
      setEditingContact(null);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5001/api/contacts/${id}`, { 
        method: 'DELETE' 
      });
      // Update local state after successful deletion
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <>
      <ContactGrid 
        contacts={contacts}
        onEdit={(contact) => {
          setEditingContact(contact);
          setModalOpen(true);
        }}
        onDelete={handleDelete}

        onAddNew={handleAddNew}
      />
      <ContactModal
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingContact(null);
        }}
        onSave={handleSave}
        contact={editingContact}
      />
    </>
  );
}