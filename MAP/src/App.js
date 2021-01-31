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
  const [daysRange, setDaysRange] = useState(70);
  const [showSlider, setShowSlider] = useState(false);

  const [dialog, setDialog] = useState({
    opened: false,
    template: "",
    title: "",
  });
  const __onSelectDate = (selectedDate, startDate, endDate) => {
    setHaveSelectedDate(selectedDate);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const __closeDialog = () => {
    setDialog({ opened: false, template: "", title: "" });
    // debouncedCloseDialog();
    // this.__closeCountryInfo();
  };

  const __openDialog = () => {
    setDialog({ opened: true, template: "", title: "" });
    // debouncedCloseDialog();
    // this.__closeCountryInfo();
  };
  console.log(dialog.opened);
  return (
    <>
      <LoadingAnimation isLoading={isLoading} />
      <Map onOpen={__openDialog} setIsLoading={setIsLoading}></Map>
      
      <TimeSlider onChange={__onSelectDate} i18n={currentLanguage}>
      {dialog.opened ? (
        <CountryInfo
        country="India"
        iso2="EN"
        wikidata=""
        date={haveSelectedDate || new Date()}
        i18n={currentLanguage}
        startDate={startDate}
        endDate={endDate}
        daysRange={daysRange}
        onClose={__closeDialog}
        onOpen={__openDialog}
      />

      ) : (
       ""
      )}
      </TimeSlider>
    </>
  );
}

export default App;
