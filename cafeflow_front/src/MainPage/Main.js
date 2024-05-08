import "../App.css";
import MainSection from "./MainSection";
import SearchSection from "./SearchSection";

function Main() {
  return (
    <>
      <MainSection />
      <div className="search-box">
        <p className="Logo-font">Shop Search</p>
      </div>
      <SearchSection placeholder="지역을 검색하여 카페를 찾으세요 예시.(경북 구미시)" />
    </>
  );
}

export default Main;
