//select all elements
const country_name_ele=document.querySelector(".country .name");
const total_cases_ele=document.querySelector(".total_cases .value");
const new_cases_ele=document.querySelector(".total_cases .new_value");

const recovered_ele=document.querySelector(".recovered .value");
const new_recovered_ele=document.querySelector(".recovered .new_value");

const death_ele=document.querySelector(".deaths .value");
const new_death_ele=document.querySelector(".deaths .new_value");

const ctx=document.getElementById("axes_line_chart").getContext("2d");

//app variables
let app_data=[],
cases_list=[],
deaths_list=[],
recovered_list=[],
dates=[],
formatedDates=[];

//get users country code

let country_code=geoplugin_countryCode();//this function will give country code using ip address (api use kia h)
let user_country;
country_list.forEach(country =>{
    if(country.code==country_code){
        user_country=country.name;
    }
});


function fetchData(country){
    user_country=country;
    country_name_ele.innerHTML = "Loading...";

  (cases_list = []),
    (recovered_list = []),
    (deaths_list = []),
    (dates = []),
    (formatedDates = []);

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const api_fetch = async (country) => {
    await fetch(
      "https://api.covid19api.com/total/country/" +
        country +
        "/status/confirmed",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          dates.push(entry.Date);
          cases_list.push(entry.Cases);
        });
      });

    await fetch(
      "https://api.covid19api.com/total/country/" +
        country +
        "/status/recovered",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          recovered_list.push(entry.Cases);
        });
      });

    await fetch(
      "https://api.covid19api.com/total/country/" + country + "/status/deaths",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          deaths_list.push(entry.Cases);
        });
      });

    updateUI();
  };

  api_fetch(country);
}

fetchData(user_country);

function updateUI() {
    updateStats();
    axesLinearChart();
  }

function updateStats() {
    const total_cases = cases_list[cases_list.length - 1];
    const new_confirmed_cases = total_cases - cases_list[cases_list.length - 2];
  
    const total_recovered = recovered_list[recovered_list.length - 1];
    const new_recovered_cases = total_recovered - recovered_list[recovered_list.length - 2];
  
    const total_deaths = deaths_list[deaths_list.length - 1];
    const new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2];
  
    country_name_ele.innerHTML = user_country;
    total_cases_ele.innerHTML = total_cases;
    new_cases_ele.innerHTML = `+${new_confirmed_cases}`;
    recovered_ele.innerHTML = total_recovered;
    new_recovered_ele.innerHTML = `+${new_recovered_cases}`;
    death_ele.innerHTML = total_deaths;
    new_death_ele.innerHTML = `+${new_deaths_cases}`;
  
    // format dates
    dates.forEach((date) => {
      formatedDates.push(formatDate(date));
    });
}



let my_chart;
function axesLinearChart() {
  if (my_chart) {
    my_chart.destroy();
  }

  my_chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Cases",
          data: cases_list,
          fill: false,
          borderColor: "rgb(192,243,235)",
          backgroundColor: "rgb(192,243,235)",
          borderWidth: 1,
        },
        {
          label: "Recovered",
          data: recovered_list,
          fill: false,
          borderColor: "#009688",
          backgroundColor: "#009688",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: deaths_list,
          fill: false,
          borderColor: "#FF0000",
          backgroundColor: "rgb(255,0,0)",
          borderWidth: 1,
        },
      ],
      labels: formatedDates,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// FORMAT DATES
const monthsNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(dateString) {
  let date = new Date(dateString);

  return `${date.getDate()} ${monthsNames[date.getMonth()-1]}`;
}




