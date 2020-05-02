const API_KEY = "4e5a89deef016f718717de1e495beb9e";
const CITIES = {
  LONDON: "London",
  TORONTO: "Toronto",
  NEW_YORK_CITY: "New York City",
};
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const KelvinToCelcius = (kelvins) => kelvins - 273.15;

function OneDayDisplay(props) {
  let date = new Date(props.date);
  return (
    <div className="oneDayDisplay">
      <div className="day">
        <h2>{props.day}</h2>
        <p className="floatBottomDate">{MONTHS[date.getMonth()] + " " + date.getDate()}</p>
      </div>
      <p>Weather: {props.weather}</p>
      <p>Avg Temp: {props.avgTemp}°</p>
    </div>
  );
}

class ReactTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      citySelected: CITIES.LONDON,
      dailyWeather: {
        London: [],
      },
    };
  }

  fetchFiveDayWeather = (city) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((body) => {
        let fiveDayForcast = [];
        for (let i = 0; i < 40; i += 8) {
          fiveDayForcast.push({
            weather: body.list[i].weather[0].description,
            avgTemp: Math.round(KelvinToCelcius(body.list[i].main.temp)),
            day: DAYS[new Date(body.list[i].dt_txt).getDay()],
            date: body.list[i].dt_txt,
          });
        }
        this.setState({
          dailyWeather: { ...this.state.dailyWeather, [city]: fiveDayForcast },
        });
      })
      .catch((e) => {
        console.log(e.toString());
      });
  };

  componentDidMount() {
    Object.keys(CITIES).forEach((city) => {
      this.fetchFiveDayWeather(CITIES[city]);
    });
  }

  changeCity = (e) => {
    this.setState({ citySelected: e.target.value });
  };

  determineWeatherBackground = (todaysForcast) => {
    let result = "default";
    if (todaysForcast) {
      if (
        todaysForcast.weather.includes("rain") ||
        todaysForcast.weather.includes("drizzle") ||
        todaysForcast.weather.includes("thunderstorm")
      ) {
        result = "rainy";
      } else if (todaysForcast.weather.includes("cloud")) {
        result = "cloudySky";
      } else if (todaysForcast.weather.includes("clear")) {
        result = "clearSky";
      } else if (todaysForcast.weather.includes("snow")) {
        result = "snow";
      } else if (todaysForcast.weather.includes("mist")) {
        result = "snow";
      }
      return result;
    }
  };

  render() {
    let todaysForcast = this.state.dailyWeather[this.state.citySelected][0];
    let date = todaysForcast ? new Date(todaysForcast.date) : null
    let background = ["main", "default"];
    background[1] = this.determineWeatherBackground(todaysForcast);
    
    return (
      <div className={background.join(" ")}>
        <div className="today">
          <select
            id="cities"
            onChange={this.changeCity}
            value={this.state.citySelected}
          >
            {Object.keys(CITIES).map((city) => (
              <option value={CITIES[city]}>{CITIES[city]}</option>
            ))}
          </select>

          <div>
            <div className="day">
            <h2>Today</h2>
            <p className="floatBottomDate">{todaysForcast ? MONTHS[date.getMonth()] + " " + date.getDate() : null}</p>
            </div>
            <p>Forcast: {todaysForcast ? todaysForcast.weather : null}</p>
            <p>Avg Temp: {todaysForcast ? todaysForcast.avgTemp : null}°</p>
          </div>
        </div>

        <div className="future">
          {this.state.dailyWeather[this.state.citySelected]
            .slice(1)
            .map((dailyForcast) => {
              return (
                <OneDayDisplay
                  weather={dailyForcast.weather}
                  avgTemp={dailyForcast.avgTemp}
                  day={dailyForcast.day}
                  date={dailyForcast.date}
                />
              );
            })}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<ReactTest />, document.getElementById("container"));
