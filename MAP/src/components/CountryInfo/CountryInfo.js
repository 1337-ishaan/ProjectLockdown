import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";

import {
  coronaTrackerService,
  // populationService,
  countryDetailService,
} from "../../services/services";
import _ from "lodash";

import {
  home,
  citymovement,
  religion,
  work,
  military,
  academia,
  shops,
  electricity,
  water,
  internet,
  close as closeIcon,
} from "../../assets/icons/icons.js";
import {
  offline,
  loading,
  travelFlight,
  travelLand,
  travelSea,
} from "../../assets/icons/icons.js";
import { offlineStyles, loadingStyles } from "../../style/shared.styles.scss";
import { countryInfoStyles, tabStyles, reports } from "./CountryInfo.styles.js";

// ? Wrappers

// import "./tool-tip.js";
// TODO: Change the api to give us that data
import CountriesDataList from "../../data/territoriesData";
import { useState } from "react";

const TRAVEL = {
  1: "YES",
  2: "PARTIALLY",
  3: "NO",
  4: "UNCLEAR",
  5: "NA",
};

const MEASURE_VALUES = {
  1: "YES",
  2: "PARTIAL",
  3: "NO",
  4: "UNCLEAR",
};

const TRAVELTYPE = ["Land", "Flight", "Sea"];

const TRANSLATIONS = {
  commerce: {
    text: "commerce",
  },
  foreigners_inbound: {
    text: "foreignersInbound",
  },
  foreigners_outbound: {
    text: "foreignersOutbound",
  },
  local: {
    text: "local",
  },
  nationals_inbound: {
    text: "nationalsInbound",
  },
  nationals_outbound: {
    text: "nationalsOutbound",
  },
  stopovers: {
    text: "stopovers",
  },
  cross_border_workers: {
    text: "crossBorderWorkers",
  },
};

const MEASURES = [
  {
    id: "lockdown_status",
    label: "Stay Home",
    translationKey: "home",
    icon: home,
  },
  {
    id: "going_to_shops",
    label: "Shopping",
    translationKey: "shopping",
    icon: shops,
  },
  {
    id: "city_movement_restriction",
    label: "Outdoors",
    translationKey: "outdoors",
    icon: citymovement,
  },
  {
    id: "military_not_deployed",
    label: "Military",
    translationKey: "military",
    icon: military,
  },
  {
    id: "attending_religious_sites",
    label: "Religious Sites",
    translationKey: "religious",
    icon: religion,
  },
  {
    id: "electricity_nominal",
    label: "Electricity",
    translationKey: "electricity",
    icon: electricity,
  },
  {
    id: "going_to_work",
    label: "Go to Work",
    translationKey: "work",
    icon: work,
  },
  {
    id: "water_nominal",
    label: "Water",
    translationKey: "water",
    icon: water,
  },
  {
    id: "academia_allowed",
    label: "Go to Schools",
    translationKey: "schools",
    icon: academia,
  },
  {
    id: "internet_nominal",
    label: "Telecom",
    translationKey: "internet",
    icon: internet,
  },
];

const tabs = [
  {
    id: 1,
    name: "dailyLife",
  },
  {
    id: 2,
    name: "mobility",
  },
  {
    id: 3,
    name: "reports",
  },
];

function createMeasures(apiMeasures) {
  return MEASURES.map((measure) => {
    const apiData = apiMeasures?.find((m) => m.label === measure.id);

    return {
      ...measure,
      value: MEASURE_VALUES[apiData.value] ?? MEASURE_VALUES[4],
    };
  });
}

