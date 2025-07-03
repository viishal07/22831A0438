import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const API = 'http://localhost:5000';

function NotesForm() {
  const [inputs, setInputs] = useState([
    { content: '', validity: 30, shortcode: '', error: '', result: null },
  ]);

  const handleChange = (idx, field, value) => {
    const newInputs = [...inputs];
    newInputs[idx][field] = value;
    setInputs(newInputs);
  };

  const addRow = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { content: '', validity: 30, shortcode: '', error: '', result: null }]);
    }
  };

  const removeRow = (idx) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((_, i) => i !== idx));
    }
  };

  const validate = (input) => {
    if (!input.content) return 'Note content required';
    if (input.shortcode && !/^[a-zA-Z0-9]{4,12}$/.test(input.shortcode)) return 'Shortcode must be 4-12 alphanumeric chars';
    if (input.validity && (isNaN(input.validity) || input.validity < 1 || input.validity > 1440)) return 'Validity 1-1440 min';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newInputs = await Promise.all(inputs.map(async (input) => {
      const error = validate(input);
      if (error) return { ...input, error, result: null };
      try {
        const res = await fetch(`${API}/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: input.content,
            validity: input.validity,
            shortcode: input.shortcode || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) return { ...input, error: data.error || 'Error', result: null };
        return { ...input, error: '', result: data };
      } catch {
        return { ...input, error: 'Network error', result: null };
      }
    }));
    setInputs(newInputs);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>New Notes</Typography>
      <Stack spacing={2}>
        {inputs.map((input, idx) => (
          <Paper key={idx} sx={{ p: 2, position: 'relative' }}>
            <Stack spacing={1}>
              <TextField
                label="Note Content"
                value={input.content}
                onChange={e => handleChange(idx, 'content', e.target.value)}
                fullWidth
                multiline
                minRows={2}
              />
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Validity (min)"
                  type="number"
                  inputProps={{ min: 1, max: 1440 }}
                  value={input.validity}
                  onChange={e => handleChange(idx, 'validity', e.target.value)}
                  sx={{ width: 150 }}
                />
                <TextField
                  label="Shortcode (optional)"
                  value={input.shortcode}
                  onChange={e => handleChange(idx, 'shortcode', e.target.value)}
                  sx={{ width: 200 }}
                />
                {inputs.length > 1 && (
                  <IconButton onClick={() => removeRow(idx)} color="error">
                    <DeleteIcon />
                  </IconButton>
                )}
              </Stack>
              {input.error && <Typography color="error">{input.error}</Typography>}
              {input.result && (
                <Box sx={{ color: 'green' }}>
                  Note Link: <a href={input.result.noteLink} target="_blank" rel="noopener noreferrer">{input.result.noteLink}</a><br />
                  Expires: {new Date(input.result.expiry).toLocaleString()}
                </Box>
              )}
            </Stack>
          </Paper>
        ))}
        <Stack direction="row" spacing={2}>
          {inputs.length < 5 && <Button onClick={addRow} variant="outlined">Add Note</Button>}
          <Button type="submit" variant="contained">Create Notes</Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default NotesForm; 