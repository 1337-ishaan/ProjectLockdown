import "./App.scss";
import { useState } from "react";
import { Map } from "./components/Map/Map";
import { LoadingAnimation } from "./components/LoadingAnimation/LoadingAnimation";
import TimeSlider from "./components/TimeSlider/TimeSlider";
import CountryInfo from "./components/CountryInfo/CountryInfo";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [haveSelectedDate, setHaveSelectedDate] = useState(false);
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({ t: (text) => text });
  // const [currentLanguage, setCurrentLanguage] = useState("en");

  const __onSelectDate = (selectedDate, startDate, endDate) => {
    setHaveSelectedDate(selectedDate);
    setStartDate(startDate);
    setEndDate(endDate);
  };
  return (
    <>
      <LoadingAnimation isLoading={isLoading} />
      <Map setIsLoading={setIsLoading}></Map>
      <TimeSlider onChange={__onSelectDate} i18n={currentLanguage} />
      <CountryInfo
        country="India"
        iso2="EN"
        wikidata=''
        date={haveSelectedDate || new Date()}
        i18n={currentLanguage}
        startDate={startDate}
        endDate={endDate}
        // onClose={this.__closeDialog}
      />
    </>
  );
}

export default App;