const CountryInfo = (props) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [coronaData, setCoronaData] = useState(
    coronaTrackerService.getCountry({
      iso2: props.iso2,
      date: props.date,
      startDate: props.startDate,
      endDate: props.endDate,
    })
  );
  const [countryDetails, setCountryDetails] = useState({
    iso2: props.iso2,
    date: props.date,
    startDate: props.date,
    endDate: props.endDate,
    daysRange: props.dayRange,
  });
  const [populationData, setPopulationData] = useState(
    countryDetailService.getDetails({
      iso2: props.iso2,
      date: props.date,
      startDate: props.startDate,
      endDate: props.endDate,
      daysRange: props.daysRange,
    })
  );

  // async componentDidUpdate(prevProps) {
  //     if (this.props.date !== prevProps.date) {
  //       const { startDate, endDate, daysRange } = this.props;
  //       this.setState({
  //         coronaData: await coronaTrackerService.getCountry({
  //           iso2: this.props.iso2,
  //           date: this.props.date,
  //           startDate,
  //           endDate,
  //         }),
  //         countryDetails: await countryDetailService.getDetails({
  //           iso2: this.props.iso2,
  //           date: this.props.date,
  //           startDate,
  //           endDate,
  //           daysRange,
  //         }),
  //       });
  //     }
  //   }

  //   async componentWillMount() {
  //     const { startDate, endDate, daysRange } = this.props;
  //     this.setState({
  //       coronaData: await coronaTrackerService.getCountry({
  //         iso2: this.props.iso2,
  //         date: this.props.date,
  //         startDate,
  //         endDate,
  //       }),
  //       populationData: await populationService.getPopulation(),
  //       countryDetails: await countryDetailService.getDetails({
  //         iso2: this.props.iso2,
  //         date: this.props.date,
  //         startDate,
  //         endDate,
  //         daysRange,
  //       }),
  // });
  //   }

  const changeTab = (newTab) => {
    setCurrentTab(newTab);
  };

  let { i18n } = props;
  let territoryData = CountriesDataList[props.wikidata];
  /** If the user is offline, and theres no response, or the response has failed */
  // if (!navigator.onLine) {
  //   if (
  //     coronaData?.status !== "success" ||
  //     populationData?.data?.status !== "success" ||
  //     countryDetails?.status !== "success"
  //   ) {
  //     return (
  //       <div className={`countryInfo ${offlineStyles}`}>
  //         {" "}
  //         {offline}
  //         <b>You are not connected to the internet</b>
  //         <p>
  //           Information for this country can't be displayed because you are
  //           currently offline. Please check your internet connection.
  //         </p>
  //       </div>
  //     );
  //   }
  // }

  /** If there is no data available but the user is online, show loading state */
  // if (!coronaData && !populationData && !countryDetails && navigator.onLine) {
  //   return (
  //     <div className={`countryInfo loader ${loadingStyles}`}>${loading}</div>
  //   );
  // }

  /** On error & on succes, continue to render */
  console.log(populationData);
  return (
    <>
      <div className={tabStyles}>
        {tabs.map((tab) => (
          <div
            onClick={() => changeTab(tab.id)}
            class={`tab ${currentTab === tab.id ? "active" : ""}`}
          >
            {/* tdo.tabs.{tab.name}.name */}
            {tab.name}

            {/* {_.i18n.t(`tdo.tabs.${tab.name}.name`)} */}
          </div>
        ))}
        <button>{closeIcon}</button>
      </div>
      <div class={`{countryInfo ${countryInfoStyles}}`}>
        {currentTab === 1 ? (
          <CountryDetails
            date={props.date}
            country={props.country}
            coronaData={coronaData.data?.find((corona) =>
              isSameDay(new Date(corona.last_updated), props.date)
            )}
            // populationData={populationData?.data[props.iso2]}
            countryDetails={countryDetails}
            i18n={i18n}
          />
        ) : currentTab === 2 ? (
          <TransportDetails countryDetails={countryDetails} />
        ) : (
          <>
            <Reports />
            <div class="link-container">
              <a
                class="ld-link"
                target="_blank"
                rel="noopener noreferrer"
                href={
                  territoryData
                    ? `https://docs.google.com/a/theiofoundation.org/spreadsheets/d/1mVyQxxLxAF3E1dw870WHXTOLgYzmumojvzIekpgvLV0/edit#gid=${territoryData.id}`
                    : "tiof.click/LockdownData"
                }
                target="_blank"
              >
                {/* {_.i18n.t(`tdo.contributionLinks.firstLink`)} */}
              </a>
              <a
                class="ld-link"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://docs.google.com/forms/d/e/1FAIpQLSfDWe2qlzUnd3e-YYspMzT9adUswDEYIdJMb7jz7ule34-yiA/viewform?entry.333088473=${
                  territoryData ? territoryData.region : "REGION"
                }&entry.1690056710=${
                  territoryData ? territoryData.territory : "TERRITORY"
                }`}
                target="_blank"
              >
                {/* {_.i18n.t(`tdo.contributionLinks.secondLink`)} */}
              </a>
              {/* <!-- <a class="ld-link" target="_blank" rel="noopener noreferrer" href="#" target="_blank">
            ${_.i18n.t(`tdo.contributionLinks.thirdLink`)}
          </a> --> */}
            </div>
          </>
        )}
      </div>
    </>
  );
};

const CountryDetails = (props) => {
  let { i18n } = _;
  let { coronaData, populationData, countryDetails, country, date } = props;
  return (
    <>
      <h2 class="ld-font-subheader">
        <span>{country}</span> <span>{format(date, "dd/MM/yyyy")}</span>
      </h2>
      <dl class="data">
        <div class="data-entry is-half">
          {/* <dt>{i18n.t("tdo.tabs.dailyLife.stats.population")}</dt>
          <dd class="data-value">
            {!isNaN(Number(populationData?.Population))
              ? Number(populationData?.Population).toLocaleString() ?? "Error"
              : i18n.t("tdo.tabs.dailyLife.noResults")} */}
          {/* </dd> */}
        </div>
        <div class="data-entry is-half">
          {/* <dt>{i18n.t("tdo.tabs.dailyLife.stats.max_assembly")}</dt> */}
          <dd class="data-value">
            {/* {countryDetails?.max_gathering ??
              i18n.t("tdo.tabs.dailyLife.noResults")} */}
          </dd>
        </div>
        <div class="data-entry is-third">
          {/* <dt>${i18n.t("tdo.tabs.dailyLife.stats.cases")}</dt> */}
          {/* <dd class="data-value">
            {coronaData?.total_confirmed
              ? Number(coronaData?.total_confirmed).toLocaleString()
              : i18n.t("tdo.tabs.dailyLife.noResults")}
          </dd> */}
        </div>
        <div class="data-entry is-third">
          {/* <dt>{i18n.t("tdo.tabs.dailyLife.stats.recoveries")}</dt> */}
          {/* <dd class="data-value">
            {coronaData?.total_recovered
              ? Number(coronaData?.total_recovered).toLocaleString()
              : i18n.t("tdo.tabs.dailyLife.noResults")}
          </dd> */}
        </div>
        <div class="data-entry is-third">
          {/* <dt>${i18n.t("tdo.tabs.dailyLife.stats.deaths")}</dt> */}
          <dd class="data-value">
            {/* {coronaData?.total_deaths
              ? Number(coronaData?.total_deaths).toLocaleString()
              : i18n.t("tdo.tabs.dailyLife.noResults")} */}
          </dd>
        </div>
      </dl>
      <Legends tab="dailyLife" />
      {countryDetails.status === "success" ? (
        <>
          <h2 class="ld-font-subheader last">
            {/* {i18n.t("tdo.tabs.dailyLife.subtitle")} */}
          </h2>
          <ul class="measures">
            {createMeasures(countryDetails.measures).map((m) => (
              <li>
                <div class="measure-wrapper">
                  <div
                    aria-labelledby={`measure-label-${m.id}`}
                    class="measure measure-${m.value}"
                    aria-label="${m.value.toLowerCase()}"
                  >
                    {m.icon}
                  </div>
                  <span id={`measure-label-${m.id}`} class="measure-label">
                    {/* {i18n.t(`tdo.tabs.dailyLife.measures.${m.translationKey}`)} */}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div class="dialog">
          <h2>Measures</h2>
          Failed to get data for this country.
        </div>
      )}
    </>
  );
};
const TransportDetails = (props) => {
  let { countryDetails } = props;
  // let { i18n } = props;

  return (
    <>
      {countryDetails.status === "success" ? (
        <>
          <br />
          <br />
          <Legends tab="mobility" />
          <h2 class="ld-font-subheader last transport">
            {/* ${i18n.t("tdo.tabs.mobility.subtitle")} */}
          </h2>
          <dl>
            <div class="ld-travel">
              <dt></dt>
              <div class="ld-travel--values">
                <dd class="ld-travel--val-icon">{travelLand}</dd>
                <dd class="ld-travel--val-icon">{travelFlight}</dd>
                <dd class="ld-travel--val-icon">{travelSea}</dd>
              </div>
            </div>
            {Object.keys(countryDetails.travel).map((key, j) => {
              return (
                <div class="ld-travel">
                  <dt>
                    {/* {i18n.t(
                      `tdo.tabs.mobility.measures.${TRANSLATIONS[key].text}`
                    )} */}
                  </dt>
                  <div class="ld-travel--values">
                    {countryDetails.travel[key].map((val, i) => (
                      <dd
                        aria-label="${TRAVELTYPE[i]}: ${TRAVEL[val]?.toLowerCase() ?? TRAVEL[4].toLowerCase()}"
                        data-tooltip="${TRAVEL[val]?.toLowerCase() ?? TRAVEL[4].toLowerCase()}"
                        class="ld-travel--symbol ld-travel--val-${TRAVEL[val] ?? TRAVEL[5]}"
                      ></dd>
                    ))}
                  </div>
                </div>
              );
            })}
          </dl>
        </>
      ) : (
        <div class="dialog">
          <h2>Measures</h2>
          Failed to get data for this country.
        </div>
      )}
    </>
  );
};

const Legends = () => {
  // let {  tab } = _;
  return (
    <div class="legend ld-font-legend">
      <dl>
        <div class="legend-item">
          <dt class="legend-green" aria-label="green"></dt>
          {/* <dd>{i18n.t(`tdo.tabs.${tab}.measureValues.3`)}</dd> */}
        </div>
        <div class="legend-item">
          <dt class="legend-yellow" aria-label="yellow"></dt>
          {/* <dd>{i18n.t(`tdo.tabs.${tab}.measureValues.2`)}</dd> */}
        </div>
        <div class="legend-item">
          <dt class="legend-red" aria-label="red"></dt>
          {/* <dd>{i18n.t(`tdo.tabs.${tab}.measureValues.1`)}</dd> */}
        </div>
        <div class="legend-item">
          <dt class="legend-gray" aria-label="gray"></dt>
          {/* <dd>{i18n.t(`tdo.tabs.${tab}.measureValues.4`)}</dd> */}
        </div>
      </dl>
    </div>
  );
};

const Reports = () => {
  // let { i18n } = _;
  return (
    <div className={`${reports}`}>
      {/* <h3>{i18n.t(`tdo.tabs.reports.subtitle`)}</h3> */}
      <div className="placeholder"></div>
    </div>
  );
};

export default CountryInfo;
