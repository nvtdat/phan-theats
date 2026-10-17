import { useState, useEffect, useRef} from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchFoodDetails, fetchFoodData } from './foodAPI'
import Search from './assets/search.png'
import './App.css'

function SearchBar() {
    const [active, setActive] = useState(false);
    const [query, setQuery] = useState('');
    const [allFood, setAllFood] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    //Load dữ liệu trong một lần
    useEffect(() => {
        async function loadData() {
            const data = await fetchFoodData();
            setAllFood(data);
        }
        loadData();
    }, []);

    //Lọc kết quả mỗi khi người dùng gõ 
    useEffect(() => {
        if(query.trim() === '') {
            setSearchResults([]);
            setIsOpen(false);
            return;
        }

        const keywords = query.trim().toLowerCase();
        const results = allFood.filter((food) => {
            return food.name.toLowerCase().includes(keywords);
        })
        setSearchResults(results.slice(0, 5));
        setIsOpen(true);
    }, [query, allFood]);

    // Xử lý khi người dùng nhấp vào kết quả tìm kiếm
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ( inputRef.current && !inputRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputRef]);

    function handleResultClick(slug) {
        navigate(`/food/${slug}`);
        // Đóng dropdown và xóa query sau khi điều hướng
        setIsOpen(false);
        setQuery('');
        setSearchResults([]);
    }

    return (
        <div className="home_search_wrapper" ref={inputRef}>
            <div className={`home_search ${active ? 'active' : ''}`} onClick={() => setActive(true)} onBlur={() => setActive(false)}>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className={`home_search_input ${active ? 'active' : ''}`} 
                    onClick={() => setActive(true)}
                    onBlur={() => setActive(false)}
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query && setIsOpen(true)}
                />
                <img src={Search} alt="search" className="home_search_icon" />
                {isOpen && searchResults.length > 0 && (
                    <div className="search-dropdown">
                        {searchResults.map((result) => (
                            <div
                                key={result.slug}
                                className="search-dropdown-item"
                                onClick={() => handleResultClick(result.slug)}
                            >
                                <img src={result.image_url} alt={result.name} className="search-dropdown-image" />
                                <span className="search-dropdown-name">{result.name}</span>
                            </div>
                        ))}
                    </div>
                )}
                {isOpen && query && searchResults.length === 0 && (
                    <div className="search-dropdown">
                        <div className="search-dropdown-item">
                            <span className="search-dropdown-name"> No food found </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchBar