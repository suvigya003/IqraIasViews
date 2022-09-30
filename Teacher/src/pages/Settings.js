import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
    Box,
    Grid,
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import TextField from '@mui/material/TextField';

export default function Settings(){
    return(
        <>
            <Card>
                <Box p={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                    <TextField
                label="Old Password"
                variant="outlined"
                fullWidth
                sx={{ mr: { md: 1 } }}
                type="password"
                name="oldPassword"
                // value={sList.oldPassword}
                // onChange={handleChange}
              />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                label="New Password"
                variant="outlined"
                fullWidth
                sx={{ mr: { md: 1 } }}
                type="password"
                name="newPassword"
                // value={sList.newPassword}
                // onChange={handleChange}
              />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                label="Confirm New Password"
                variant="outlined"
                fullWidth
                sx={{ mr: { md: 1 } }}
                type="password"
                name="conNewPassword"
                // value={sList.conNewPassword}
                // onChange={handleChange}
              />
                    </Grid>
                </Grid>
                <Box mt={3}>
                <Button variant="contained" mt={3}>Change</Button>
                </Box>                
                </Box>
                
            </Card>
        </>
    );
}