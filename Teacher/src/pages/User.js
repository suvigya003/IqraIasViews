import { filter } from 'lodash';
import axios from 'axios';
import { sentenceCase } from 'change-case';
import React, { useEffect, useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
// import Checkbox from '@mui/joy/Checkbox';
// import List from '@mui/joy/List';
import ListItem from '@mui/material/ListItem';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'S No', alignRight: false },
  { id: 'company', label: "Student's Name", alignRight: false },
  { id: 'role', label: 'Date', alignRight: false },
  { id: 'isVerified', label: 'Evaluate', alignRight: false },
  { id: 'status', label: 'Assign To', alignRight: false },
  { id: '' },
];
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  // boxShadow: 10,
  p: 4,
  borderRadius: '8px',
};
const style1 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  // boxShadow: 10,
  p: 4,
  borderRadius: '8px',
};
// ----------------------------------------------------------------------
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const [comment, setComment] = useState();
  const [resultFile, setResultFile] = useState();
  const [answerEvaluations, setAnswerEvaluations] = useState([]);
  const [evaluate, setEvaluate] = useState({
    comment: '',
  });
  const [answerFile, setAnswerFile] = useState();

  const handleResultFile = (e) => {
    setResultFile(e.target.files[0], '$$$$');
    console.log(resultFile);
  };

  const handleComment = (e) => {
    setComment(e.target.value);
    console.log(comment);
  };

  useEffect(() => {
    const getCustomerInfoData = async () => {
      const { data, studentId } = await axios.get(`http://localhost:8000/teacher/getAnswerEvaluations/3`);

      setAnswerEvaluations(data.data);
    };

    getCustomerInfoData();
  }, []);

  console.log(answerEvaluations);

  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [open1, setOpen1] = React.useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  function handleAnswerFile(answerFile) {
    setAnswerFile(answerFile);
  }

  console.log(answerFile);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('hey');
    try {
      const formData = new FormData();
      formData.append('resultFile', resultFile);
      formData.append('comment', comment);
      formData.append('studentId', 2);
      formData.append('answerFile', answerFile);

      console.log(formData);
      await axios
        .post(`http://localhost:8000/teacher/addResult/2`, formData)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      setEvaluate({
        comment: '',
      });

      alert('Information submitted successfully');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Page title="User">
      <Container>
        {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button>
        </Stack> */}

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {answerEvaluations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, studentId, studentName, answerFile, createdAt } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell> */}
                        <TableCell align="left">{id}</TableCell>
                        <TableCell align="left">{answerFile}</TableCell>
                        <TableCell align="left">{createdAt.slice(0, 10)}</TableCell>
                        <TableCell align="left">
                          <Button variant="contained" onClick={handleOpen}>
                            Evaluate
                          </Button>
                          <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <form onSubmit={handleSubmit}>
                              <Box sx={style}>
                                <Grid container spacing={3}>
                                  <Grid item xs={6}>
                                    <Button
                                      variant="outlined"
                                      component="label"
                                      sx={{ width: '100%', ml: { md: 1 }, mt: { xs: 2, md: 0 }, height: '50px' }}
                                      // onClick={() => handleAnswerFile(answerFile)}
                                    >
                                      Download Copy: {answerFile}
                                      <input hidden accept="image/*" type="file" />
                                    </Button>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Button
                                      variant="outlined"
                                      value={resultFile}
                                      onChange={(e) => handleResultFile(e)}
                                      component="label"
                                      sx={{ width: '100%', ml: { md: 1 }, mt: { xs: 2, md: 0 }, height: '50px' }}
                                    >
                                      Upload Copy
                                      <input
                                        hidden
                                        // accept="image/*"
                                        type="file"
                                      />
                                    </Button>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TextField
                                      label="Comment"
                                      value={comment}
                                      onChange={(e) => handleComment(e)}
                                      variant="outlined"
                                      fullWidth
                                      sx={{ mr: { md: 1 } }}
                                      type="text"
                                      name="comment"
                                      // value={sList.oldPassword}
                                      // onChange={handleChange}
                                    />
                                  </Grid>
                                </Grid>
                                <Box mt={3}>
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    // onClick={handleOpen3}
                                  >
                                    Submit
                                  </Button>
                                </Box>
                              </Box>
                            </form>
                          </Modal>
                        </TableCell>
                        <TableCell align="left">
                          <Button variant="contained" onClick={handleOpen1}>
                            Assign
                          </Button>
                          <Modal
                            open={open1}
                            onClose={handleClose1}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style1}>
                              <Grid container spacing={3}>
                                <Grid item xs={12}>
                                  <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-checkbox-label">Assign To</InputLabel>
                                    <Select
                                      labelId="demo-multiple-checkbox-label"
                                      id="demo-multiple-checkbox"
                                      multiple
                                      value={personName}
                                      onChange={handleChange}
                                      input={<OutlinedInput label="Tag" />}
                                      renderValue={(selected) => selected.join(', ')}
                                      MenuProps={MenuProps}
                                    >
                                      {names.map((name) => (
                                        <MenuItem key={name} value={name}>
                                          <Checkbox checked={personName.indexOf(name) > -1} />
                                          <ListItemText primary={name} />
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                  <Button
                                    variant="contained"
                                    // onClick={handleOpen2}
                                  >
                                    Assign
                                  </Button>
                                </Grid>
                              </Grid>
                            </Box>
                          </Modal>
                        </TableCell>
                        {/* <TableCell align="left">
                          <Label variant="ghost" color={(status === 'banned' && 'error') || 'success'}>
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}

                        {/* <TableCell align="right">
                          <UserMoreMenu />
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
