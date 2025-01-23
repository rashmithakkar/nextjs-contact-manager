import { NextResponse } from 'next/server';

interface Contact {
  id?: string;
  name: string;
  email: string;
  mobile: string;
}

let contacts: Contact[] = [];

export async function GET() {
  return NextResponse.json(contacts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newContact = { ...body, id: `${Date.now()}` };
  contacts.push(newContact);
  return NextResponse.json({ message: 'Contact added!' });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const index = contacts.findIndex((contact) => contact.id === body.id);
  if (index > -1) {
    contacts[index] = body;
    return NextResponse.json({ message: 'Contact updated!' });
  }
  return NextResponse.json({ message: 'Contact not found!' }, { status: 404 });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  contacts = contacts.filter((contact) => contact.id !== body.id);
  return NextResponse.json({ message: 'Contact deleted!' });
}
