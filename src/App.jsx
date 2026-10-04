import { useState, useEffect } from 'react'
import './App.css'
import Logo from './assets/Logo.png'
import Pic1 from './assets/pic1.png'
import Pic2 from './assets/pic2.png'
import Pic3 from './assets/pic3.png'
import RightArrow from './assets/rightWhite.png'
import RightArrowBlack from './assets/rightBlack.png'
import Search from './assets/search.png'
import { supabase } from './supabaseClient'
import Chopsticks from './assets/chopstick.png'
import Ramen from './assets/ramen.png'
import useDragScroll from './useDragScroll'
import WaveDivider from './WaveDivider'
import Dishes from './assets/dishes.png'
function statItem({end, label}) {
  const [counter, setCounter] = useState(0)
  useEffect(() => {
    let start = 0;
    const duration = 4000; 
    const increment = end / duration
    
    const stepTime = duration / (end * 10); // Thời gian giữa mỗi bước tăng
    const timer = setInterval(() => {
      start += 1;
      setCounter(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [end]);

  

  return (
    <div className="home_content_stats">
      <span style={{color: '#3A2418', fontWeight: 'bold', fontSize: '36px', fontFamily: 'Playfair Display', display: 'flex', justifyContent: 'flex-end' }}>
        {counter}+
      </span>
      <span className="home_content_stats_label">
        {label}
      </span>
    </div>
  )
}

const renderFood = (foodList) => {
  const displayedFood = foodList.slice(0, 5); // Hiển thị 4 món ăn đầu tiên
  if(displayedFood.length === 0) {
    return <p>No food items available.</p>
  }
  return displayedFood.map((item) => (
    <div key={item.id} className="food-item">
      <img src={item.image_url} alt={item.name} className="food-item-image" />
      <div className="food-item-details">
        <h3 className="food-item-name">{item.name}</h3>
        <p className="food-item-description">{item.description}</p>
        <p className="food-item-price">{item.min_price.toLocaleString()} - {item.max_price.toLocaleString()} VND</p>
      </div>
    </div>
  ))
}

//Render Specialty
const renderSpecialty = (foodlist) => {
  const displayedFood = foodlist.slice(0, 5);
  if (displayedFood.length === 0) {
    return <p>No specialty food available.</p>
  }

  return displayedFood.map((item) => (
    <div key={item.id} className="specialty-item">
      <img 
        src={item.image_url} 
        alt={item.name} 
        draggable={false}
        className="specialty-item-image" />
      <div className="specialty-item-details-container">
        <div className="specialty-item-details">
          <h3 className="specialty-item-name">{item.name}</h3>
          <p className="specialty-item-description">{item.description}</p>
          <div className="specialty-item-footer">
            <p className="specialty-item-price">{item.min_price.toLocaleString()} VND</p>
            <div className="specialty-item-rating">⭐{item.rating}</div>
          </div>
        </div>
      </div>
    </div>
  ))
}

const renderBlobs = () => {
  return (
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-7"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
        <div className="blob blob-6"></div>
        <div className="blob blob-8"></div>
        
      </div>
  )
}

function App() {
  const [filterTab, setFilterTab] = useState('breakfast'); // Tab mặc định là "Breakfast"
  const [foodData, setFoodData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ref: scrollRef, isDragging, handlers } = useDragScroll();



  useEffect(() => {
    async function fetchFoodData() {
      try {
        const { data, error} = await supabase.from('dishes').select('*');
        console.log('data:', data, 'error:', error);
        if (error) {
          console.error('Error fetching food data: ', error);
        } else {
          const withImageData = data.map(dish => ({
            ...dish,
            image_url: new URL(`./assets/dishes/${dish.slug}.jpg`, import.meta.url).href,
          }));
          setFoodData(withImageData);
        }
      } catch(error) {
        console.error('Error fetching food data: ', error);
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchFoodData();
   
  }, []);

  const handleTabClick = (tab) => {
    setFilterTab(tab);
  };

  const filteredFood = foodData.filter((item) => item.category === filterTab);

  useEffect(() => {
    // Khi filterTab thay đổi, bạn có thể thực hiện các hành động khác nếu cần
  }, [filterTab]);
 

  return (
    <>
      <main className="body">
        <section className="home" id="home">
          {/* Phần Home*/}
          <header className="home_header">
            <img src={Logo} alt="logo" className="logo" />
            <div className="home_navigator">
              <div className="home_navigator_item">
                <a href="#home">Home</a>
              </div>
              <div className="home_navigator_item">
                <a href="#menu">Food</a>
              </div>
              <div className="home_navigator_item">
                <a href="#about">About</a>
              </div>
              <div className="home_navigator_item">
                <a href="#specialty">Specialty</a>
              </div>
            </div>
            {/* Search bar */}
            <div className="home_search">
              <input type="text" placeholder="Search..." className="home_search_input" />
              <img src={Search} alt="search" className="home_search_icon" />
            </div>
          </header>
          <div className="home_content">
            <div className="home_content_intro">
              <div className="home_content_intro_content">
                <div className="home_content_intro_title">
                  <span style={{fontWeight: 'bold', fontSize: '20px', color: '#C20C65', display: 'flex', justifyContent: 'flex-start' }}>
                    Phan Thiet Cuisine
                  </span>
                  <span style={{color: '#3A2418'}}>Enjoy the most popular </span>
                  <span style={{color: '#3A2418'}}>Streetfood in Phan Thiet </span>
                  <p className="home_content_intro_desc">
                    Sun, salt and sea breeze in every bite.<br /> Discover the dishes that define Phan Thiet.
                  </p>
                  {statItem({end: 20, label: 'Dishes and Drinks'})}
                  {statItem({end: 10, label: 'Must-try Dishes'})}
                  {statItem({end: 5, label: 'Specialty Dishes'})}

                  {/*Nút discover và menu */}
                  <div className="home_content_intro_btns">

                    <button className="discover_btn">
                      <div className="discover_btn_content">
                        <span style={{fontSize: '30', fontFamily: 'Inria Serif, sans-serif'}}>Discover</span>
                        <img src={RightArrow} alt="right-arrow" className="discover_arrow" />
                      </div> 
                    </button>

                    <button className="menu_btn">
                      <div className="menu_btn_content">
                        <span style={{fontSize: '30', fontFamily: 'Inria Serif, sans-serif'}}>Menu</span>
                        <img src={RightArrowBlack} alt="right-arrow" className="discover_arrow" />
                      </div> 
                    </button>

                  </div>
                </div>
                

                <div className="home_content_pics"> 
                  <img src={Pic2} alt="pic2" className="home_content_pics_item2" />
                  <img src={Pic1} alt="pic1" className="home_content_pics_item1" />
                  <img src={Pic3} alt="pic3" className="home_content_pics_item3" />
                </div>
              </div>
            </div>

          </div>


        </section>

        {/* Phần Menu */}
        <section className="menu" id="menu">
          {renderBlobs()}
        
          <div className="menu_header">
            <div className="menu_header_title">
              <img src={Chopsticks} alt="chopsticks" className="menu_header_title_icon" />
              <h1 style={{fontSize: '50px', fontWeight: 'bold', color: '#F0629B', fontFamily: 'Playfair Display, sans-serif'}}>Popular Dishes</h1>
              <img src={Ramen} alt="ramen" className="menu_header_title_icon" />
            </div>
            <h2 style={{fontSize: '30px', fontWeight: 'bold', color: '#3A2418', fontFamily: 'Inria Serif, sans-serif'}}>Discover the most popular dishes in Phan Thiet</h2>
          </div>
          <div className="popular_dishes_tabs">
            <div className={`popular_dishes_tab ${'breakfast' === filterTab ? 'active' : ''}`} onClick={() => handleTabClick('breakfast')}>Breakfast</div>
            <div className={`popular_dishes_tab ${'lunch' === filterTab ? 'active' : ''}`} onClick={() => handleTabClick('lunch')}>Lunch</div>
            <div className={`popular_dishes_tab ${'dinner' === filterTab ? 'active' : ''}`} onClick={() => handleTabClick('dinner')}>Dinner</div>
            <div className={`popular_dishes_tab ${'desserts' === filterTab ? 'active' : ''}`} onClick={() => handleTabClick('desserts')}>Dessert</div>
          </div>
          <div className="popular_dishes">
            {isLoading ? <p className="loading">Loading food items...</p> : renderFood(filteredFood)}
          </div>
        </section>

        <section className="specialty" id="specialty">
          <div className="specialty-header">
            <div className="specialty-header-content">
              <h1 className="specialty-title">Specialty Dishes</h1>
              <img src={Dishes} alt="dishes" className="specialty-header-icon" />
            </div>
            <div className="specialty-subtitle-container">
              <h2 className="specialty-subtitle">Beyond the usual: dishes locals swear by</h2>
              <div className="specialty-header-line"></div>
            </div>
          </div>
         
          <div 
            className={`specialty-dishes ${isDragging ? 'is-dragging' : ''}`} 
            ref={scrollRef} {...handlers}>
            {isLoading ? <p className="loading">Loading specialty food items...</p> : renderSpecialty(filteredFood)}
          </div>
           <div className="specialty-quote">
            <div className="specialty-quote-line">
              <span className="specialty-quote-icon">“</span>
              <p className="specialty-quote-text">The best way to experience Phan Thiet is through its food.</p>
            </div>
            <div className="specialty-quote-line">
              <p className="specialty-quote-text">From the bustling markets to the quiet streets, every corner has a story to tell.</p>
              <span className="specialty-quote-icon">”</span>
            </div>
          </div>
          <WaveDivider />
        </section>
      </main>

    </>
  )
}
export default App
