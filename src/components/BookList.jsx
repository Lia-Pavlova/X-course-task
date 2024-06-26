import {useContext, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import {BooksContext} from '../contexts/BooksContext';
import {CartContext} from '../contexts/CartContext';
import {
    IconButton,
    Paper,
    Badge,
    Divider,
    Button,
    Typography,
    InputAdornment,
    Input,
    MenuItem,
    Select,
    Popover,
    Skeleton,
    Box
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CloseIcon from '@mui/icons-material/Close';

import notFoundImage from '../assets/noCover.png';
import noResults from '../assets/notFound.gif'

import cn from 'classnames';

function BookList({isUserLoggedIn, userName}) {
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [booksAfterFilter, setBooksAfterFilter] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [popOverTitle, setPopOverTitle] = useState('');
    const [anchorElQ, setAnchorElQ] = useState(null);
    const [sorryPopoverTitle, setSorryPopoverTitle] = useState('');

    const books = useContext(BooksContext);
    const {getQuantityById, addToCart, handleAddToCartAnimation} = useContext(
        CartContext
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (!isUserLoggedIn) {
            navigate('/signin');
        }
    }, [isUserLoggedIn]);

    useEffect(() => {
        const filteredBooks = books
            .filter(
                (book) => book.title.toLowerCase().includes(searchText.toLowerCase())
            )
            .filter((book) => {
                if (priceFilter === '0-15') {
                    return book.price <= 15;
                } else if (priceFilter === '15-30') {
                    return book.price > 15 && book.price <= 30;
                } else if (priceFilter === '>30') {
                    return book.price > 30;
                }
                return true;
            });

        setBooksAfterFilter(filteredBooks);
        if (books.length > 0) {
            setLoading(false);
        }
    }, [books, searchText, priceFilter]);

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const handlePriceFilterChange = (event) => {
        setPriceFilter(event.target.value);
    };

    const handleClickView = (event, bookID) => {
        event.stopPropagation();
        navigate(`/books/${bookID}`);
    };

    const handleClickPriceFilterOff = () => {
        setPriceFilter('all');
        setSearchText('');
    };

    const shortenTitle = (title) => {
        return title.length > 24
            ? title.substring(0, 24) + '...'
            : title;
    };

    const handlePopoverOpen = (event, bookTitle) => {
        if (bookTitle.length > 24) {
            setAnchorEl(event.currentTarget);
            setPopOverTitle(bookTitle);
        } else {
            setAnchorEl(null);
            setPopOverTitle('');
        }
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleAddToCartButtonClick = (event, book) => {
        event.preventDefault();
        event.stopPropagation();
        if (getQuantityById(book.id, userName) === book.amount) {
            setSorryPopoverTitle(`Sorry, we have only ${book.amount} books`);
            setAnchorElQ(event.currentTarget);
            setTimeout(() => {
                setAnchorElQ(null);
            }, 2000);
        } else {
            const bookItem = {
                id: book.id,
                price: book.price,
                quantity: 1,
                userName: userName
            };

            handleAddToCartAnimation(event, 1, book);
            addToCart(bookItem, false);
        }
    };

    const open = Boolean(anchorEl);

    return (
        <div className="bookList">
            {
                loading
                    ? (
                        <section className="bookListSection">
                            <section className="bookFilterSection">
                                <Skeleton
                                    variant="rounded"
                                    animation="wave"
                                    color="info"
                                    width={250}
                                    height={30}
                                    className="searchInput"/>
                                <Skeleton
                                    variant="rounded"
                                    animation="wave"
                                    color="info"
                                    width={250}
                                    height={30}
                                    className="selectPrice"/>
                                <Skeleton
                                    variant="circular"
                                    animation="wave"
                                    width={40}
                                    height={40}
                                    className="filterIcon"/>
                            </section>

                            <section className="bookListSection">
                                {
                                    Array(15)
                                        .fill()
                                        .map((item, index) => (
                                            <Paper elevation={6} className="bookCard" key={index}>
                                                <div className="bookCardHeader">
                                                    <Skeleton className="bookCardImage" variant="rectangular" animation="wave"/>
                                                    <Skeleton variant="text" animation="wave" width={190} height={30}/>
                                                    <Skeleton variant="text" animation="wave" width={190} height={30}/>
                                                </div>
                                                <Divider/>
                                                <div className="bookCardFooter">
                                                    <Skeleton
                                                        variant="text"
                                                        animation="wave"
                                                        width={200}
                                                        height={40}
                                                        style={{
                                                            marginRight: '10px'
                                                        }}/>
                                                    <Skeleton
                                                        variant="rounded"
                                                        animation="wave"
                                                        width={200}
                                                        height={40}
                                                        style={{
                                                            marginLeft: '10px'
                                                        }}/>
                                                </div>
                                            </Paper>
                                        ))
                                }
                            </section>
                        </section>
                    )
                    : (<section className="bookListSection">
                        <section className="bookFilterSection">
                            <Input
                                className="searchInput"
                                id="search"
                                startAdornment={<InputAdornment position = "start" > <SearchIcon/>
                            </InputAdornment>}
                                placeholder="Search by book name"
                                value={searchText}
                                onChange={handleSearchChange}/>
                            <Select
                                defaultValue="all"
                                id="priceFilter"
                                label=""
                                variant="standard"
                                className="selectPrice"
                                onChange={handlePriceFilterChange}
                                value={priceFilter}>
                                <MenuItem value="" disabled="disabled">
                                    Choose price
                                </MenuItem>
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="0-15">Between $0 and $15</MenuItem>
                                <MenuItem value="15-30">Between $15 and $30</MenuItem>
                                <MenuItem value=">30">Greater than $30</MenuItem>
                            </Select>
                            <IconButton
                                className={cn('filterIcon', {
                                    hidden: priceFilter === 'all' && searchText === ''
                                })}
                                aria-label="filter"
                                onClick={handleClickPriceFilterOff}>
                                <FilterAltOffIcon/>
                            </IconButton>
                        </section>
                        {
                            booksAfterFilter.length > 0
                                ? (booksAfterFilter.map((book) => (
                                    <Paper
                                        elevation={6}
                                        className="bookCard"
                                        key={book.id}
                                        onClick={(event) => handleClickView(event, book.id)}>
                                        <div className="bookCardHeader ">
                                            <Badge badgeContent={getQuantityById(book.id, userName)} color="info">
                                                <img
                                                    className="bookCardImage"
                                                    src={book.image || notFoundImage}
                                                    alt={book.title}/>
                                            </Badge>

                                            <h3
                                                className="bookCardTitle"
                                                onMouseEnter={(event) => handlePopoverOpen(event, book.title)}
                                                onMouseLeave={handlePopoverClose}>
                                                {shortenTitle(book.title)}
                                            </h3>
                                            <p>{book.author}</p>
                                        </div>
                                        <Divider/>
                                        <div className="bookCardFooter">
                                            <h3>${book.price}</h3>

                                            <IconButton
                                                aria-label="Add to cart"
                                                onClick={(event) => handleAddToCartButtonClick(event, book)}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    margin: '0'
                                                }}>
                                                <AddShoppingCartIcon/>
                                            </IconButton>

                                            <Button
                                                className="viewBtn"
                                                type="button"
                                                variant="contained"
                                                color="info"
                                                size="small"
                                                onClick={(event) => handleClickView(event, book.id)}>
                                                View
                                            </Button>
                                        </div>
                                    </Paper>
                                )))
                                : (
                                    <Box
                                        sx={{
                                            ml: '30%',
                                            mr: '30%',
                                            textAlign: 'center',
                                            color: 'rgb(2, 136, 209)'
                                        }}>
                                        <Typography component="p" variant="h6" align="center" margin="20px">
                                            Sorry, such books are not found!!!
                                        </Typography>
                                        <img
                                            src={noResults}
                                            alt="no results"
                                            style={{
                                                maxWidth: '300px',
                                                border: 'solid 3px',
                                                borderImageSource: 'linear-gradient(-45deg, #fc1ba6, #2AA5A0, #4094f6)',
                                                borderImageSlice: '1',
                                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                                            }}/>
                                    </Box>
                                )
                        }

                        <Popover
                            id="mouse-over-popover"
                            sx={{
                                pointerEvents: 'none'
                            }}
                            open={open}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus="disableRestoreFocus"
                            disableScrollLock="disableScrollLock">
                            <Typography
                                sx={{
                                    p: 1
                                }}>{popOverTitle}</Typography>
                        </Popover>
                    </section>
                    )}

            <Popover
                open={Boolean(anchorElQ)}
                anchorEl={anchorElQ}
                onClose={() => setAnchorElQ(null)}
                anchorReference="anchorEl"
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}>
                <div
                    style={{
                        padding: '10px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                    <CloseIcon
                        style={{
                            color: 'red',
                            marginRight: '10px'
                        }}/>
                    <span>{sorryPopoverTitle}</span>
                </div>
            </Popover>
        </div>
    );
}

export default BookList;
