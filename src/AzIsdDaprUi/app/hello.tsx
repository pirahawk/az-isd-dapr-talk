import * as React from "react";
import { createRoot } from "react-dom/client";

interface Forecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

export function Hello(){
    const [message, setMessage] = React.useState('Hello React');
    const [weather, setWeather] = React.useState<Forecast[]>([]);

    React.useEffect(()=>{
        populateWeatherData();
    }, []);

    const weatherList = weather.map((forcast, index, arr) =>{

        return (<li key={forcast.date}>{`${forcast.date}|${forcast.summary}|${forcast.temperatureC}`}</li>);
    })

    return (
        <div>
                <div className="hello">{message}</div>
                <ol className="weather">{weatherList}</ol>
        </div>

    );

    async function populateWeatherData() {
        const response = await fetch('/weatherforecast');
        const data = await response.json();
        setWeather(data);
        setMessage('Data retrieved');
    }
}

// let helloElement = document.getElementById("hello-test");

// if(helloElement){
//     const root = createRoot(helloElement);
//     root.render(<Hello />);
// }