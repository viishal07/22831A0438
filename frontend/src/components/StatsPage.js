import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const API = 'http://localhost:5000';

function StatsPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState({});

  useEffect(() => {
    fetch(`${API}/notes`).then(r => r.json()).then(setNotes).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (shortcode) => {
    await fetch(`${API}/notes/${shortcode}`, { method: 'DELETE' });
    setNotes(notes.filter(n => n.shortcode !== shortcode));
  };

  const toggleOpen = (shortcode) => {
    setOpen(prev => ({ ...prev, [shortcode]: !prev[shortcode] }));
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Notes Statistics</Typography>
      {loading ? <Typography>Loading...</Typography> : notes.length === 0 ? <Typography>No notes yet.</Typography> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Shortcode</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell>Views</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.map(note => (
                <React.Fragment key={note.shortcode}>
                  <TableRow>
                    <TableCell>
                      <IconButton size="small" onClick={() => toggleOpen(note.shortcode)}>
                        {open[note.shortcode] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <a href={`http://localhost:5000/${note.shortcode}`} target="_blank" rel="noopener noreferrer">{note.shortcode}</a>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.content}</TableCell>
                    <TableCell>{new Date(note.creationDate).toLocaleString()}</TableCell>
                    <TableCell>{new Date(note.expiryDate).toLocaleString()}</TableCell>
                    <TableCell>{note.totalViews}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(note.shortcode)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={open[note.shortcode]} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Typography variant="subtitle1">View Details</Typography>
                          {note.views.length === 0 ? <Typography>No views yet.</Typography> : (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Timestamp</TableCell>
                                  <TableCell>Source</TableCell>
                                  <TableCell>Location</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {note.views.map((v, i) => (
                                  <TableRow key={i}>
                                    <TableCell>{new Date(v.timestamp).toLocaleString()}</TableCell>
                                    <TableCell>{v.source || 'Direct'}</TableCell>
                                    <TableCell>{v.location}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default StatsPage; 