'use client';

import { Contact } from '@/app/types/contacts';
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  InputAdornment,
  Button,
  DialogTitle,
  DialogContentText,
  DialogActions,
  DialogContent,
  Dialog
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { useState, useMemo } from 'react';

interface ContactGridProps {
  contacts: Contact[];
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
  onToggleAccess?: (contact: Contact) => void;
  onAddNew?: () => void;
}

export default function ContactGrid({ contacts, onEdit, onDelete, onToggleAccess, onAddNew }: ContactGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (contactToDelete && onDelete) {
      onDelete(contactToDelete.id);
    }
    setDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (contact?.name?.toLowerCase() || '').includes(searchLower) ||
        (contact?.email?.toLowerCase() || '').includes(searchLower) ||
        (contact?.mobile?.toLowerCase() || '').includes(searchLower)
      );
    });
  }, [contacts, searchQuery]);

  return (
    <>
      <Box 
        sx={{ 
          mb: 2, 
          mt: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}
      >
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddNew}
        >
          Add Contact
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="contacts table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow
                key={contact.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {contact.name || ''}
                </TableCell>
                <TableCell>{contact.email || ''}</TableCell>
                <TableCell>{contact.mobile || ''}</TableCell>
                <TableCell align="right">
                  {onEdit && (
                    <IconButton 
                      onClick={() => onEdit(contact)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton 
                    onClick={() => handleDeleteClick(contact)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredContacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No contacts found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete {contactToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}